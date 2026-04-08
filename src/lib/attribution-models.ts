import type { SupabaseAdmin } from './types/supabase-admin';

export async function getFirstTouchAttribution(supabaseAdmin: SupabaseAdmin) {
  const { data, error } = await supabaseAdmin.from('v_revenue_attribution_first_touch').select('*');
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getLastTouchAttribution(supabaseAdmin: SupabaseAdmin) {
  const { data, error } = await supabaseAdmin.from('v_revenue_attribution_last_touch').select('*');
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getMultiTouchAttribution(supabaseAdmin: SupabaseAdmin) {
  const { data, error } = await supabaseAdmin.from('v_revenue_attribution_multi_touch').select('*');
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getRevenueForecast(supabaseAdmin: SupabaseAdmin) {
  const { data, error } = await supabaseAdmin.from('v_revenue_forecast_simple').select('*').limit(1);
  if (error) throw new Error(error.message);
  return data?.[0] || null;
}
