import { getProfile } from '../../lib/auth';
import { supabase } from '../../lib/supabase';

export async function getCurrentUserRole(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user?.id;
  if (!userId) return null;

  const profile = await getProfile(userId);
  return profile?.role ?? null;
}

export async function canManageSuppliers(): Promise<boolean> {
  const role = await getCurrentUserRole();
  return role === 'admin' || role === 'concierge';
}

export async function canUpdateRequestStatus(): Promise<boolean> {
  const role = await getCurrentUserRole();
  return role === 'admin' || role === 'concierge';
}

export async function canViewAllRequests(): Promise<boolean> {
  const role = await getCurrentUserRole();
  return role === 'admin' || role === 'concierge';
}
