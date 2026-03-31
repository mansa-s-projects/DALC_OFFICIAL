'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getProfile } from '@/lib/auth';
import { useAppStore } from '@/store/useAppStore';

export default function AuthListener() {
  const setSession = useAppStore((s) => s.setSession);
  const setProfile = useAppStore((s) => s.setProfile);
  const clearAuth = useAppStore((s) => s.clearAuth);

  useEffect(() => {
    if (!supabase) return;

    // Get initial session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        getProfile(session.user.id).then((profile) => {
          if (profile) setProfile(profile);
        });
      }
    });

    // Stay in sync with Supabase auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          const profile = await getProfile(session.user.id);
          if (profile) setProfile(profile);
        } else {
          clearAuth();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [setSession, setProfile, clearAuth]);

  return null;
}
