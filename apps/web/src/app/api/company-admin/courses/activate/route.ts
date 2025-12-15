import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { getEffectivePrice, calculateTotal, checkExistingActivation } from '@/lib/pricing';

/**
 * Activate a course for a company
 * Creates course_activation record and invoice
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, company_id')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'company_admin' || !profile.company_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId, seatCount } = body;

    if (!courseId || !seatCount || seatCount < 1) {
      return NextResponse.json(
        { error: 'Course ID and seat count (minimum 1) are required' },
        { status: 400 }
      );
    }

    // Verify course exists and is available
    const { data: course } = await supabase
      .from('courses')
      .select('id, title')
      .eq('id', courseId)
      .single();

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check for existing activation
    const { isRenewal, previousActivation, isExpired } =
      await checkExistingActivation(profile.company_id, courseId);

    // If there's an active (non-expired) activation, don't allow new one
    if (previousActivation && !isExpired && previousActivation.status === 'active') {
      return NextResponse.json(
        {
          error: 'Course is already active for your company',
          existingActivation: previousActivation,
        },
        { status: 400 }
      );
    }

    // Get effective pricing
    const pricing = await getEffectivePrice(courseId, profile.company_id);

    // Calculate totals
    const totals = calculateTotal(isRenewal, seatCount, pricing, 0); // 0% tax

    // Create course activation
    const activatedAt = new Date();
    const expiresAt = new Date(activatedAt);
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // +12 months

    const { data: activation, error: activationError } = await supabase
      .from('course_activations')
      .insert({
        company_id: profile.company_id,
        course_id: courseId,
        activated_at: activatedAt.toISOString(),
        expires_at: expiresAt.toISOString(),
        is_renewal: isRenewal,
        status: 'pending_payment',
        seat_count: seatCount,
        setup_fee_paid: totals.setupOrReactivationFee,
        seat_fee_paid: totals.seatTotal,
        total_paid: totals.total,
      })
      .select()
      .single();

    if (activationError) {
      throw activationError;
    }

    // Generate invoice number
    const year = new Date().getFullYear();
    const { count } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${year}-01-01`)
      .lt('created_at', `${year + 1}-01-01`);

    const invoiceNumber = `INV-${year}-${String((count || 0) + 1).padStart(4, '0')}`;

    // Due date: 14 days from now
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        invoice_number: invoiceNumber,
        company_id: profile.company_id,
        course_activation_id: activation.id,
        subtotal: totals.subtotal,
        tax_rate: 0,
        tax_amount: totals.taxAmount,
        total: totals.total,
        currency: pricing.currency,
        status: 'sent',
        due_date: dueDate.toISOString().split('T')[0],
        created_by: user.id,
      })
      .select()
      .single();

    if (invoiceError) {
      throw invoiceError;
    }

    // Create invoice items
    const items = [];

    // Setup or Reactivation fee
    items.push({
      invoice_id: invoice.id,
      description: isRenewal
        ? `Reactivation Fee - ${course.title}`
        : `Setup Fee - ${course.title}`,
      quantity: 1,
      unit_price: totals.setupOrReactivationFee,
      total: totals.setupOrReactivationFee,
      item_type: isRenewal ? 'reactivation_fee' : 'setup_fee',
    });

    // Seat fees
    if (seatCount > 0) {
      items.push({
        invoice_id: invoice.id,
        description: `Seat License (12 months) - ${course.title}`,
        quantity: seatCount,
        unit_price: pricing.seatFee,
        total: totals.seatTotal,
        item_type: 'seat_fee',
      });
    }

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(items);

    if (itemsError) {
      throw itemsError;
    }

    return NextResponse.json({
      success: true,
      activation,
      invoice,
      pricing: {
        ...pricing,
        ...totals,
        isRenewal,
      },
    });
  } catch (error: any) {
    console.error('Error activating course:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to activate course' },
      { status: 500 }
    );
  }
}



