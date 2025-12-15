// eZeePayments API Client
// Documentation: Project guide/eZeePayments_Recurring_Billing_Implementation_Guide.md

const EZEE_BASE_URL = process.env.EZEE_API_URL || 'https://api-test.ezeepayments.com';
const EZEE_SECURE_URL = process.env.EZEE_SECURE_URL || 'https://secure-test.ezeepayments.com';

export type SubscriptionFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';

export interface CreateSubscriptionRequest {
  amount: number;
  currency: 'USD';
  frequency: SubscriptionFrequency;
  end_date?: string; // d/m/Y format
  description?: string;
  post_back_url?: string;
}

export interface CreateSubscriptionResponse {
  result: {
    status: 0 | 1;
    subscription_id?: string;
    message?: string | Record<string, string>;
  };
}

export interface GetTokenRequest {
  amount: number;
  currency: 'USD';
  order_id: string;
  post_back_url: string;
  return_url: string;
  cancel_url: string;
}

export interface GetTokenResponse {
  result: {
    status: 0 | 1;
    token?: string;
    message?: string;
  };
}

export interface PaymentFormData {
  platform: 'custom';
  token: string;
  amount: number;
  currency: 'USD';
  order_id: string;
  email_address: string;
  customer_name?: string;
  leave_note?: 0 | 1;
  request_address?: 0 | 1;
  request_phone?: 0 | 1;
  description?: string;
  recurring?: 'true' | 'false';
  subscription_id?: number;
}

export interface SubscriptionStatusResponse {
  result: {
    status: 0 | 1;
    message: 'Active' | 'Cancelled by user' | 'Ended' | string;
  };
}

export class EzeePaymentsClient {
  private licenceKey: string;
  private site: string;
  private headers: HeadersInit;

  constructor() {
    this.licenceKey = process.env.EZEE_LICENCE_KEY || process.env.EZEE_API_KEY || '';
    this.site = process.env.EZEE_SITE || process.env.EZEE_SITE_URL || '';

    if (!this.licenceKey || !this.site) {
      console.warn('eZeePayments credentials not configured. EZEE_LICENCE_KEY and EZEE_SITE are required.');
    }

    // All requests require these headers
    this.headers = {
      'licence_key': this.licenceKey,
      'site': this.site,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  }

  private async request<T>(endpoint: string, data: Record<string, any>): Promise<T> {
    const formData = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const response = await fetch(`${EZEE_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`eZeePayments API error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Step 1: Create a recurring subscription
   * Call this once when user first subscribes to a recurring plan
   */
  async createSubscription(params: CreateSubscriptionRequest): Promise<CreateSubscriptionResponse> {
    return this.request<CreateSubscriptionResponse>('/v1/subscription/create/', params);
  }

  /**
   * Step 2: Get payment token
   * Call this before EVERY payment transaction (both initial and recurring)
   */
  async getToken(params: GetTokenRequest): Promise<GetTokenResponse> {
    return this.request<GetTokenResponse>('/v1/custom_token/', params);
  }

  /**
   * Check subscription status
   */
  async getSubscriptionStatus(transactionNumber: string): Promise<SubscriptionStatusResponse> {
    return this.request<SubscriptionStatusResponse>('/v1/subscription/status/', {
      TransactionNumber: transactionNumber,
    });
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(transactionNumber: string): Promise<SubscriptionStatusResponse> {
    return this.request<SubscriptionStatusResponse>('/v1/subscription/cancel/', {
      TransactionNumber: transactionNumber,
    });
  }

  /**
   * Get the secure payment page URL
   */
  getPaymentPageUrl(): string {
    return EZEE_SECURE_URL;
  }

  /**
   * Generate payment form data for redirect
   */
  generatePaymentFormData(params: PaymentFormData): URLSearchParams {
    const formData = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    return formData;
  }
}

export const ezeeClient = new EzeePaymentsClient();
