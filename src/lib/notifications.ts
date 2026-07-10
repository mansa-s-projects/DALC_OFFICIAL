import { getSupabaseAdminClient } from './supabase-admin';

export type NotificationType =
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'request_update'
  | 'request_assigned'
  | 'quote_ready'
  | 'payment_confirmed'
  | 'payment_received'
  | 'message_received'
  | 'document_status'
  | 'reminder'
  | 'system';

export interface NotificationPayload {
  userId: string;
  requestId?: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

export async function sendNotification(payload: NotificationPayload): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from('notifications').insert({
    user_id: payload.userId,
    type: payload.type,
    title: payload.title,
    message: payload.message,
    action_url: payload.actionUrl ?? (payload.requestId ? `/my-requests/${payload.requestId}` : null),
    metadata: payload.metadata ?? {},
  });
  if (error) throw error;
}

const STATUS_LABELS: Record<string, string> = {
  submitted: 'Submitted',
  assigned: 'Assigned to Concierge',
  quoted: 'Quote Ready',
  confirmed: 'Confirmed',
  completed: 'Completed',
  declined: 'Declined',
};

export async function notifyRequestStatusChange(
  userId: string,
  requestId: string,
  status: string
): Promise<void> {
  const label = STATUS_LABELS[status] ?? status;
  const isQuote = status === 'quoted';

  await sendNotification({
    userId,
    requestId,
    type: isQuote ? 'quote_ready' : 'request_update',
    title: isQuote ? 'Your Quote Is Ready' : `Request ${label}`,
    message: isQuote
      ? 'Your concierge has prepared a quote. Tap to review and pay.'
      : `Your request status has been updated to: ${label}`,
  });
}
