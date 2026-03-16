/**
 * src/platform/notifications/requestNotifications.ts
 *
 * Platform-layer notification dispatcher for request lifecycle events.
 * Currently logs to console; wire to Supabase realtime / email / push here.
 */

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

/**
 * Dispatch a notification for a request lifecycle transition.
 * In production, swap the console.info calls with Supabase inserts,
 * push notification calls, or email triggers as required.
 */
export async function notifyRequestEvent(
  payload: RequestNotificationPayload
): Promise<void> {
  const { requestId, userId, venueName, category, fromStatus, toStatus } = payload;
  const message = EVENT_MESSAGES[toStatus];

  console.info('[RequestNotification]', {
    requestId,
    userId,
    venueName,
    category,
    transition: `${fromStatus} → ${toStatus}`,
    message,
  });

  // TODO: Insert into `notifications` table
  // TODO: Send push notification via OneSignal/FCM if user has opted in
  // TODO: Trigger email via Resend/SendGrid for high-importance transitions
  //       (quoted, confirmed, declined, completed)
}
