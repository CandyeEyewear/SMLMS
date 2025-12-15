import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import EditCompanyForm from './EditCompanyForm';
import InviteAdminForm from './InviteAdminForm';

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  type Company = {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    website: string | null;
    description: string | null;
    primary_color: string | null;
    secondary_color: string | null;
    contact_person: string | null;
    contact_phone: string | null;
    billing_email: string | null;
    location: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };

  const { data: company, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single<Company>();

  if (error || !company) {
    notFound();
  }

  // Get company stats
  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', id);

  const { count: groupCount } = await supabase
    .from('groups')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', id);

  // Get company admins
  type Admin = { id: string; email: string; full_name: string | null; created_at: string };
  const { data: adminsData } = await supabase
    .from('profiles')
    .select('id, email, full_name, created_at')
    .eq('company_id', id)
    .eq('role', 'company_admin');
  const admins = (adminsData || []) as Admin[];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/super-admin/companies"
          className="text-gray-500 hover:text-gray-700 text-sm mb-2 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Companies
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold"
              style={{ backgroundColor: company.primary_color || '#1A4490' }}
            >
              {company.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              <p className="text-gray-500">lms.salesmasterjm.com/{company.slug}</p>
            </div>
          </div>
          <InviteAdminForm companyId={company.id} companyName={company.name} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Users</p>
          <p className="text-2xl font-bold text-gray-900">{userCount || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Groups</p>
          <p className="text-2xl font-bold text-gray-900">{groupCount || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Status</p>
          <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              company.is_active
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {company.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Created</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date(company.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Company Admins Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Company Admins</h3>
        {admins.length > 0 ? (
          <div className="space-y-3">
            {admins.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-medium">
                    {admin.full_name?.charAt(0) || admin.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{admin.full_name || 'No name'}</p>
                    <p className="text-sm text-gray-500">{admin.email}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">
                  Added {new Date(admin.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No admins yet. Click &quot;Invite Admin&quot; to add one.</p>
        )}
      </div>

      {/* Edit Form */}
      <EditCompanyForm company={company} />
    </div>
  );
}
