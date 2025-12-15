import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default async function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, company_id')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'user') {
    redirect('/login');
  }

  // Get company details
  let companyName = 'Company';
  let primaryColor = '#1A4490';

  if (profile.company_id) {
    const { data: company } = await supabase
      .from('companies')
      .select('name, primary_color')
      .eq('id', profile.company_id)
      .single();

    if (company) {
      companyName = company.name;
      primaryColor = company.primary_color || '#1A4490';
    }
  }

  const menuItems = [
    {
      label: 'My Courses',
      href: '/learner/courses',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      label: 'My Progress',
      href: '/learner/progress',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      label: 'Certificates',
      href: '/learner/certificates',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside
        className="w-64 text-white flex flex-col"
        style={{ backgroundColor: primaryColor }}
      >
        {/* Company Name */}
        <div className="p-6 border-b border-white/10">
          <Link href="/learner" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center font-bold text-lg">
              {companyName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-lg truncate block">{companyName}</span>
              <span className="text-xs text-white/60">Learning Portal</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-medium">
              {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{profile?.full_name || 'Learner'}</p>
              <p className="text-xs text-white/60 truncate">{user.email}</p>
            </div>
          </div>
          <form action="/auth/signout" method="post" className="mt-2">
            <button
              type="submit"
              className="w-full text-left px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>

        {/* Powered by Logo */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-center gap-2 opacity-60">
            <span className="text-xs">Powered by</span>
            <Image
              src="/logo.png"
              alt="Sales Master LMS"
              width={24}
              height={24}
              className="rounded"
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
