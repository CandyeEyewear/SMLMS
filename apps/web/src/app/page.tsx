'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if there's a hash fragment with auth tokens
    if (window.location.hash && window.location.hash.includes('access_token')) {
      // Use window.location.href to preserve the hash fragment
      window.location.href = '/auth/callback' + window.location.hash;
      return;
    }

    // No auth tokens, redirect to login
    router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
