import type { SupabaseAdmin } from './types/supabase-admin';

export interface CrmAdapter {
  createLead(payload: Record<string, unknown>): Promise<{ externalId?: string }>;
  updateLead(payload: Record<string, unknown>): Promise<void>;
  updateLeadStatus(payload: Record<string, unknown>): Promise<void>;
}

function getProvider(): string {
  return process.env.CRM_PROVIDER || 'hubspot';
}

export function mapLeadToCrmFields(lead: Record<string, unknown>) {
  return {
    lead_id: lead.id,
    full_name: lead.name,
    email: lead.email,
    phone: lead.phone,
    source_page: lead.source_page,
    service_interest: lead.service_slug,
    status: lead.lead_status,
    score: lead.lead_score,
    owner_id: lead.owner_id,
    won_value: lead.won_value,
  };
}

export async function enqueueCrmSyncJob(input: {
  supabaseAdmin: SupabaseAdmin;
  leadId: string;
  jobType: 'create' | 'update' | 'status_change';
  payload: Record<string, unknown>;
  dedupeContext: string;
}) {
  const dedupeKey = `crm:${input.leadId}:${input.jobType}:${input.dedupeContext}`;

  await input.supabaseAdmin.from('crm_sync_jobs').upsert(
    {
      lead_id: input.leadId,
      job_type: input.jobType,
      provider: getProvider(),
      payload: input.payload,
      dedupe_key: dedupeKey,
      status: 'pending',
      next_attempt_at: new Date().toISOString(),
    },
    { onConflict: 'dedupe_key', ignoreDuplicates: true }
  );
}

export async function processNextCrmSyncJob(input: {
  supabaseAdmin: SupabaseAdmin;
  adapter: CrmAdapter;
}) {
  const nowIso = new Date().toISOString();
  const { data: job } = await input.supabaseAdmin
    .from('crm_sync_jobs')
    .select('*')
    .in('status', ['pending', 'retry'])
    .lte('next_attempt_at', nowIso)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!job) return null;

  try {
    await input.supabaseAdmin
      .from('crm_sync_jobs')
      .update({ status: 'processing' })
      .eq('id', job.id)
      .eq('status', job.status);

    if (job.job_type === 'create') {
      await input.adapter.createLead(job.payload || {});
    } else if (job.job_type === 'update') {
      await input.adapter.updateLead(job.payload || {});
    } else {
      await input.adapter.updateLeadStatus(job.payload || {});
    }

    await input.supabaseAdmin.from('crm_sync_jobs').update({
      status: 'completed',
      processed_at: new Date().toISOString(),
      last_error: null,
    }).eq('id', job.id);

    await input.supabaseAdmin.from('crm_sync_logs').insert({
      job_id: job.id,
      status: 'completed',
      response_payload: job.payload || {},
    });

    return job;
  } catch (error) {
    const nextAttemptCount = Number(job.attempt_count || 0) + 1;
    const terminal = nextAttemptCount >= 5;
    const backoffMinutes = Math.min(60, Math.pow(2, nextAttemptCount));

    await input.supabaseAdmin.from('crm_sync_jobs').update({
      status: terminal ? 'failed' : 'retry',
      attempt_count: nextAttemptCount,
      next_attempt_at: new Date(Date.now() + backoffMinutes * 60 * 1000).toISOString(),
      last_error: error instanceof Error ? error.message : 'CRM sync failure',
    }).eq('id', job.id);

    await input.supabaseAdmin.from('crm_sync_logs').insert({
      job_id: job.id,
      status: terminal ? 'failed' : 'retry',
      error_message: error instanceof Error ? error.message : 'CRM sync failure',
    });

    return null;
  }
}

export const crmAdapters = {
  hubspot: {
    async createLead() {
      return { externalId: 'stub-hubspot-id' };
    },
    async updateLead() {
      return;
    },
    async updateLeadStatus() {
      return;
    },
  } satisfies CrmAdapter,
};
