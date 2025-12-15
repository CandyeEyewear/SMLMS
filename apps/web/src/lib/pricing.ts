// Pricing calculation helpers
// Based on PRICING_SYSTEM.md guide

import { createClient } from '@/lib/supabase/server';

export interface EffectivePricing {
  setupFee: number;
  reactivationFee: number;
  seatFee: number;
  currency: string;
}

export interface PricingCalculation {
  setupOrReactivationFee: number;
  seatTotal: number;
  subtotal: number;
  taxAmount: number;
  total: number;
}

/**
 * Get effective pricing for a course and company
 * Applies hierarchy: course-specific override > company-wide override > default
 */
export async function getEffectivePrice(
  courseId: string,
  companyId: string
): Promise<EffectivePricing> {
  const supabase = await createClient();

  // 1. Get global default pricing for the course
  const { data: coursePricing } = await supabase
    .from('course_pricing')
    .select('setup_fee, reactivation_fee, seat_fee, currency')
    .eq('course_id', courseId)
    .single();

  // 2. Check for course-specific company override
  const { data: courseSpecificOverride } = await supabase
    .from('company_pricing_overrides')
    .select('setup_fee_override, reactivation_fee_override, seat_fee_override')
    .eq('company_id', companyId)
    .eq('course_id', courseId)
    .single();

  // 3. Check for company-wide override (course_id = NULL)
  const { data: companyWideOverride } = await supabase
    .from('company_pricing_overrides')
    .select('setup_fee_override, reactivation_fee_override, seat_fee_override')
    .eq('company_id', companyId)
    .is('course_id', null)
    .single();

  // 4. Apply hierarchy: specific > company-wide > default
  return {
    setupFee:
      courseSpecificOverride?.setup_fee_override ??
      companyWideOverride?.setup_fee_override ??
      coursePricing?.setup_fee ??
      0,
    reactivationFee:
      courseSpecificOverride?.reactivation_fee_override ??
      companyWideOverride?.reactivation_fee_override ??
      coursePricing?.reactivation_fee ??
      0,
    seatFee:
      courseSpecificOverride?.seat_fee_override ??
      companyWideOverride?.seat_fee_override ??
      coursePricing?.seat_fee ??
      0,
    currency: coursePricing?.currency ?? 'USD',
  };
}

/**
 * Calculate total pricing for a course activation
 */
export function calculateTotal(
  isRenewal: boolean,
  seatCount: number,
  pricing: EffectivePricing,
  taxRate: number = 0
): PricingCalculation {
  const setupOrReactivationFee = isRenewal
    ? pricing.reactivationFee
    : pricing.setupFee;

  const seatTotal = seatCount * pricing.seatFee;
  const subtotal = setupOrReactivationFee + seatTotal;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  return {
    setupOrReactivationFee,
    seatTotal,
    subtotal,
    taxAmount,
    total,
  };
}

/**
 * Check if company has an existing activation for a course
 */
export async function checkExistingActivation(
  companyId: string,
  courseId: string
): Promise<{
  isRenewal: boolean;
  previousActivation: any | null;
  isExpired: boolean;
}> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from('course_activations')
    .select('*')
    .eq('company_id', companyId)
    .eq('course_id', courseId)
    .order('expires_at', { ascending: false })
    .limit(1)
    .single();

  if (!existing) {
    return { isRenewal: false, previousActivation: null, isExpired: false };
  }

  const isExpired = new Date(existing.expires_at) < new Date();

  return {
    isRenewal: true,
    previousActivation: existing,
    isExpired,
  };
}

/**
 * Check if user can access a course
 */
export async function canAccessCourse(
  userId: string,
  courseId: string
): Promise<boolean> {
  const supabase = await createClient();

  // Get user's company
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', userId)
    .single();

  if (!profile?.company_id) return false;

  // Check for active course activation
  const { data: activation } = await supabase
    .from('course_activations')
    .select('id, status, expires_at')
    .eq('company_id', profile.company_id)
    .eq('course_id', courseId)
    .eq('status', 'active')
    .gte('expires_at', new Date().toISOString())
    .single();

  return !!activation;
}



