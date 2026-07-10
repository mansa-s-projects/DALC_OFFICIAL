import type { RequestStatus } from '../../types';

export interface RequestNotificationPayload {
  requestId: string;
  userId?: string | null;
  venueName?: string | null;
  category?: string | null;
  fromStatus: RequestStatus;
  toStatus: RequestStatus;
  notes?: string | null;
}

const EVENT_MESSAGES: Partial<Record<RequestStatus, string>> = {
  acknowledged:       'Your request has been received and is being reviewed.',
  assigned:           'A concierge has been assigned to your request.',
  supplier_contacted: 'We are now contacting the relevant suppliers.',
  in_progress:        'Your request is actively being worked on.',
  quoted:             'A quote is ready for your request.',
  confirmed:          'Your request has been confirmed!',
  completed:          'Your request has been completed.',
  declined:           'Unfortunately your request could not be fulfilled.',
  cancelled:          'Your request has been cancelled.',
};

const STATUS_TITLES: Partial<Record<RequestStatus, string>> = {
  acknowledged:       'Request Received',
  assigned:           'Concierge Assigned',
  supplier_contacted: 'Suppliers Contacted',
  in_progress:        'Request In Progress',
  quoted:             'Your Quote Is Ready',
  confirmed:          'Request Confirmed',
  completed:          'Request Completed',
  declined:           'Request Declined',
  cancelled:          'Request Cancelled',
};

/**
 * Dispatch a notification for a request lifecycle transition.
 * Writes to the notifications table via /api/notifications (server-side admin client).
 * Fire-and-forget — never throws so the lifecycle transition always succeeds.
 */
export async function notifyRequestEvent(
  payload: RequestNotificationPayload
): Promise<void> {
  const { requestId, userId, venueName, category, toStatus } = payload;
  if (!userId) return;

  const message = EVENT_MESSAGES[toStatus];
  const title = STATUS_TITLES[toStatus];
  if (!message || !title) return;

  const label = venueName ?? category ?? 'your request';

  try {
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        type: toStatus === 'quoted' ? 'quote_ready' : 'request_update',
        title,
        message: `${label}: ${message}`,
        action_url: `/my-requests/${requestId}`,
        metadata: { requestId, transition: toStatus },
      }),
    });
  } catch {
    // Never block the lifecycle transition
  }
}
