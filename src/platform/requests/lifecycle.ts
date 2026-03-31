/**
 * src/platform/requests/lifecycle.ts
 *
 * Request lifecycle definitions, valid transition graph, and the
 * platform-layer transition executor that writes a status log entry
 * and dispatches the appropriate notification.
 */

import type { Request, RequestStatus } from '../../types';
import { supabase } from '../../lib/supabase';
import { notifyRequestEvent } from '../notifications/requestNotifications';

// ── Valid transitions ─────────────────────────────────────────────────────────

const TRANSITIONS: Readonly<Record<RequestStatus, RequestStatus[]>> = {
  submitted:          ['acknowledged', 'assigned', 'cancelled'],
  pending:            ['acknowledged', 'submitted', 'cancelled'],
  acknowledged:       ['assigned', 'supplier_contacted', 'declined', 'cancelled'],
  assigned:           ['supplier_contacted', 'in_progress', 'declined', 'cancelled'],
  supplier_contacted: ['in_progress', 'quoted', 'declined', 'cancelled'],
  in_progress:        ['quoted', 'confirmed', 'declined', 'cancelled'],
  quoted:             ['confirmed', 'declined', 'cancelled'],
  confirmed:          ['completed', 'cancelled'],
  completed:          [],
  declined:           [],
  cancelled:          [],
};

export function isValidTransition(from: RequestStatus, to: RequestStatus): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function getAllowedNextStatuses(current: RequestStatus): RequestStatus[] {
  return TRANSITIONS[current] ?? [];
}

// ── Status log helpers ────────────────────────────────────────────────────────

export interface StatusLogEntry {
  id: string;
  request_id: string;
  old_status: string | null;
  new_status: string;
  changed_by: string | null;
  notes: string | null;
  created_at: string;
}

/**
 * Fetch the full status log for a request, oldest-first.
 */
export async function fetchStatusLog(requestId: string): Promise<StatusLogEntry[]> {
  const { data, error } = await supabase
    .from('request_status_log')
    .select('*')
    .eq('request_id', requestId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as StatusLogEntry[];
}

// ── Transition executor ───────────────────────────────────────────────────────

export interface TransitionInput {
  requestId: string;
  fromStatus: RequestStatus;
  toStatus: RequestStatus;
  changedBy?: string;
  notes?: string;
}

export interface TransitionResult {
  request: Request;
  logEntry: StatusLogEntry | null;
}

/**
 * Execute a request status transition.
 *
 * 1. Validates the transition is allowed.
 * 2. Updates `requests.status` (+ timestamps for confirmed/completed).
 * 3. Inserts a `request_status_log` entry.
 * 4. Dispatches a notification event.
 */
export async function transitionRequestStatus(input: TransitionInput): Promise<TransitionResult> {
  const { requestId, fromStatus, toStatus, changedBy, notes } = input;

  if (!isValidTransition(fromStatus, toStatus)) {
    throw new Error(
      `Invalid status transition: ${fromStatus} → ${toStatus}`
    );
  }

  // Build request update payload
  const requestUpdate: Record<string, unknown> = { status: toStatus };
  if (toStatus === 'confirmed') requestUpdate.confirmed_at = new Date().toISOString();
  if (toStatus === 'completed') requestUpdate.completed_at = new Date().toISOString();

  let requestData: Request | null = null;

  try {
    const { data } = await supabase
      .from('requests')
      .update(requestUpdate)
      .eq('id', requestId)
      .eq('status', fromStatus)
      .select('*')
      .single();

    requestData = data as Request | null;

    const { error: logError } = await supabase
      .from('request_status_log')
      .insert({
        request_id: requestId,
        old_status: fromStatus,
        new_status: toStatus,
        changed_by: changedBy ?? null,
        notes: notes ?? null,
      });

    if (logError) {
      // Rollback the first update
      await supabase
        .from('requests')
        .update({ status: fromStatus })
        .eq('id', requestId);
      throw logError;
    }
  } catch (error) {
    throw new Error(`Failed to update request lifecycle: ${(error as Error).message}`);
  }

  const request = requestData as Request;

  await notifyRequestEvent({
    requestId,
    userId: request.user_id,
    venueName: request.venue_name,
    category: request.category,
    fromStatus,
    toStatus,
  });

  return { request, logEntry: null };
}
