import { supabase, isMockMode } from '../../lib/supabase';
import type {
  ConciergeRequest,
  ConciergeRequestInput,
  ConciergeStatus,
} from './types';

// ─── Submit Request ───────────────────────────────────────────────────────────

export async function submitConciergeRequest(
  userId: string,
  input: ConciergeRequestInput
): Promise<ConciergeRequest | null> {
  if (isMockMode || !supabase) {
    // Mock response for development
    return {
      id: `mock-concierge-${Date.now()}`,
      user_id: userId,
      ...input,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as ConciergeRequest;
  }

  const { data, error } = await supabase
    .from('requests')
    .insert({
      user_id: userId,
      request_type: input.request_type,
      title: input.title,
      description: input.description,
      urgency: input.urgency,
      preferred_date: input.preferred_date,
      preferred_time: input.preferred_time,
      budget_range: input.budget_range,
      special_instructions: input.special_instructions,
      status: 'pending',
      source: 'concierge',
    })
    .select()
    .single();

  if (error) {
    console.error('submitConciergeRequest error:', error);
    return null;
  }

  return data as ConciergeRequest;
}

// ─── Get My Requests ──────────────────────────────────────────────────────────

export async function getMyConciergeRequests(
  userId: string
): Promise<ConciergeRequest[]> {
  if (isMockMode || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .eq('user_id', userId)
    .eq('source', 'concierge')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getMyConciergeRequests error:', error);
    return [];
  }

  return (data ?? []) as ConciergeRequest[];
}

// ─── Update Status (Admin/Concierge) ─────────────────────────────────────────

export async function updateConciergeStatus(
  requestId: string,
  status: ConciergeStatus,
  notes?: string
): Promise<boolean> {
  if (isMockMode || !supabase) return true;

  const { error } = await supabase
    .from('requests')
    .update({
      status,
      concierge_notes: notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', requestId);

  return !error;
}
