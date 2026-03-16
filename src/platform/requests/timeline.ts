/**
 * src/platform/requests/timeline.ts
 *
 * Timeline hydration helpers.
 * Converts raw request_status_log entries into a display-ready
 * ordered timeline with active/past flags.
 */

import type { RequestStatus } from '../../types';
import type { StatusLogEntry } from './lifecycle';
import { REQUEST_STATUS_LABELS } from '../../types';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TimelineEntry {
  status: RequestStatus;
  label: string;
  timestamp: string | null;   // ISO string from log, or null if not yet reached
  isActive: boolean;           // current status
  isPast: boolean;             // already passed
  notes: string | null;
  changedBy: string | null;
}

// The canonical display order of statuses in the timeline
const TIMELINE_ORDER: RequestStatus[] = [
  'pending',
  'submitted',
  'acknowledged',
  'assigned',
  'supplier_contacted',
  'in_progress',
  'quoted',
  'confirmed',
  'completed',
];

// Terminal statuses that short-circuit the timeline
const TERMINAL: RequestStatus[] = ['cancelled', 'declined'];

// ── hydrateTimeline ───────────────────────────────────────────────────────────

/**
 * Build a display-ready timeline from the raw status log.
 *
 * - For each canonical step, looks for a matching log entry to get the timestamp.
 * - Marks the `currentStatus` entry as `isActive`.
 * - Entries before `currentStatus` in the order are `isPast`.
 * - If `currentStatus` is a terminal state (cancelled/declined), appends it as
 *   the last entry.
 */
export function hydrateTimeline(
  statusLog: StatusLogEntry[],
  currentStatus: RequestStatus
): TimelineEntry[] {
  // Build a lookup: new_status → log entry (last one wins if duplicated)
  const logByStatus: Record<string, StatusLogEntry> = {};
  for (const entry of statusLog) {
    logByStatus[entry.new_status] = entry;
  }

  const isTerminal = TERMINAL.includes(currentStatus);
  const currentIndex = TIMELINE_ORDER.indexOf(currentStatus);

  const entries: TimelineEntry[] = TIMELINE_ORDER.map((status, idx) => {
    const log = logByStatus[status];
    const isPast = isTerminal
      ? Boolean(log)
      : idx < currentIndex;
    const isActive = !isTerminal && status === currentStatus;

    return {
      status,
      label: REQUEST_STATUS_LABELS[status] ?? status,
      timestamp: log?.created_at ?? null,
      isActive,
      isPast,
      notes: log?.notes ?? null,
      changedBy: log?.changed_by ?? null,
    };
  });

  // Append terminal status as the final node if applicable
  if (isTerminal) {
    const log = logByStatus[currentStatus];
    entries.push({
      status: currentStatus,
      label: REQUEST_STATUS_LABELS[currentStatus] ?? currentStatus,
      timestamp: log?.created_at ?? null,
      isActive: true,
      isPast: false,
      notes: log?.notes ?? null,
      changedBy: log?.changed_by ?? null,
    });
  }

  return entries;
}
