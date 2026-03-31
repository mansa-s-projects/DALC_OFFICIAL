import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  tier?: string;
  status?: string;
  avatar_url?: string;
}

export function useUser() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        throw sessionError;
      }

      const sessionUser = sessionData.session?.user;
      if (!sessionUser) {
        return { session: null, profile: null as UserProfile | null };
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      return {
        session: sessionData.session,
        profile: {
          id: profile.id,
          email: profile.email,
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          tier: profile.tier,
          status: profile.status,
          avatar_url: profile.avatar_url
        } as UserProfile
      };
    }
  });
}
