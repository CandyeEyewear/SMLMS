-- Migration: Course-Based Pricing System
-- Replaces general company pricing with course-specific activation pricing
-- Based on PRICING_SYSTEM.md guide

-- Drop old pricing tables if they exist (we'll recreate with new structure)
DROP TABLE IF EXISTS company_pricing CASCADE;
DROP TABLE IF EXISTS default_pricing CASCADE;
DROP FUNCTION IF EXISTS get_company_pricing(UUID);

-- ============================================
-- COURSE PRICING (Global defaults per course)
-- ============================================
CREATE TABLE IF NOT EXISTS course_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  setup_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  reactivation_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  seat_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id)
);

-- ============================================
-- COMPANY PRICING OVERRIDES
-- ============================================
CREATE TABLE IF NOT EXISTS company_pricing_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  setup_fee_override DECIMAL(10,2),
  reactivation_fee_override DECIMAL(10,2),
  seat_fee_override DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, course_id)
);

-- Note: If course_id is NULL, the override applies to ALL courses for that company
-- We use a partial unique index to allow one NULL per company
CREATE UNIQUE INDEX IF NOT EXISTS idx_company_wide_override 
  ON company_pricing_overrides(company_id) 
  WHERE course_id IS NULL;

-- ============================================
-- COURSE ACTIVATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS course_activations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  activated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  is_renewal BOOLEAN DEFAULT false,
  status TEXT NOT NULL CHECK (status IN ('active', 'expired', 'pending_payment')) DEFAULT 'pending_payment',
  seat_count INTEGER NOT NULL DEFAULT 0,
  setup_fee_paid DECIMAL(10,2) DEFAULT 0.00,
  seat_fee_paid DECIMAL(10,2) DEFAULT 0.00,
  total_paid DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, course_id, activated_at)
);

-- ============================================
-- INVOICES
-- ============================================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  course_activation_id UUID REFERENCES course_activations(id) ON DELETE SET NULL,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')) DEFAULT 'draft',
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  payment_method TEXT,
  payment_reference TEXT,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INVOICE ITEMS
-- ============================================
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  item_type TEXT CHECK (item_type IN ('setup_fee', 'reactivation_fee', 'seat_fee', 'other')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EXPIRY REMINDERS
-- ============================================
CREATE TABLE IF NOT EXISTS expiry_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_activation_id UUID NOT NULL REFERENCES course_activations(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('30_day', '7_day', '1_day', 'expired')),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  email_sent_to TEXT NOT NULL,
  UNIQUE(course_activation_id, reminder_type)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_course_pricing_course_id ON course_pricing(course_id);
CREATE INDEX IF NOT EXISTS idx_company_pricing_overrides_company_id ON company_pricing_overrides(company_id);
CREATE INDEX IF NOT EXISTS idx_company_pricing_overrides_course_id ON company_pricing_overrides(course_id);
CREATE INDEX IF NOT EXISTS idx_course_activations_company_id ON course_activations(company_id);
CREATE INDEX IF NOT EXISTS idx_course_activations_course_id ON course_activations(course_id);
CREATE INDEX IF NOT EXISTS idx_course_activations_status ON course_activations(status);
CREATE INDEX IF NOT EXISTS idx_course_activations_expires_at ON course_activations(expires_at);
CREATE INDEX IF NOT EXISTS idx_invoices_company_id ON invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_expiry_reminders_activation_id ON expiry_reminders(course_activation_id);

-- ============================================
-- FUNCTION: Get Effective Price
-- ============================================
CREATE OR REPLACE FUNCTION get_effective_price(
  p_course_id UUID,
  p_company_id UUID
)
RETURNS TABLE (
  setup_fee DECIMAL(10,2),
  reactivation_fee DECIMAL(10,2),
  seat_fee DECIMAL(10,2),
  currency TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH course_default AS (
    SELECT setup_fee, reactivation_fee, seat_fee, currency
    FROM course_pricing
    WHERE course_id = p_course_id
  ),
  company_specific_override AS (
    SELECT setup_fee_override, reactivation_fee_override, seat_fee_override
    FROM company_pricing_overrides
    WHERE company_id = p_company_id
      AND course_id = p_course_id
  ),
  company_wide_override AS (
    SELECT setup_fee_override, reactivation_fee_override, seat_fee_override
    FROM company_pricing_overrides
    WHERE company_id = p_company_id
      AND course_id IS NULL
  )
  SELECT
    COALESCE(
      company_specific_override.setup_fee_override,
      company_wide_override.setup_fee_override,
      course_default.setup_fee,
      0.00
    ) as setup_fee,
    COALESCE(
      company_specific_override.reactivation_fee_override,
      company_wide_override.reactivation_fee_override,
      course_default.reactivation_fee,
      0.00
    ) as reactivation_fee,
    COALESCE(
      company_specific_override.seat_fee_override,
      company_wide_override.seat_fee_override,
      course_default.seat_fee,
      0.00
    ) as seat_fee,
    COALESCE(course_default.currency, 'USD') as currency
  FROM course_default
  LEFT JOIN company_specific_override ON true
  LEFT JOIN company_wide_override ON true
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION: Generate Invoice Number
-- ============================================
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  v_year INTEGER;
  v_count INTEGER;
  v_invoice_number TEXT;
BEGIN
  v_year := EXTRACT(YEAR FROM NOW());
  
  SELECT COUNT(*) + 1 INTO v_count
  FROM invoices
  WHERE EXTRACT(YEAR FROM created_at) = v_year;
  
  v_invoice_number := 'INV-' || v_year || '-' || LPAD(v_count::TEXT, 4, '0');
  
  RETURN v_invoice_number;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER: Update updated_at timestamps
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_course_pricing_updated_at
  BEFORE UPDATE ON course_pricing
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_pricing_overrides_updated_at
  BEFORE UPDATE ON company_pricing_overrides
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_activations_updated_at
  BEFORE UPDATE ON course_activations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

