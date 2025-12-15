import { createClient } from '@/lib/supabase/server';
import { ezeeClient } from '@/lib/ezee/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      paymentType, // 'setup_fee' | 'user_subscription'
      companyId,
      enrollmentId,
      amount,
      userCount,
      billingPeriodStart,
      billingPeriodEnd,
    } = body;

    if (!paymentType || !companyId || !amount) {
      return NextResponse.json(
        { error: 'Payment type, company ID, and amount are required' },
        { status: 400 }
      );
    }

    // Get company details
    const { data: company } = await supabase
      .from('companies')
      .select('name')
      .eq('id', companyId)
      .single();

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name, company_id')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Verify user has permission (company admin or super admin)
    if (profile.company_id !== companyId && profile.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Generate order ID
    const orderId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        company_id: companyId,
        enrollment_id: enrollmentId || null,
        payment_type: paymentType,
        amount,
        currency: 'USD',
        user_count: userCount || null,
        billing_period_start: billingPeriodStart || null,
        billing_period_end: billingPeriodEnd || null,
        status: 'pending',
        order_id: orderId, // Store order_id for webhook matching
      })
      .select()
      .single();

    if (paymentError) {
      throw paymentError;
    }

    // Create payment with eZeePayments
    // Use EZEE_SITE or EZEE_SITE_URL if provided, otherwise fall back to NEXT_PUBLIC_APP_URL
    const siteUrl = process.env.EZEE_SITE || process.env.EZEE_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const postBackUrl = `${siteUrl}/api/webhooks/ezee-payments`;
    const returnUrl = `${siteUrl}/payments/success?payment_id=${payment.id}`;
    const cancelUrl = `${siteUrl}/payments/cancel?payment_id=${payment.id}`;
    
    const description = `${paymentType === 'setup_fee' ? 'Setup Fee' : 'Subscription'} - ${company.name}`;
    const isRecurring = paymentType === 'user_subscription';
    
    let subscriptionId: string | null = null;

    // Step 1: Create subscription if this is a recurring payment
    if (isRecurring) {
      // Determine frequency from billing period
      let frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' = 'monthly';
      if (billingPeriodStart && billingPeriodEnd) {
        const start = new Date(billingPeriodStart);
        const end = new Date(billingPeriodEnd);
        const daysDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff <= 1) frequency = 'daily';
        else if (daysDiff <= 7) frequency = 'weekly';
        else if (daysDiff <= 31) frequency = 'monthly';
        else if (daysDiff <= 93) frequency = 'quarterly';
        else frequency = 'annually';
      }

      // Format end_date if provided
      let endDate: string | undefined;
      if (billingPeriodEnd) {
        const date = new Date(billingPeriodEnd);
        endDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      }

      const subscriptionResponse = await ezeeClient.createSubscription({
        amount,
        currency: 'USD',
        frequency,
        end_date: endDate,
        description,
        post_back_url: postBackUrl,
      });

      if (subscriptionResponse.result.status !== 1) {
        const errorMsg = typeof subscriptionResponse.result.message === 'string' 
          ? subscriptionResponse.result.message 
          : JSON.stringify(subscriptionResponse.result.message);
        
        await supabase
          .from('payments')
          .update({ status: 'failed' })
          .eq('id', payment.id);

        return NextResponse.json(
          { error: `Failed to create subscription: ${errorMsg}` },
          { status: 500 }
        );
      }

      subscriptionId = subscriptionResponse.result.subscription_id || null;
      
      // Store subscription ID in payment record
      if (subscriptionId) {
        await supabase
          .from('payments')
          .update({ ezee_subscription_id: subscriptionId })
          .eq('id', payment.id);
      }
    }

    // Step 2: Get payment token (required for all payments)
    const tokenResponse = await ezeeClient.getToken({
      amount,
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

      return NextResponse.json(
        { error: errorMsg },
        { status: 500 }
      );
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

    // Step 3: Prepare payment form data
    const paymentFormData = {
      platform: 'custom' as const,
      token,
      amount,
      currency: 'USD' as const,
      order_id: orderId,
      email_address: profile.email,
      customer_name: profile.full_name || undefined,
      description,
      recurring: isRecurring ? 'true' as const : 'false' as const,
      subscription_id: subscriptionId ? parseInt(subscriptionId) : undefined,
    };

    const formData = ezeeClient.generatePaymentFormData(paymentFormData);
    const paymentUrl = ezeeClient.getPaymentPageUrl();

    return NextResponse.json({
      success: true,
      payment_id: payment.id,
      payment_url: paymentUrl,
      form_data: Object.fromEntries(formData.entries()),
      subscription_id: subscriptionId,
    });
  } catch (error: any) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment' },
      { status: 500 }
    );
  }
}

