'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RequestRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to services page where users can make requests
    router.replace('/services');
  }, [router]);
  
  return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm uppercase tracking-widest">Redirecting...</p>
      </div>
    </div>
  );
}
