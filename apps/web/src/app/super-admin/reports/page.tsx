// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

type CompanyType = {
  id: string;
  name: string;
  is_active: boolean;
};

type EnrollmentType = {
  id: string;
  company_id: string;
  status: string;
  progress_percent: number;
};

type CourseType = {
  id: string;
  title: string;
  is_active: boolean;
};

export default async function SuperAdminReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single<{ role: string }>();

  if (!profile || profile.role !== 'super_admin') {
    redirect('/login');
  }

  // Fetch all companies
  const { data: companiesData } = await supabase
    .from('companies')
    .select('id, name, is_active')
    .order('name');

  const companies = (companiesData || []) as CompanyType[];

  // Fetch all courses
  const { data: coursesData } = await supabase
    .from('courses')
    .select('id, title, is_active')
    .order('title');

  const courses = (coursesData || []) as CourseType[];

  // Fetch all enrollments
  const { data: enrollmentsData } = await supabase
    .from('enrollments')
    .select('id, company_id, status, progress_percent');

  const enrollments = (enrollmentsData || []) as EnrollmentType[];

  // Fetch user counts per company
  const { data: userCountsData } = await supabase
    .from('profiles')
    .select('company_id');

  const userCounts = new Map<string, number>();
  (userCountsData || []).forEach((p) => {
    const companyId = (p as { company_id: string | null }).company_id;
    if (companyId) {
      userCounts.set(companyId, (userCounts.get(companyId) || 0) + 1);
    }
  });

  // Platform-wide stats
  const totalCompanies = companies.length;
  const activeCompanies = companies.filter((c) => c.is_active).length;
  const totalCourses = courses.length;
  const activeCourses = courses.filter((c) => c.is_active).length;
  const totalEnrollments = enrollments.length;
  const completedEnrollments = enrollments.filter((e) => e.status === 'completed').length;
  const totalUsers = Array.from(userCounts.values()).reduce((sum, count) => sum + count, 0);
  const platformCompletionRate = totalEnrollments > 0
    ? Math.round((completedEnrollments / totalEnrollments) * 100)
    : 0;

  // Company stats
  const companyStats = companies.map((company) => {
    const companyEnrollments = enrollments.filter((e) => e.company_id === company.id);
    const completed = companyEnrollments.filter((e) => e.status === 'completed').length;
    const inProgress = companyEnrollments.filter((e) => e.status === 'in_progress').length;
    const totalProgress = companyEnrollments.reduce((sum, e) => sum + (e.progress_percent || 0), 0);
    const avgProgress = companyEnrollments.length > 0
      ? Math.round(totalProgress / companyEnrollments.length)
      : 0;

    return {
      id: company.id,
      name: company.name,
      isActive: company.is_active,
      users: userCounts.get(company.id) || 0,
      enrollments: companyEnrollments.length,
      completed,
      inProgress,
      avgProgress,
      completionRate: companyEnrollments.length > 0
        ? Math.round((completed / companyEnrollments.length) * 100)
        : 0,
    };
  });

  // Sort by enrollments
  companyStats.sort((a, b) => b.enrollments - a.enrollments);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Platform Reports</h1>
        <p className="text-gray-600 mt-1">
          Overview of platform usage and performance across all companies.
        </p>
      </div>

      {/* Platform Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Companies
          </h3>
          <p className="mt-2 text-3xl font-bold text-primary-500">{totalCompanies}</p>
          <p className="text-sm text-gray-500">{activeCompanies} active</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Total Users
          </h3>
          <p className="mt-2 text-3xl font-bold text-primary-500">{totalUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Courses
          </h3>
          <p className="mt-2 text-3xl font-bold text-accent-500">{totalCourses}</p>
          <p className="text-sm text-gray-500">{activeCourses} active</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Completion Rate
          </h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{platformCompletionRate}%</p>
        </div>
      </div>

      {/* Enrollment Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalEnrollments}</p>
          <p className="text-sm text-gray-500">Total Enrollments</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900">{completedEnrollments}</p>
          <p className="text-sm text-gray-500">Completed</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-100 rounded-full mb-3">
            <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {enrollments.filter((e) => e.status === 'in_progress').length}
          </p>
          <p className="text-sm text-gray-500">In Progress</p>
        </div>
      </div>

      {/* Company Performance Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Company Performance</h2>
        </div>
        {companyStats.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Users
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completion Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Progress
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {companyStats.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                          {company.name[0]}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{company.name}</p>
                          <span
                            className={`text-xs ${
                              company.isActive ? 'text-green-600' : 'text-gray-500'
                            }`}
                          >
                            {company.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {company.users}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {company.enrollments}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {company.completed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${company.completionRate}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-900">{company.completionRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-accent-500 h-2 rounded-full"
                            style={{ width: `${company.avgProgress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-900">{company.avgProgress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            No companies registered yet.
          </div>
        )}
      </div>
    </div>
  );
}
