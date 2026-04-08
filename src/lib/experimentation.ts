import type { SupabaseAdmin } from './types/supabase-admin';

function hashToUnitInterval(input: string) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }

  return (hash >>> 0) / 4294967295;
}

export async function assignExperimentVariant(input: {
  supabaseAdmin: SupabaseAdmin;
  experimentKey: string;
  sessionId: string;
}) {
  const dedupeKey = `${input.experimentKey}:${input.sessionId}`;

  const existing = await input.supabaseAdmin
    .from('experiment_assignments')
    .select('*')
    .eq('dedupe_key', dedupeKey)
    .maybeSingle();

  if (existing.data) return existing.data;

  const { data: experiment } = await input.supabaseAdmin
    .from('experiments')
    .select('*')
    .eq('experiment_key', input.experimentKey)
    .single();

  if (!experiment) {
    throw new Error('Experiment not found');
  }

  const allocation = (experiment.allocation || {}) as Record<string, number>;
  const variants = Object.entries(allocation);

  if (variants.length === 0) {
    throw new Error('Experiment allocation is empty');
  }

  const unit = hashToUnitInterval(dedupeKey);
  let cursor = 0;
  let selected = variants[0][0];

  for (const [variant, weight] of variants) {
    cursor += Number(weight || 0);
    if (unit <= cursor) {
      selected = variant;
      break;
    }
  }

  const { data } = await input.supabaseAdmin
    .from('experiment_assignments')
    .insert({
      experiment_key: input.experimentKey,
      session_id: input.sessionId,
      variant: selected,
      dedupe_key: dedupeKey,
    })
    .select('*')
    .single();

  return data;
}

export async function trackExperimentEvent(input: {
  supabaseAdmin: SupabaseAdmin;
  experimentKey: string;
  sessionId: string;
  variant: string;
  eventName: string;
  value?: number;
}) {
  await input.supabaseAdmin.from('experiment_events').insert({
    experiment_key: input.experimentKey,
    session_id: input.sessionId,
    variant: input.variant,
    event_name: input.eventName,
    value: input.value || null,
  });
}
