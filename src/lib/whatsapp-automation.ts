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

  await input.supabaseAdmin.from('whatsapp_jobs').upsert(
    {
      lead_id: input.leadId,
      trigger_type: input.triggerType,
      template_key: input.templateKey,
      recipient_phone: input.recipientPhone || null,
      payload: input.payload || {},
      dedupe_key: dedupeKey,
      status: 'pending',
      next_attempt_at: new Date().toISOString(),
    },
    { onConflict: 'dedupe_key', ignoreDuplicates: true }
  );
}

export async function processNextWhatsAppJob(supabaseAdmin: SupabaseAdmin) {
  const nowIso = new Date().toISOString();
  const { data: job } = await supabaseAdmin
    .from('whatsapp_jobs')
    .select('*')
    .in('status', ['pending', 'retry'])
    .lte('next_attempt_at', nowIso)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!job) return null;

  const providerUrl = process.env.WHATSAPP_PROVIDER_WEBHOOK_URL;

  try {
    await supabaseAdmin.from('whatsapp_jobs').update({ status: 'processing' }).eq('id', job.id);

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

    await supabaseAdmin.from('whatsapp_jobs').update({
      status: 'sent',
      sent_at: new Date().toISOString(),
      error_message: null,
    }).eq('id', job.id);

    await supabaseAdmin.from('whatsapp_delivery_logs').insert({
      whatsapp_job_id: job.id,
      delivery_status: 'sent',
      provider_payload: job.payload || {},
    });

    return job;
  } catch (error) {
    const attempts = Number(job.attempt_count || 0) + 1;
    const terminal = attempts >= 5;
    await supabaseAdmin.from('whatsapp_jobs').update({
      status: terminal ? 'failed' : 'retry',
      attempt_count: attempts,
      failed_at: new Date().toISOString(),
      error_message: error instanceof Error ? error.message : 'WhatsApp delivery failure',
      next_attempt_at: new Date(Date.now() + Math.min(60, Math.pow(2, attempts)) * 60000).toISOString(),
    }).eq('id', job.id);

    await supabaseAdmin.from('whatsapp_delivery_logs').insert({
      whatsapp_job_id: job.id,
      delivery_status: terminal ? 'failed' : 'retry',
      provider_payload: {
        error: error instanceof Error ? error.message : 'WhatsApp delivery failure',
      },
    });

    return null;
  }
}
