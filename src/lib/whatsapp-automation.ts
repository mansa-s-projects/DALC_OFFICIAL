import type { SupabaseAdmin } from './types/supabase-admin';

export type WhatsAppTriggerType =
  | 'hot_lead_created'
  | 'no_response_follow_up'
  | 'follow_up_reminder';

export async function enqueueWhatsAppJob(input: {
  supabaseAdmin: SupabaseAdmin;
  leadId: string;
  triggerType: WhatsAppTriggerType;
  templateKey: string;
  recipientPhone?: string;
  payload?: Record<string, unknown>;
  dedupeContext: string;
}) {
  const dedupeKey = `wa:${input.leadId}:${input.triggerType}:${input.dedupeContext}`;

  const upsertPayload = {
    lead_id: input.leadId,
    trigger_type: input.triggerType,
    template_key: input.templateKey,
    recipient_phone: input.recipientPhone || null,
    payload: input.payload || {},
    dedupe_key: dedupeKey,
    status: 'pending',
    next_attempt_at: new Date().toISOString(),
  };
  const { error } = await input.supabaseAdmin
    .from('whatsapp_jobs')
    .upsert(upsertPayload, { onConflict: 'dedupe_key', ignoreDuplicates: true })
    .select('id');
  if (error) throw new Error(error.message || 'Failed to enqueue WhatsApp job');
}

export async function processNextWhatsAppJob(supabaseAdmin: SupabaseAdmin) {
  const nowIso = new Date().toISOString();
  const { data: job } = await supabaseAdmin
    .from('whatsapp_jobs')
    .select('id, lead_id, trigger_type, template_key, recipient_phone, payload, dedupe_key, status, attempt_count, next_attempt_at, sent_at, failed_at, error_message, created_at')
    .in('status', ['pending', 'retry'])
    .lte('next_attempt_at', nowIso)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!job) return null;

  const providerUrl = process.env.WHATSAPP_PROVIDER_WEBHOOK_URL;

  try {
    const processingPatch = { status: 'processing' };
    const { error: processingError } = await supabaseAdmin
      .from('whatsapp_jobs').update(processingPatch).eq('id', job.id)
      .select('id');
    if (processingError) throw new Error(processingError.message || 'Failed to mark WhatsApp job as processing');

    if (!providerUrl) {
      throw new Error('WHATSAPP_PROVIDER_WEBHOOK_URL is not configured');
    }

    const response = await fetch(providerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lead_id: job.lead_id,
        template_key: job.template_key,
        to: job.recipient_phone,
        payload: job.payload || {},
      }),
    });

    if (!response.ok) {
      throw new Error(`WhatsApp provider failed: ${response.status}`);
    }

    const sentPatch = {
      status: 'sent',
      sent_at: new Date().toISOString(),
      error_message: null,
    };
    const { error: sentError } = await supabaseAdmin
      .from('whatsapp_jobs').update(sentPatch).eq('id', job.id)
      .select('id');
    if (sentError) throw new Error(sentError.message || 'Failed to mark WhatsApp job as sent');

    const sentDeliveryLogPayload = {
      whatsapp_job_id: job.id,
      delivery_status: 'sent',
      provider_payload: job.payload || {},
    };
    await supabaseAdmin.from('whatsapp_delivery_logs').insert(sentDeliveryLogPayload).select('id');

    return job;
  } catch (error) {
    const attempts = Number(job.attempt_count || 0) + 1;
    const terminal = attempts >= 5;
    const retryPatch = {
      status: terminal ? 'failed' : 'retry',
      attempt_count: attempts,
      failed_at: new Date().toISOString(),
      error_message: error instanceof Error ? error.message : 'WhatsApp delivery failure',
      next_attempt_at: new Date(Date.now() + Math.min(60, Math.pow(2, attempts)) * 60000).toISOString(),
    };
    const { error: retryError } = await supabaseAdmin
      .from('whatsapp_jobs').update(retryPatch).eq('id', job.id)
      .select('id');
    if (retryError) throw new Error(retryError.message || 'Failed to update WhatsApp retry state');

    const retryDeliveryLogPayload = {
      whatsapp_job_id: job.id,
      delivery_status: terminal ? 'failed' : 'retry',
      provider_payload: {
        error: error instanceof Error ? error.message : 'WhatsApp delivery failure',
      },
    };
    await supabaseAdmin.from('whatsapp_delivery_logs').insert(retryDeliveryLogPayload).select('id');

    return null;
  }
}
