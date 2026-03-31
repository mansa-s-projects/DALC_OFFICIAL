import { supabase } from './supabase';
import type { UserProfile } from '../types';

// Cookie helpers for middleware auth
function setCookie(name: string, value: string, days = 7) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
}

async function setRoleCookie(userId: string) {
  if (!supabase) return;
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  
  if (data?.role) {
    setCookie('dalc_role', data.role);
  }
}

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

  // Update profile with name if provided
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
  
  // Set dalc_role cookie for middleware auth
  if (data.user) {
    await setRoleCookie(data.user.id);
  }
  
  return data;
}

export async function signOut() {
  if (!supabase) throw new Error('Supabase is not configured.');

  // Clear role cookie on sign out
  deleteCookie('dalc_role');

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

  // Sync role cookie with profile
  if (data.role) {
    setCookie('dalc_role', data.role);
  }

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
