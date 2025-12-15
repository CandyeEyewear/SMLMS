# LMS Platform - Pricing System Guide

## Overview

This document defines the complete pricing mechanism for the Sales Master LMS platform. The system supports course activation fees, per-seat licensing, renewals, and automated expiry management.

---

## Pricing Model Summary

### Fee Types

| Fee | When Applied | Description |
|-----|--------------|-------------|
| **Setup Fee** | First time a company activates a course | One-time activation cost |
| **Reactivation Fee** | When renewing an expired course | Lower than setup fee |
| **Seat Fee** | Per user assigned to the course | Covers 12-month access |

### Validity Period

- All course activations are valid for **12 months** from activation date
- Users added mid-period are valid until the course expires (not 12 months from their add date)
- Each course has its own independent expiry date per company

### Pricing Hierarchy

```
Global Default (per course)
    ↓
Company Override (optional)
    ↓
Final Price Applied
```

Super Admin can set:
1. **Global defaults** - Base pricing for all companies
2. **Company overrides** - Custom pricing for specific companies (VIP, discounts)

---

## Database Schema

### Table: `course_pricing`

Stores default pricing for each course.

```sql
CREATE TABLE course_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  setup_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  reactivation_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  seat_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'JMD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id)
);
```

### Table: `company_pricing_overrides`

Stores custom pricing for specific companies.

```sql
CREATE TABLE company_pricing_overrides (
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
```

**Note:** If `course_id` is NULL, the override applies to ALL courses for that company.

### Table: `course_activations`

Tracks which companies have access to which courses and when they expire.

```sql
CREATE TABLE course_activations (
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
```

### Table: `invoices`

Stores invoice records for billing.

```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  course_activation_id UUID REFERENCES course_activations(id) ON DELETE SET NULL,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'JMD',
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
```

### Table: `invoice_items`

Line items on each invoice.

