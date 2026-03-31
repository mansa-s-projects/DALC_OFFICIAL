type SupabaseAdmin = any;

export type NotificationEventType =
  | 'new_hot_lead_created'
  | 'warm_lead_became_hot'
  | 'new_lead_assigned_to_owner'
  | 'overdue_follow_up_task'
  | 'sla_breach'
  | 'lead_marked_won'
  | 'lead_marked_lost'
  | 'unresponsive_lead_detected';

export type NotificationChannel = 'email' | 'internal_dashboard' | 'webhook';

export interface NotificationEvent {
  eventType: NotificationEventType;
  leadId?: string;
  ownerId?: string | null;
  triggerSource: string;
  payload?: Record<string, unknown>;
  dedupeContext?: string;
}

interface NotificationTarget {
  channel: NotificationChannel;
  recipient: string;
}

const MAX_RETRY = 3;

function computeDedupeKey(event: NotificationEvent) {
  const leadPart = event.leadId || 'no-lead';
  const ownerPart = event.ownerId || 'no-owner';
  const context = event.dedupeContext || 'default';
  return `${event.eventType}:${leadPart}:${ownerPart}:${event.triggerSource}:${context}`;
}

function defaultTargets(event: NotificationEvent): NotificationTarget[] {
  const ownerRecipient = event.ownerId || 'sales-ops';
  const webhookRecipient = process.env.NOTIFICATION_WEBHOOK_URL || 'webhook:not-configured';
  const emailRecipient =
    process.env.NOTIFICATION_EMAIL_DEFAULT_RECIPIENT || `${ownerRecipient}@dalc.internal`;

  return [
    { channel: 'internal_dashboard', recipient: ownerRecipient },
    { channel: 'email', recipient: emailRecipient },
    { channel: 'webhook', recipient: webhookRecipient },
  ];
}

async function resolveTargets(
  supabaseAdmin: SupabaseAdmin,
  event: NotificationEvent
): Promise<NotificationTarget[]> {
  const ownerId = event.ownerId || null;

  const { data } = await supabaseAdmin
    .from('notification_preferences')
    .select('channel, recipient')
    .eq('event_type', event.eventType)
    .eq('enabled', true)
    .or(ownerId ? `owner_id.eq.${ownerId},owner_id.is.null` : 'owner_id.is.null');

  if (!data || data.length === 0) {
    return defaultTargets(event);
  }

  return data.map((row: any) => ({
    channel: row.channel as NotificationChannel,
    recipient: String(row.recipient),
  }));
}

async function markNotificationStatus(
  supabaseAdmin: SupabaseAdmin,
  notificationId: string,
  patch: Record<string, unknown>
) {
  await supabaseAdmin.from('notifications').update(patch).eq('id', notificationId);
}

async function dispatchEmail(target: NotificationTarget, payload: Record<string, unknown>) {
  const emailWebhook = process.env.NOTIFICATION_EMAIL_WEBHOOK_URL;

  if (!emailWebhook) {
    return { ok: true };
  }

  const response = await fetch(emailWebhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: target.recipient, payload }),
  });

  if (!response.ok) {
    throw new Error(`Email delivery failed with status ${response.status}`);
  }

  return { ok: true };
}

async function dispatchInternalDashboard() {
  return { ok: true };
}

async function dispatchWebhook(target: NotificationTarget, payload: Record<string, unknown>) {
  if (target.recipient === 'webhook:not-configured') {
    return { ok: true };
  }

  const response = await fetch(target.recipient, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Webhook delivery failed with status ${response.status}`);
  }

  return { ok: true };
}

async function dispatchNotification(
  target: NotificationTarget,
  payload: Record<string, unknown>
) {
  if (target.channel === 'email') return dispatchEmail(target, payload);
  if (target.channel === 'internal_dashboard') return dispatchInternalDashboard();
  return dispatchWebhook(target, payload);
}

async function getOrCreateNotificationRecord(
  supabaseAdmin: SupabaseAdmin,
  event: NotificationEvent,
  target: NotificationTarget,
  dedupeKey: string
) {
  const { data: existing } = await supabaseAdmin
    .from('notifications')
    .select('*')
    .eq('dedupe_key', dedupeKey)
    .eq('channel', target.channel)
    .eq('recipient', target.recipient)
    .maybeSingle();

  if (existing) return existing;

  const insertPayload = {
    event_type: event.eventType,
    lead_id: event.leadId || null,
    owner_id: event.ownerId || null,
    channel: target.channel,
    recipient: target.recipient,
    payload: event.payload || {},
    status: 'pending',
    dedupe_key: dedupeKey,
    retry_count: 0,
    trigger_source: event.triggerSource,
  };

  const { data, error } = await supabaseAdmin
    .from('notifications')
    .upsert(insertPayload, {
      onConflict: 'dedupe_key,channel,recipient',
      ignoreDuplicates: true,
    })
    .select('*')
    .maybeSingle();

  if (error) throw new Error(error.message || 'Failed to persist notification');
  if (data) return data;

  const fallback = await supabaseAdmin
    .from('notifications')
    .select('*')
    .eq('dedupe_key', dedupeKey)
    .eq('channel', target.channel)
    .eq('recipient', target.recipient)
    .single();

  if (!fallback.data) throw new Error('Notification persistence lookup failed');
  return fallback.data;
}

export async function processNotificationEvent(
  supabaseAdmin: SupabaseAdmin,
  event: NotificationEvent
) {
  if (!event.eventType || !event.triggerSource) {
    throw new Error('Invalid notification event payload');
  }

  const dedupeKey = computeDedupeKey(event);
  const targets = await resolveTargets(supabaseAdmin, event);

  for (const target of targets) {
    const record = await getOrCreateNotificationRecord(supabaseAdmin, event, target, dedupeKey);

    if (record.status === 'sent') continue;
    if (record.status === 'failed' && Number(record.retry_count || 0) >= MAX_RETRY) continue;

    try {
      await dispatchNotification(target, {
        event_type: event.eventType,
        lead_id: event.leadId || null,
        owner_id: event.ownerId || null,
        trigger_source: event.triggerSource,
        payload: event.payload || {},
      });

      await markNotificationStatus(supabaseAdmin, record.id, {
        status: 'sent',
        sent_at: new Date().toISOString(),
        failed_at: null,
        error_message: null,
      });
    } catch (error) {
      const retryCount = Number(record.retry_count || 0) + 1;
      await markNotificationStatus(supabaseAdmin, record.id, {
        status: retryCount >= MAX_RETRY ? 'failed' : 'pending',
        failed_at: new Date().toISOString(),
        error_message: error instanceof Error ? error.message : 'Notification dispatch failed',
        retry_count: retryCount,
      });
    }
  }
}
