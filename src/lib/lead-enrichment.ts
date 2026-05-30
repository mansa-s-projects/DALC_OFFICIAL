import type { SupabaseAdmin } from './types/supabase-admin';

export async function enqueueLeadEnrichmentJob(input: {
  supabaseAdmin: SupabaseAdmin;
  leadId: string;
  dedupeContext: string;
}) {
  const dedupeKey = `enrich:${input.leadId}:${input.dedupeContext}`;

  const upsertPayload = {
    lead_id: input.leadId,
    status: 'pending',
    dedupe_key: dedupeKey,
    next_attempt_at: new Date().toISOString(),
  };
  const { error } = await input.supabaseAdmin
    .from('lead_enrichment_jobs')
    .upsert(upsertPayload, { onConflict: 'dedupe_key', ignoreDuplicates: true })
    .select('id');
  if (error) throw new Error(error.message || 'Failed to enqueue lead enrichment job');
}

export async function processNextLeadEnrichmentJob(supabaseAdmin: SupabaseAdmin) {
  const nowIso = new Date().toISOString();
  const { data: job } = await supabaseAdmin
    .from('lead_enrichment_jobs')
    .select('id, lead_id, status, dedupe_key, attempt_count, next_attempt_at, last_error, processed_at, created_at')
    .in('status', ['pending', 'retry'])
    .lte('next_attempt_at', nowIso)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!job) return null;

  try {
    const processingPatch = { status: 'processing' };
    const { error: processingError } = await supabaseAdmin
      .from('lead_enrichment_jobs').update(processingPatch).eq('id', job.id)
      .select('id');
    if (processingError) throw new Error(processingError.message || 'Failed to mark enrichment job as processing');

    const { data: lead } = await supabaseAdmin
      .from('leads')
      .select('id, name, email, phone, source_page')
      .eq('id', job.lead_id)
      .single();
    if (!lead) throw new Error('Lead not found for enrichment');

    const apiUrl = process.env.LEAD_ENRICHMENT_API_URL;
    let enrichmentPayload: Record<string, unknown> = {};

    if (apiUrl) {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          source_page: lead.source_page,
        }),
      });

      if (!response.ok) {
        throw new Error(`Enrichment API failed: ${response.status}`);
      }

      enrichmentPayload = (await response.json()) as Record<string, unknown>;
    }

    const enrichmentDataPayload = {
      lead_id: job.lead_id,
      provider: process.env.LEAD_ENRICHMENT_PROVIDER || 'internal',
      data: enrichmentPayload,
      confidence_score: Number(enrichmentPayload.confidence_score || 0),
    };
    await supabaseAdmin.from('lead_enrichment_data').insert(enrichmentDataPayload).select('id');

    const completePatch = {
      status: 'completed',
      processed_at: new Date().toISOString(),
      last_error: null,
    };
    const { error: completeError } = await supabaseAdmin
      .from('lead_enrichment_jobs').update(completePatch).eq('id', job.id)
      .select('id');
    if (completeError) throw new Error(completeError.message || 'Failed to mark enrichment job as completed');

    return job;
  } catch (error) {
    const attempts = Number(job.attempt_count || 0) + 1;
    const terminal = attempts >= 5;

    const retryPatch = {
      status: terminal ? 'failed' : 'retry',
      attempt_count: attempts,
      next_attempt_at: new Date(Date.now() + Math.min(60, Math.pow(2, attempts)) * 60000).toISOString(),
      last_error: error instanceof Error ? error.message : 'Lead enrichment failed',
    };
    const { error: retryError } = await supabaseAdmin
      .from('lead_enrichment_jobs').update(retryPatch).eq('id', job.id)
      .select('id');
    if (retryError) throw new Error(retryError.message || 'Failed to update enrichment retry state');

    return null;
  }
}
