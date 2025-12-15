// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

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
    thumbnail_url: string | null;
  };
  company: {
    id: string;
    name: string;
  };
};

export default async function CertificatesPage() {
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

  // Fetch certificates
  const { data: certificatesData } = await supabase
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
        thumbnail_url
      ),
      company:companies(
        id,
        name
      )
    `)
    .eq('user_id', user.id)
    .order('issued_at', { ascending: false });

  const certificates = (certificatesData || []) as CertificateType[];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
        <p className="text-gray-600 mt-1">View and download your earned certificates.</p>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No certificates yet</h3>
          <p className="text-gray-600 mb-6">
            Complete courses to earn certificates. Your certificates will appear here once you finish a course.
          </p>
          <Link
            href="/learner/courses"
            className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => {
            const isExpired = cert.expires_at && new Date(cert.expires_at) < new Date();
            
            return (
              <div
                key={cert.id}
                className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden border-2 ${
                  isExpired ? 'border-yellow-200' : 'border-green-200'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      isExpired ? 'bg-yellow-100' : 'bg-green-100'
                    }`}>
                      <svg className={`w-8 h-8 ${isExpired ? 'text-yellow-600' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    {isExpired && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                        Expired
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{cert.course.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{cert.company.name}</p>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>Certificate #:</span>
                      <span className="font-mono text-xs">{cert.certificate_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Issued:</span>
                      <span>{new Date(cert.issued_at).toLocaleDateString()}</span>
                    </div>
                    {cert.expires_at && (
                      <div className="flex justify-between">
                        <span>Expires:</span>
                        <span>{new Date(cert.expires_at).toLocaleDateString()}</span>
                      </div>
                    )}
                    {cert.final_score !== null && (
                      <div className="flex justify-between">
                        <span>Final Score:</span>
                        <span className="font-semibold">{cert.final_score}%</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {cert.pdf_url && (
                      <a
                        href={cert.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-center text-sm font-medium"
                      >
                        Download PDF
                      </a>
                    )}
                    <Link
                      href={`/learner/certificates/${cert.id}`}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

