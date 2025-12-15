import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * EZEE Payments Webhook Handler
 * 
 * EZEE sends form data (application/x-www-form-urlencoded) with:
 * - ResponseCode: "1" = Success, any other number = Failure
 * - ResponseDescription: Description of the response
 * - TransactionNumber: Reference number for reconciliation
 * - order_id: The order ID passed during token creation
 */
export async function POST(request: NextRequest) {
  try {
    // Parse form data from EZEE
    const formData = await request.formData();
    
    const responseCode = formData.get('ResponseCode')?.toString();
    const responseDescription = formData.get('ResponseDescription')?.toString();
    const transactionNumber = formData.get('TransactionNumber')?.toString();
    const orderId = formData.get('order_id')?.toString();

    console.log('EZEE Webhook received:', {
      responseCode,
      responseDescription,
      transactionNumber,
      orderId,
    });

    if (!responseCode || !transactionNumber) {
      return NextResponse.json(
        { error: 'Missing required fields: ResponseCode and TransactionNumber' },
        { status: 400 }
      );
    }

    if (!orderId) {
      console.warn('Webhook received without order_id, cannot match payment');
      // Still return 200 to acknowledge receipt
      return new Response('OK', { status: 200 });
    }

    const supabase = await createClient();

    // Find payment by order_id
    const { data: payment, error: findError } = await supabase
      .from('payments')
      .select('id, company_id, payment_type, enrollment_id, order_id, metadata')
      .eq('order_id', orderId)
      .single();

    if (findError || !payment) {
      console.error('Payment not found for order_id:', orderId, findError);
      // Still return 200 to acknowledge receipt (idempotency)
      return new Response('OK', { status: 200 });
    }

    // ResponseCode = "1" means success, anything else is failure
    const isSuccess = responseCode === '1';
    const paymentStatus = isSuccess ? 'completed' : 'failed';

    // Update payment record
    const updateData: any = {
      status: paymentStatus,
      ezee_transaction_id: transactionNumber,
      ezee_response_description: responseDescription || null,
      processed_at: new Date().toISOString(),
    };

    if (isSuccess) {
      updateData.paid_at = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from('payments')
      .update(updateData)
      .eq('id', payment.id);

    if (updateError) {
      console.error('Error updating payment:', updateError);
      // Still return 200 to acknowledge receipt
      return new Response('OK', { status: 200 });
    }

    // Handle course activation payment
    if (isSuccess && payment.payment_type === 'course_activation') {
      const metadata = payment.metadata as any;
      const courseActivationId = metadata?.course_activation_id;

      if (courseActivationId) {
        // Update course activation status to active
        const { error: activationError } = await supabase
          .from('course_activations')
          .update({
            status: 'active',
            updated_at: new Date().toISOString(),
          })
          .eq('id', courseActivationId);

        if (activationError) {
          console.error('Error activating course:', activationError);
        } else {
          // Update associated invoice status to paid
          const { data: invoice } = await supabase
            .from('invoices')
            .select('id')
            .eq('course_activation_id', courseActivationId)
            .single();

          if (invoice) {
            await supabase
              .from('invoices')
              .update({
                status: 'paid',
                paid_at: new Date().toISOString(),
                payment_method: 'ezee_payments',
                payment_reference: transactionNumber,
                updated_at: new Date().toISOString(),
              })
              .eq('id', invoice.id);
          }
        }
      }
    }

    // Legacy: If setup fee is paid, mark company as having paid setup fee
    if (isSuccess && payment.payment_type === 'setup_fee' && payment.company_id) {
      const { error: companyError } = await supabase
        .from('companies')
        .update({
          setup_fee_paid: true,
          setup_fee_paid_at: new Date().toISOString(),
        })
        .eq('id', payment.company_id);

      if (companyError) {
        console.error('Error updating company setup fee status:', companyError);
      }
    }

    // Legacy: If setup fee is paid, activate enrollment (if enrollment_id exists)
    if (isSuccess && payment.payment_type === 'setup_fee' && payment.enrollment_id) {
      const { error: enrollmentError } = await supabase
        .from('enrollments')
        .update({
          setup_fee_paid: true,
          status: 'active',
          activated_at: new Date().toISOString(),
        })
        .eq('id', payment.enrollment_id);

      if (enrollmentError) {
        console.error('Error activating enrollment:', enrollmentError);
      }
    }

    // Return 200 to acknowledge receipt (required by EZEE)
    return new Response('OK', { status: 200 });
  } catch (error: any) {
    console.error('Error processing EZEE webhook:', error);
    // Always return 200 to acknowledge receipt, even on error
    // This prevents EZEE from retrying indefinitely
    return new Response('OK', { status: 200 });
  }
}

