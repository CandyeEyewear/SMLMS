// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function SuperAdminDashboard() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // Use service role key for admin queries to bypass RLS and get accurate counts
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Get stats using admin client - fetch IDs and count for reliability
  const [
    companiesResult,
    usersResult,
    adminsResult,
    coursesResult,
    categoriesResult
  ] = await Promise.all([
    supabaseAdmin
      .from('companies')
      .select('id'),
    supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('role', 'user'),
    supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('role', 'company_admin'),
    supabaseAdmin
      .from('courses')
      .select('id')
      .is('deleted_at', null),
    supabaseAdmin
      .from('categories')
      .select('id')
  ]);

  // Extract counts from data arrays
  const companyCount = companiesResult.data?.length ?? 0;
  const totalUsers = usersResult.data?.length ?? 0;
  const totalCompanyAdmins = adminsResult.data?.length ?? 0;
  const courseCount = coursesResult.data?.length ?? 0;
  const categoryCount = categoriesResult.data?.length ?? 0;

  // Log errors for debugging
  if (usersResult.error) {
    console.error('Error fetching total users:', usersResult.error);
  }
  if (adminsResult.error) {
    console.error('Error fetching company admins:', adminsResult.error);
  }
  if (companiesResult.error) {
    console.error('Error fetching companies:', companiesResult.error);
  }
  if (coursesResult.error) {
    console.error('Error fetching courses:', coursesResult.error);
  }
  if (categoriesResult.error) {
    console.error('Error fetching categories:', categoriesResult.error);
  }

  // Get recent companies using admin client
  const { data: recentCompanies, error: recentCompaniesError } = await supabaseAdmin
    .from('companies')
    .select('id, name, slug, created_at, is_active')
    .order('created_at', { ascending: false })
    .limit(5);

  if (recentCompaniesError) {
    console.error('Error fetching recent companies:', recentCompaniesError);
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
        <p className="text-gray-500 mt-1">Welcome to Sales Master LMS Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Companies</p>
            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900">{companyCount || 0}</p>
          <Link href="/super-admin/companies" className="text-sm text-primary-500 hover:underline mt-2 inline-block">
            View all →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Learners</p>
            <svg className="w-5 h-5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalUsers || 0}</p>
          <p className="text-sm text-gray-400 mt-2">{totalCompanyAdmins || 0} admins</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Courses</p>
            <svg className="w-5 h-5 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900">{courseCount || 0}</p>
          <Link href="/super-admin/courses" className="text-sm text-primary-500 hover:underline mt-2 inline-block">
            Manage →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Categories</p>
            <svg className="w-5 h-5 text-warning-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900">{categoryCount || 0}</p>
          <Link href="/super-admin/categories" className="text-sm text-primary-500 hover:underline mt-2 inline-block">
            Manage →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Revenue</p>
            <svg className="w-5 h-5 text-info-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900">$0</p>
          <p className="text-sm text-gray-400 mt-2">This month</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Companies */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Companies</h2>
            <Link href="/super-admin/companies" className="text-sm text-primary-500 hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentCompanies && recentCompanies.length > 0 ? (
              recentCompanies.map((company) => (
                <Link 
                  key={company.id} 
                  href={`/super-admin/companies/${company.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center font-semibold">
                      {company.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{company.name}</p>
                      <p className="text-sm text-gray-500">/{company.slug}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    company.is_active 
                      ? 'bg-success-100 text-success-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {company.is_active ? 'Active' : 'Inactive'}
                  </span>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>No companies yet</p>
                <Link href="/super-admin/companies/new" className="text-primary-500 hover:underline mt-2 inline-block">
                  Add your first company →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-3">
            <Link 
              href="/super-admin/companies/new"
              className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Add Company</p>
                <p className="text-sm text-gray-500">Create a new client company</p>
              </div>
            </Link>

            <Link 
              href="/super-admin/courses/new"
              className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-accent-300 hover:bg-accent-50 transition-colors"
            >
              <div className="w-10 h-10 bg-accent-100 text-accent-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Create Course</p>
                <p className="text-sm text-gray-500">Build with AI or manually</p>
              </div>
            </Link>

            <Link 
              href="/super-admin/categories/new"
              className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-warning-300 hover:bg-warning-50 transition-colors"
            >
              <div className="w-10 h-10 bg-warning-100 text-warning-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Add Category</p>
                <p className="text-sm text-gray-500">Organize your courses</p>
              </div>
            </Link>

            <Link 
              href="/super-admin/reports"
              className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-info-300 hover:bg-info-50 transition-colors"
            >
              <div className="w-10 h-10 bg-info-100 text-info-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">View Reports</p>
                <p className="text-sm text-gray-500">Platform analytics</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
