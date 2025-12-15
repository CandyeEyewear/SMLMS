import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function LearnerDashboard() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, company_id')
    .eq('id', user.id)
    .maybeSingle<{ full_name: string | null; role: string; company_id: string | null }>();

  // If profile doesn't exist, create one with default 'user' role
  if (!profile) {
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email || '',
        role: 'user',
      });

    if (insertError) {
      console.error('Error creating profile:', insertError);
    } else {
      // Refetch the profile after creation
      const { data: newProfile } = await supabase
        .from('profiles')
        .select('full_name, role, company_id')
        .eq('id', user.id)
        .maybeSingle<{ full_name: string | null; role: string; company_id: string | null }>();
      
      if (newProfile) {
        profile = newProfile;
      }
    }
  }

  // Get company name if user has a company
  let companyName: string | null = null;
  if (profile?.company_id) {
    const { data: company } = await supabase
      .from('companies')
      .select('name')
      .eq('id', profile.company_id)
      .single<{ name: string }>();
    companyName = company?.name || null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary-500 text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">My Learning</h1>
            {companyName && (
              <p className="text-sm text-white/70">{companyName}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">{profile?.full_name || user.email}</span>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm bg-primary-600 px-3 py-1 rounded hover:bg-primary-700 transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {profile?.full_name?.split(' ')[0] || 'Learner'}!
        </h2>
        <p className="text-gray-500 mb-8">Continue where you left off.</p>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Courses In Progress</p>
            <p className="text-3xl font-bold text-primary-500">0</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Completed</p>
            <p className="text-3xl font-bold text-accent-500">0</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Certificates Earned</p>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-gray-500 mb-2">No courses assigned yet.</p>
          <p className="text-sm text-gray-400">Your courses will appear here once your admin assigns them to you.</p>
        </div>
      </main>
    </div>
  );
}