```sql
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  item_type TEXT CHECK (item_type IN ('setup_fee', 'reactivation_fee', 'seat_fee', 'other')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `expiry_reminders`

Tracks which reminders have been sent to avoid duplicates.

```sql
CREATE TABLE expiry_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_activation_id UUID NOT NULL REFERENCES course_activations(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('30_day', '7_day', '1_day', 'expired')),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  email_sent_to TEXT NOT NULL,
  UNIQUE(course_activation_id, reminder_type)
);
```

---

## Price Calculation Logic

### Function: Get Effective Price

```typescript
async function getEffectivePrice(
  courseId: string,
  companyId: string
): Promise<{
  setupFee: number;
  reactivationFee: number;
  seatFee: number;
}> {
  // 1. Get global default pricing
  const defaultPricing = await getCoursePricing(courseId);
  
  // 2. Check for company-specific override
  const companyOverride = await getCompanyPricingOverride(companyId, courseId);
  
  // 3. Check for company-wide override (course_id = NULL)
  const companyWideOverride = await getCompanyPricingOverride(companyId, null);
  
  // 4. Apply overrides (specific > company-wide > default)
  return {
    setupFee: companyOverride?.setup_fee_override 
      ?? companyWideOverride?.setup_fee_override 
      ?? defaultPricing.setup_fee,
    reactivationFee: companyOverride?.reactivation_fee_override 
      ?? companyWideOverride?.reactivation_fee_override 
      ?? defaultPricing.reactivation_fee,
    seatFee: companyOverride?.seat_fee_override 
      ?? companyWideOverride?.seat_fee_override 
      ?? defaultPricing.seat_fee,
  };
}
```

### Function: Calculate Total

```typescript
function calculateTotal(
  isRenewal: boolean,
  seatCount: number,
  pricing: { setupFee: number; reactivationFee: number; seatFee: number },
  taxRate: number = 0
): {
  setupOrReactivationFee: number;
  seatTotal: number;
  subtotal: number;
  taxAmount: number;
  total: number;
} {
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
```

---

## Course Activation Flow

### Step 1: Check Existing Activation

```typescript
async function checkExistingActivation(companyId: string, courseId: string) {
  const existing = await supabase
    .from('course_activations')
    .select('*')
    .eq('company_id', companyId)
    .eq('course_id', courseId)
    .order('expires_at', { ascending: false })
    .limit(1)
    .single();
  
  if (!existing) {
    return { isRenewal: false, previousActivation: null };
  }
  
  return {
    isRenewal: true,
    previousActivation: existing,
    isExpired: new Date(existing.expires_at) < new Date(),
  };
}
```

### Step 2: Create Activation

```typescript
async function createCourseActivation(
  companyId: string,
  courseId: string,
  seatCount: number,
  isRenewal: boolean
) {
  const activatedAt = new Date();
  const expiresAt = new Date(activatedAt);
  expiresAt.setFullYear(expiresAt.getFullYear() + 1); // +12 months
  
  const pricing = await getEffectivePrice(courseId, companyId);
  const totals = calculateTotal(isRenewal, seatCount, pricing);
  
  // Create activation record
  const activation = await supabase
    .from('course_activations')
    .insert({
      company_id: companyId,
      course_id: courseId,
      activated_at: activatedAt,
      expires_at: expiresAt,
      is_renewal: isRenewal,
      status: 'pending_payment',
      seat_count: seatCount,
      setup_fee_paid: totals.setupOrReactivationFee,
      seat_fee_paid: totals.seatTotal,
      total_paid: totals.total,
    })
    .select()
    .single();
  
  // Create invoice
  const invoice = await createInvoice(activation, totals, pricing);
  
  return { activation, invoice };
}
```

### Step 3: Generate Invoice

```typescript
async function createInvoice(activation, totals, pricing) {
  // Generate invoice number: INV-YYYY-NNNN
  const year = new Date().getFullYear();
  const count = await getInvoiceCount(year);
  const invoiceNumber = `INV-${year}-${String(count + 1).padStart(4, '0')}`;
  
  // Due date: 14 days from now
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);
  
  // Create invoice
  const invoice = await supabase
    .from('invoices')
    .insert({
      invoice_number: invoiceNumber,
      company_id: activation.company_id,
      course_activation_id: activation.id,
      subtotal: totals.subtotal,
      tax_rate: 0,
      tax_amount: totals.taxAmount,
      total: totals.total,
      currency: 'JMD',
      status: 'sent',
      due_date: dueDate,
    })
    .select()
    .single();
  
  // Add line items
  const items = [];
  
  // Setup or Reactivation fee
  items.push({
    invoice_id: invoice.id,
    description: activation.is_renewal 
      ? `Reactivation Fee - ${courseName}` 
      : `Setup Fee - ${courseName}`,
    quantity: 1,
    unit_price: totals.setupOrReactivationFee,
    total: totals.setupOrReactivationFee,
    item_type: activation.is_renewal ? 'reactivation_fee' : 'setup_fee',
  });
  
  // Seat fees
  if (activation.seat_count > 0) {
    items.push({
      invoice_id: invoice.id,
      description: `Seat License (12 months) - ${courseName}`,
      quantity: activation.seat_count,
      unit_price: pricing.seatFee,
      total: totals.seatTotal,
      item_type: 'seat_fee',
    });
  }
  
  await supabase.from('invoice_items').insert(items);
  
  return invoice;
}
```

---

## Expiry Management

### Reminder Schedule

| Days Before Expiry | Reminder Type | Action |
|-------------------|---------------|--------|
| 30 days | `30_day` | Email: "Course expires in 30 days" |
| 7 days | `7_day` | Email: "Course expires in 7 days" |
| 1 day | `1_day` | Email: "Course expires tomorrow" |
| 0 days (expired) | `expired` | Lock course, Email: "Course has expired" |

### Cron Job: Check Expiries

Run daily (recommended: 6:00 AM)

```typescript
async function checkCourseExpiries() {
  const now = new Date();
  
  // Get all active course activations
  const activations = await supabase
    .from('course_activations')
    .select(`
      *,
      companies(name, billing_email),
      courses(title)
    `)
    .eq('status', 'active');
  
  for (const activation of activations) {
    const expiresAt = new Date(activation.expires_at);
    const daysUntilExpiry = Math.ceil(
      (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // Check which reminder to send
    let reminderType = null;
    
    if (daysUntilExpiry <= 0) {
      reminderType = 'expired';
      // Lock the course
      await lockCourseActivation(activation.id);
    } else if (daysUntilExpiry === 1) {
      reminderType = '1_day';
    } else if (daysUntilExpiry === 7) {
      reminderType = '7_day';
    } else if (daysUntilExpiry === 30) {
      reminderType = '30_day';
    }
    
    if (reminderType) {
      await sendExpiryReminder(activation, reminderType);
    }
  }
}
```

### Lock Expired Course

```typescript
async function lockCourseActivation(activationId: string) {
  await supabase
    .from('course_activations')
    .update({ status: 'expired' })
    .eq('id', activationId);
}
```

### Check Access (Before Loading Course)

```typescript
async function canAccessCourse(
  userId: string,
  courseId: string
): Promise<boolean> {
  // Get user's company
  const profile = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', userId)
    .single();
  
  if (!profile.company_id) return false;
  
  // Check for active course activation
  const activation = await supabase
    .from('course_activations')
    .select('id, status, expires_at')
    .eq('company_id', profile.company_id)
    .eq('course_id', courseId)
    .eq('status', 'active')
    .gte('expires_at', new Date().toISOString())
    .single();
  
  return !!activation;
}
```

---

## Super Admin Pages

### 1. Global Pricing (`/super-admin/pricing`)

**Features:**
- List all courses with current pricing
- Edit setup fee, reactivation fee, seat fee per course
- Set default currency

**UI:**
```
┌─────────────────────────────────────────────────────────────┐
│  Course Pricing                              [+ Add Course] │
├─────────────────────────────────────────────────────────────┤
│  Course          Setup Fee   Reactivation   Seat Fee   ⋯   │
│  ─────────────────────────────────────────────────────────  │
│  Sales Training   $500.00     $200.00       $20.00    Edit │
│  Safety Course    $300.00     $150.00       $15.00    Edit │
│  Leadership 101   $750.00     $300.00       $35.00    Edit │
└─────────────────────────────────────────────────────────────┘
```

### 2. Company Pricing Override (`/super-admin/companies/[id]/pricing`)

**Features:**
- Enable/disable custom pricing for company
- Set company-wide overrides (applies to all courses)
- Set course-specific overrides

**UI:**
```
┌─────────────────────────────────────────────────────────────┐
│  Candye Eyewear - Custom Pricing                            │
├─────────────────────────────────────────────────────────────┤
│  ☑ Enable custom pricing for this company                  │
│                                                             │
│  Company-Wide Defaults (optional)                          │
│  Seat Fee Override: [$15.00    ] (leave blank for default) │
│                                                             │
│  Course-Specific Overrides                                 │
│  ─────────────────────────────────────────────────────────  │
│  Sales Training                                             │
│  Setup: [$400.00] Reactivation: [$150.00] Seat: [default]  │
│                                                             │
│                                    [Cancel] [Save Changes]  │
└─────────────────────────────────────────────────────────────┘
```

### 3. Course Activations (`/super-admin/activations`)

**Features:**
- List all company course activations
- Filter by status (active, expired, pending)
- View expiry dates
- Quick actions: renew, view invoice

**UI:**
```
┌─────────────────────────────────────────────────────────────┐
│  Course Activations                    [Filter: All ▼]      │
├─────────────────────────────────────────────────────────────┤
│  Company          Course           Expires      Status   ⋯  │
│  ─────────────────────────────────────────────────────────  │
│  Candye Eyewear   Sales Training   Dec 14, 25   Active  ⋯  │
│  ABC Corp         Safety Course    Jan 5, 26    Active  ⋯  │
│  XYZ Ltd          Leadership       Nov 1, 24    Expired ⋯  │
└─────────────────────────────────────────────────────────────┘
```

### 4. Invoices (`/super-admin/invoices`)

**Features:**
- List all invoices
- Filter by status (draft, sent, paid, overdue)
- Mark as paid
- Download PDF
- View details

**UI:**
```
┌─────────────────────────────────────────────────────────────┐
│  Invoices                              [Filter: All ▼]      │
├─────────────────────────────────────────────────────────────┤
│  Invoice #       Company          Total    Status    Date   │
│  ─────────────────────────────────────────────────────────  │
│  INV-2024-0001  Candye Eyewear   $700.00   Paid     Dec 14 │
│  INV-2024-0002  ABC Corp         $500.00   Sent     Dec 15 │
│  INV-2024-0003  XYZ Ltd          $450.00   Overdue  Nov 1  │
└─────────────────────────────────────────────────────────────┘
```

---

## Invoice PDF Template

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [LOGO]  SALES MASTER CONSULTANTS                          │
│          Kingston, Jamaica                                  │
│          info@salesmasterjm.com                            │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  INVOICE                                                    │
│                                                             │
│  Invoice #:    INV-2024-0001                               │
│  Issue Date:   December 14, 2024                           │
│  Due Date:     December 28, 2024                           │
│  Status:       PAID                                         │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  BILL TO:                                                   │
│  Candye Eyewear                                            │
│  info@candyeeyewear.com                                    │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Description                    Qty    Unit Price   Total  │
│  ─────────────────────────────────────────────────────────  │
│  Setup Fee - Sales Training     1      $500.00     $500.00 │
│  Seat License (12 months)       10     $20.00      $200.00 │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                        Subtotal:   $700.00 │
│                                        Tax (0%):   $0.00   │
│                                        ───────────────────  │
│                                        TOTAL:      $700.00 │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Course Access Valid Until: December 14, 2025              │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  PAYMENT INSTRUCTIONS:                                      │
│  Bank: National Commercial Bank                            │
│  Account: 123456789                                        │
│  Branch: Kingston                                          │
│                                                             │
│  Thank you for your business!                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Constants

Add to `packages/shared/src/constants/index.ts`:

```typescript
// =============================================================================
// PRICING
// =============================================================================

export const CURRENCY = {
  JMD: 'JMD',
  USD: 'USD',
} as const;

export const DEFAULT_CURRENCY = 'JMD';

export const TAX_RATE = 0; // 0% tax

export const INVOICE_DUE_DAYS = 14;

export const COURSE_VALIDITY_MONTHS = 12;

export const INVOICE_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
} as const;

export const ACTIVATION_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  PENDING_PAYMENT: 'pending_payment',
} as const;

