import { supabase } from '../../lib/supabase';
import type { UserEntity } from './userTypes';

export async function getUserById(id: string): Promise<UserEntity | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, first_name, last_name, role, created_at')
    .eq('id', id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    email: data.email ?? null,
    firstName: data.first_name ?? null,
    lastName: data.last_name ?? null,
    role: (data.role ?? 'user') as UserEntity['role'],
    createdAt: data.created_at ?? null,
  };
}
