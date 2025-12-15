-- Migration: Pricing Configuration
-- Adds pricing configuration for setup fees and user subscriptions

-- Add pricing configuration table
CREATE TABLE IF NOT EXISTS company_pricing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    setup_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
    user_price_per_month DECIMAL(10, 2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    is_custom BOOLEAN DEFAULT false, -- If true, this is a custom price for this company
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id)
);

-- Add default pricing configuration (for companies without custom pricing)
CREATE TABLE IF NOT EXISTS default_pricing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setup_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
    user_price_per_month DECIMAL(10, 2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add setup_fee_paid flag to companies table
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS setup_fee_paid BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS setup_fee_paid_at TIMESTAMPTZ;

-- Update payments table to support EZEE payment fields
ALTER TABLE payments
ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS enrollment_id UUID REFERENCES enrollments(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS payment_type VARCHAR(50) CHECK (payment_type IN ('setup_fee', 'user_subscription', 'course_purchase')),
ADD COLUMN IF NOT EXISTS user_count INTEGER,
ADD COLUMN IF NOT EXISTS billing_period_start TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS billing_period_end TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS order_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS ezee_transaction_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS ezee_subscription_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS ezee_response_description TEXT,
ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payments_company_id ON payments(company_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_ezee_transaction_id ON payments(ezee_transaction_id);
CREATE INDEX IF NOT EXISTS idx_company_pricing_company_id ON company_pricing(company_id);

-- Insert default pricing (can be updated by super admin)
INSERT INTO default_pricing (setup_fee, user_price_per_month, currency, is_active)
VALUES (0, 0, 'USD', true)
ON CONFLICT DO NOTHING;

-- Function to get pricing for a company (returns custom if exists, otherwise default)
CREATE OR REPLACE FUNCTION get_company_pricing(p_company_id UUID)
RETURNS TABLE (
    setup_fee DECIMAL(10, 2),
    user_price_per_month DECIMAL(10, 2),
    currency VARCHAR(3),
    is_custom BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(cp.setup_fee, dp.setup_fee) as setup_fee,
        COALESCE(cp.user_price_per_month, dp.user_price_per_month) as user_price_per_month,
        COALESCE(cp.currency, dp.currency) as currency,
        COALESCE(cp.is_custom, false) as is_custom
    FROM default_pricing dp
    LEFT JOIN company_pricing cp ON cp.company_id = p_company_id
    WHERE dp.is_active = true
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;



