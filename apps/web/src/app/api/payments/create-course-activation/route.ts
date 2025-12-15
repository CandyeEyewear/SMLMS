import { createClient } from '@/lib/supabase/server';
import { ezeeClient } from '@/lib/ezee/client';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Create payment for course activation
 * This replaces the old general setup fee payment
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { courseActivationId } = body;

    if (!courseActivationId) {
      return NextResponse.json(
        { error: 'Course activation ID is required' },
        { status: 400 }
      );
    }

    // Get course activation details
    const { data: activation, error: activationError } = await supabase
      .from('course_activations')
      .select(`
        *,
        courses(id, title),
        companies(id, name)
      `)
      .eq('id', courseActivationId)
      .single();

    if (activationError || !activation) {
      return NextResponse.json(
        { error: 'Course activation not found' },
        { status: 404 }
      );
    }

    // Verify user has permission
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id, role, email, full_name')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    if (
      profile.company_id !== activation.company_id &&
      profile.role !== 'super_admin'
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if already paid
    if (activation.status === 'active') {
      return NextResponse.json(
        { error: 'Course activation is already paid and active' },
        { status: 400 }
      );
    }

    // Generate order ID
    const orderId = `ACT-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        company_id: activation.company_id,
        payment_type: 'course_activation',
        amount: activation.total_paid,
        currency: 'USD', // Should get from activation/invoice
        user_count: activation.seat_count,
        status: 'pending',
        order_id: orderId,
        metadata: {
          course_activation_id: courseActivationId,
          course_id: activation.course_id,
          is_renewal: activation.is_renewal,
        },
      })
      .select()
      .single();

    if (paymentError) {
      throw paymentError;
    }

    // Create payment with eZeePayments
    const siteUrl =
      process.env.EZEE_SITE ||
      process.env.EZEE_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'http://localhost:3000';
    const postBackUrl = `${siteUrl}/api/webhooks/ezee-payments`;
    const returnUrl = `${siteUrl}/payments/success?payment_id=${payment.id}`;
    const cancelUrl = `${siteUrl}/payments/cancel?payment_id=${payment.id}`;

    const description = `${activation.is_renewal ? 'Reactivation' : 'Setup'} Fee - ${(activation.courses as any)?.title || 'Course'} (${activation.seat_count} seats)`;

    // Step 1: Get payment token (one-time payment, not recurring)
    const tokenResponse = await ezeeClient.getToken({
      amount: activation.total_paid,
      currency: 'USD',
      order_id: orderId,
      post_back_url: postBackUrl,
      return_url: returnUrl,
      cancel_url: cancelUrl,
    });

    if (tokenResponse.result.status !== 1) {
      const errorMsg = tokenResponse.result.message || 'Failed to get payment token';

      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('id', payment.id);

      return NextResponse.json({ error: errorMsg }, { status: 500 });
    }

    const token = tokenResponse.result.token;
    if (!token) {
      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('id', payment.id);

      return NextResponse.json(
        { error: 'No token received from payment gateway' },
        { status: 500 }
      );
    }

    // Step 2: Prepare payment form data (one-time payment, not recurring)
    const paymentFormData = {
      platform: 'custom' as const,
      token,
      amount: activation.total_paid,
      currency: 'USD' as const,
      order_id: orderId,
      email_address: profile.email,
      customer_name: profile.full_name || undefined,
      description,
      recurring: 'false' as const,
    };

    const formData = ezeeClient.generatePaymentFormData(paymentFormData);
    const paymentUrl = ezeeClient.getPaymentPageUrl();

    return NextResponse.json({
      success: true,
      payment_id: payment.id,
      course_activation_id: courseActivationId,
      payment_url: paymentUrl,
      form_data: Object.fromEntries(formData.entries()),
    });
  } catch (error: any) {
    console.error('Error creating course activation payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment' },
      { status: 500 }
    );
  }
}



