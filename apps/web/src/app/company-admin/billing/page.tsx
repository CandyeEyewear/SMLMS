// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

type PaymentType = {
  id: string;
  payment_type: string;
  amount: number;
  currency: string;
  status: string;
  paid_at: string | null;
  created_at: string;
  enrollment_id: string | null;
  user_count: number | null;
  billing_period_start: string | null;
  billing_period_end: string | null;
};

type SubscriptionType = {
  id: string;
  plan: {
    name: string;
    tier: string;
  } | null;
  status: string;
  current_period_start: string;
  current_period_end: string;
};

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, company_id')
    .eq('id', user.id)
    .single();

  if (!profile || (profile.role !== 'company_admin' && profile.role !== 'super_admin')) {
    redirect('/login');
  }

  if (!profile.company_id && profile.role !== 'super_admin') {
    redirect('/login');
  }

  // Fetch payments
  const { data: paymentsData } = await supabase
    .from('payments')
    .select('*')
    .eq('company_id', profile.company_id)
    .order('created_at', { ascending: false })
    .limit(50);

  const payments = (paymentsData || []) as PaymentType[];

  // Fetch subscription
  const { data: subscriptionData } = await supabase
    .from('subscriptions')
    .select(`
      id,
      status,
      current_period_start,
      current_period_end,
      plan:subscription_plans(
        name,
        tier
      )
    `)
    .eq('company_id', profile.company_id)
    .single();

  const subscription = subscriptionData as SubscriptionType | null;

  // Calculate totals
  const totalPaid = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const pendingPayments = payments.filter((p) => p.status === 'pending').length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
        <p className="text-gray-600 mt-1">Manage your subscription and payment history.</p>
      </div>

      {/* Subscription Status */}
      {subscription && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Subscription</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Plan</p>
              <p className="font-semibold text-gray-900">
                {subscription.plan?.name || 'N/A'}
              </p>
              <p className="text-sm text-gray-500 capitalize">{subscription.plan?.tier}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                subscription.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : subscription.status === 'cancelled'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {subscription.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Period</p>
              <p className="text-sm text-gray-900">
                {new Date(subscription.current_period_start).toLocaleDateString()} -{' '}
                {new Date(subscription.current_period_end).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Total Paid
          </h3>
          <p className="text-3xl font-bold text-primary-500">
            JMD ${totalPaid.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Total Payments
          </h3>
          <p className="text-3xl font-bold text-gray-900">{payments.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Pending
          </h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingPayments}</p>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No payments found.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.payment_type === 'setup_fee' ? 'Setup Fee' : 'Subscription'}
                      {payment.user_count && ` (${payment.user_count} users)`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {payment.currency} ${Number(payment.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : payment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.billing_period_start && payment.billing_period_end && (
                        <span>
                          {new Date(payment.billing_period_start).toLocaleDateString()} -{' '}
                          {new Date(payment.billing_period_end).toLocaleDateString()}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

