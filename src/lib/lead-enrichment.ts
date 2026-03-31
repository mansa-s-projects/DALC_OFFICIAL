type SupabaseAdmin = any;

export async function enqueueLeadEnrichmentJob(input: {
  supabaseAdmin: SupabaseAdmin;
  leadId: string;
  dedupeContext: string;
}) {
  const dedupeKey = `enrich:${input.leadId}:${input.dedupeContext}`;

  await input.supabaseAdmin.from('lead_enrichment_jobs').upsert(
    {
      lead_id: input.leadId,
      status: 'pending',
      dedupe_key: dedupeKey,
      next_attempt_at: new Date().toISOString(),
    },
    { onConflict: 'dedupe_key', ignoreDuplicates: true }
  );
}

export async function processNextLeadEnrichmentJob(supabaseAdmin: SupabaseAdmin) {
  const nowIso = new Date().toISOString();
  const { data: job } = await supabaseAdmin
    .from('lead_enrichment_jobs')
    .select('*')
    .in('status', ['pending', 'retry'])
    .lte('next_attempt_at', nowIso)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!job) return null;

  try {
    await supabaseAdmin.from('lead_enrichment_jobs').update({ status: 'processing' }).eq('id', job.id);

    const { data: lead } = await supabaseAdmin.from('leads').select('*').eq('id', job.lead_id).single();
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

    await supabaseAdmin.from('lead_enrichment_data').insert({
      lead_id: job.lead_id,
      provider: process.env.LEAD_ENRICHMENT_PROVIDER || 'internal',
      data: enrichmentPayload,
      confidence_score: Number(enrichmentPayload.confidence_score || 0),
    });

    await supabaseAdmin.from('lead_enrichment_jobs').update({
      status: 'completed',
      processed_at: new Date().toISOString(),
      last_error: null,
    }).eq('id', job.id);

    return job;
  } catch (error) {
    const attempts = Number(job.attempt_count || 0) + 1;
    const terminal = attempts >= 5;

    await supabaseAdmin.from('lead_enrichment_jobs').update({
      status: terminal ? 'failed' : 'retry',
      attempt_count: attempts,
      next_attempt_at: new Date(Date.now() + Math.min(60, Math.pow(2, attempts)) * 60000).toISOString(),
      last_error: error instanceof Error ? error.message : 'Lead enrichment failed',
    }).eq('id', job.id);

    return null;
  }
}
