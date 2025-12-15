// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';

type CertificateType = {
  id: string;
  certificate_number: string;
  issued_at: string;
  expires_at: string | null;
  final_score: number | null;
  pdf_url: string | null;
  verification_code: string;
  course: {
    id: string;
    title: string;
    description: string | null;
  };
  company: {
    id: string;
    name: string;
  };
};

export default async function CertificateDetailPage({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}) {
  const { certificateId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, company_id, full_name')
    .eq('id', user.id)
    .single();

  if (!profile) {
    redirect('/login');
  }

  // Fetch certificate
  const { data: certificate } = await supabase
    .from('certificates')
    .select(`
      id,
      certificate_number,
      issued_at,
      expires_at,
      final_score,
      pdf_url,
      verification_code,
      course:courses(
        id,
        title,
        description
      ),
      company:companies(
        id,
        name
      )
    `)
    .eq('id', certificateId)
    .eq('user_id', user.id)
    .single();

  if (!certificate) {
    notFound();
  }

  const cert = certificate as CertificateType;
  const isExpired = cert.expires_at && new Date(cert.expires_at) < new Date();

  return (
    <div className="p-8">
      <Link
        href="/learner/certificates"
        className="text-primary-500 hover:text-primary-600 mb-4 inline-block"
      >
        ← Back to Certificates
      </Link>

      <div className="max-w-4xl mx-auto">
        {/* Certificate Display */}
        <div className="bg-white rounded-lg shadow-lg p-12 mb-6 border-2 border-gray-200">
          <div className="text-center">
            <div className="mb-6">
              <svg className="w-24 h-24 text-primary-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-2">Certificate of Completion</h1>
            <p className="text-xl text-gray-600 mb-8">This is to certify that</p>

            <h2 className="text-3xl font-semibold text-primary-500 mb-8">
              {profile.full_name || user.email}
            </h2>

            <p className="text-lg text-gray-700 mb-2">has successfully completed the course</p>
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">{cert.course.title}</h3>

            {cert.final_score !== null && (
              <p className="text-lg text-gray-700 mb-8">
                with a final score of <span className="font-bold text-primary-500">{cert.final_score}%</span>
              </p>
            )}

            <div className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Issued</p>
                <p className="font-semibold text-gray-900">
                  {new Date(cert.issued_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              {cert.expires_at && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Expires</p>
                  <p className={`font-semibold ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
                    {new Date(cert.expires_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 font-mono">Certificate #: {cert.certificate_number}</p>
              <p className="text-sm text-gray-500 font-mono mt-1">Verification Code: {cert.verification_code}</p>
            </div>
          </div>
        </div>

        {/* Certificate Details */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Certificate Details</h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Course</dt>
              <dd className="mt-1 text-sm text-gray-900">{cert.course.title}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Company</dt>
              <dd className="mt-1 text-sm text-gray-900">{cert.company.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Certificate Number</dt>
              <dd className="mt-1 text-sm font-mono text-gray-900">{cert.certificate_number}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Verification Code</dt>
              <dd className="mt-1 text-sm font-mono text-gray-900">{cert.verification_code}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Issued Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(cert.issued_at).toLocaleDateString()}
              </dd>
            </div>
            {cert.expires_at && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Expiry Date</dt>
                <dd className={`mt-1 text-sm ${isExpired ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                  {new Date(cert.expires_at).toLocaleDateString()}
                  {isExpired && ' (Expired)'}
                </dd>
              </div>
            )}
            {cert.final_score !== null && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Final Score</dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900">{cert.final_score}%</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          {cert.pdf_url && (
            <a
              href={cert.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
            >
              Download PDF Certificate
            </a>
          )}
          <Link
            href={`/learner/courses/${cert.course.id}`}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            View Course
          </Link>
        </div>
      </div>
    </div>
  );
}

