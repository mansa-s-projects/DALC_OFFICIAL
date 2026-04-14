import { supabase } from './supabase';
import type { UserProfile } from '../types';

export async function signUp(email: string, password: string, firstName?: string, lastName?: string) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { first_name: firstName, last_name: lastName },
    },
  });

  if (error) throw error;

  if (data.user && (firstName || lastName)) {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ first_name: firstName, last_name: lastName })
      .eq('id', data.user.id);
    if (profileError) {
      console.error('Failed to update profile after signup:', profileError);
      throw new Error('Account created but failed to set profile name. Please update your profile.');
    }
  }

  return data;
}

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  if (!supabase) return null;

  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getProfile(userId: string): Promise<UserProfile | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    phone: data.phone,
    avatar_url: data.avatar_url,
    skills: data.skills ?? [],
    preferences: data.preferences ?? {},
    relocation_stage: data.relocation_stage ?? 'EXPLORING',
    role: data.role ?? 'user',
    tier: data.tier ?? 'standard',
  };
}

export async function updateProfile(userId: string, updates: Partial<UserProfile>) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const allowedFields: Array<keyof UserProfile> = [
    'first_name', 'last_name', 'phone', 'skills', 'preferences', 'relocation_stage',
  ];
  const patch: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      patch[key] = updates[key];
    }
  }
  if (Object.keys(patch).length === 0) return;

  const { error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('id', userId);

  if (error) throw error;
}
