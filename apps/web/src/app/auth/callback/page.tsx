'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const [status, setStatus] = useState('Processing your invitation...');
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      let supabase: ReturnType<typeof createClient>;
      try {
        supabase = createClient();
      } catch (err) {
        setStatus(err instanceof Error ? err.message : 'Supabase is not configured.');
        return;
      }

      // Get the hash fragment from URL
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      if (accessToken && refreshToken) {
        // Set the session
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          setStatus('Error: ' + error.message);
          return;
        }

        // If this is an invite, redirect to password setup
        if (type === 'invite') {
          setStatus('Redirecting to password setup...');
          router.push('/auth/setup-password');
          return;
        }

        // Otherwise, redirect based on role
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          setStatus('Success! Redirecting...');

          setTimeout(() => {
            if (profile?.role === 'super_admin') {
              router.push('/super-admin');
            } else if (profile?.role === 'company_admin') {
              router.push('/company-admin');
            } else {
              router.push('/learner');
            }
          }, 500);
        }
      } else {
        setStatus('Invalid or expired link. Please request a new invitation.');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  );
}
