// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

type EnrollmentType = {
  id: string;
  status: string;
  progress_percent: number;
  enrolled_at: string;
  due_date: string | null;
  course: {
    id: string;
    title: string;
    description: string | null;
    thumbnail_url: string | null;
    duration_minutes: number | null;
  };
};

export default async function LearnerCoursesPage() {
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

  if (!profile) {
    redirect('/login');
  }

  // Fetch enrollments with course details
  const { data: enrollmentsData } = await supabase
    .from('enrollments')
    .select(`
      id,
      status,
      progress_percent,
      enrolled_at,
      due_date,
      course:courses(
        id,
        title,
        description,
        thumbnail_url,
        duration_minutes
      )
    `)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('enrolled_at', { ascending: false });

  const enrollments = (enrollmentsData || []) as EnrollmentType[];

  // Group by status
  const inProgress = enrollments.filter((e) => e.progress_percent > 0 && e.progress_percent < 100);
  const notStarted = enrollments.filter((e) => e.progress_percent === 0);
  const completed = enrollments.filter((e) => e.progress_percent === 100);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-600 mt-1">Continue learning or start a new course.</p>
      </div>

      {/* In Progress */}
      {inProgress.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Continue Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgress.map((enrollment) => (
              <Link
                key={enrollment.id}
                href={`/learner/courses/${enrollment.course.id}`}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
              >
                {enrollment.course.thumbnail_url ? (
                  <Image
                    src={enrollment.course.thumbnail_url}
                    alt={enrollment.course.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{enrollment.course.title}</h3>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{enrollment.progress_percent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-accent-500 h-2 rounded-full transition-all"
                        style={{ width: `${enrollment.progress_percent}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-primary-500 font-medium">Continue →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Not Started */}
      {notStarted.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Not Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notStarted.map((enrollment) => (
              <Link
                key={enrollment.id}
                href={`/learner/courses/${enrollment.course.id}`}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
              >
                {enrollment.course.thumbnail_url ? (
                  <Image
                    src={enrollment.course.thumbnail_url}
                    alt={enrollment.course.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{enrollment.course.title}</h3>
                  {enrollment.course.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{enrollment.course.description}</p>
                  )}
                  <span className="text-sm text-primary-500 font-medium">Start Course →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Completed</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completed.map((enrollment) => (
              <Link
                key={enrollment.id}
                href={`/learner/courses/${enrollment.course.id}`}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
              >
                {enrollment.course.thumbnail_url ? (
                  <Image
                    src={enrollment.course.thumbnail_url}
                    alt={enrollment.course.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{enrollment.course.title}</h3>
                    <span className="text-green-600 text-sm font-medium">✓ Completed</span>
                  </div>
                  <span className="text-sm text-primary-500 font-medium">View Course →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {enrollments.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses assigned yet</h3>
          <p className="text-gray-600">Your administrator will assign courses to you soon.</p>
        </div>
      )}
    </div>
  );
}

