'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function PublicWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return <>{children}</>;
} 