export const REMINDER_TYPES = {
  THIRTY_DAY: '30_day',
  SEVEN_DAY: '7_day',
  ONE_DAY: '1_day',
  EXPIRED: 'expired',
} as const;

export const REMINDER_DAYS = [30, 7, 1, 0] as const;
```

---

## Email Templates

### 30-Day Reminder

**Subject:** Your course access expires in 30 days

```
Hi [Company Admin Name],

Your access to "[Course Name]" will expire on [Expiry Date].

Current Status:
- Active Users: [X] users
- Days Remaining: 30 days

To continue uninterrupted access for your team, please renew before the expiration date.

[Renew Now Button]

Questions? Contact us at info@salesmasterjm.com

Sales Master Consultants
```

### Expired Notification

**Subject:** Course access has expired

```
Hi [Company Admin Name],

Your access to "[Course Name]" expired on [Expiry Date].

Your team can no longer access this course until it is renewed.

To restore access:
1. Log in to your admin dashboard
2. Go to Courses
3. Click "Renew" on [Course Name]

[Renew Now Button]

Questions? Contact us at info@salesmasterjm.com

Sales Master Consultants
```

---

## Summary

This pricing system provides:

1. **Flexible pricing** - Global defaults with company-specific overrides
2. **Automatic calculations** - Setup/reactivation + seats = total
3. **12-month validity** - All activations expire after 12 months
4. **Invoice generation** - Professional invoices with PDF download
5. **Expiry management** - Automated reminders and course locking
6. **Audit trail** - Full history of activations and payments

---

## File Structure

```
apps/web/src/
├── app/
│   └── super-admin/
│       ├── pricing/
│       │   └── page.tsx              # Global pricing management
│       ├── companies/
│       │   └── [id]/
│       │       └── pricing/
│       │           └── page.tsx      # Company pricing overrides
│       ├── activations/
│       │   └── page.tsx              # Course activations list
│       └── invoices/
│           ├── page.tsx              # Invoices list
│           └── [id]/
│               └── page.tsx          # Invoice detail + PDF
├── actions/
│   ├── pricing.ts                    # Pricing CRUD actions
│   ├── activations.ts                # Activation actions
│   └── invoices.ts                   # Invoice actions
├── lib/
│   ├── pricing.ts                    # Price calculation helpers
│   └── pdf.ts                        # PDF generation
└── components/
    └── invoices/
        └── InvoicePDF.tsx            # Invoice PDF template
```
