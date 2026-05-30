import { supabase } from '../../lib/supabase';
import type {
  ConciergeRequest,
  ConciergeRequestInput,
  ConciergeStatus,
} from './types';

// ─── Submit Request ───────────────────────────────────────────────────────────

export async function submitConciergeRequest(
  userId: string,
  input: ConciergeRequestInput
): Promise<ConciergeRequest> {
  const insertPayload = {
    user_id: userId,
    category: 'concierge',
    request_type: 'concierge',
    concierge_request_type: input.request_type,
    title: input.title,
    description: input.description,
    urgency: input.urgency,
    preferred_date: input.preferred_date,
    preferred_time: input.preferred_time,
    budget_range: input.budget_range,
    special_instructions: input.special_instructions,
    status: 'pending',
    party_size: 1,
  };

  const { data, error } = await supabase
    .from('requests')
    .insert(insertPayload)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data as ConciergeRequest;
}

// ─── Get My Requests ──────────────────────────────────────────────────────────

export async function getMyConciergeRequests(
  userId: string
): Promise<ConciergeRequest[]> {
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .eq('user_id', userId)
    .eq('request_type', 'concierge')
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
  const statusPatch = {
    status,
    concierge_notes: notes,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('requests').update(statusPatch).eq('id', requestId)
    .select('id');

  return !error;
}
