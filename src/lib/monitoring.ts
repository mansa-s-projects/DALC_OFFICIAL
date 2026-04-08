import type { SupabaseAdmin } from './types/supabase-admin';

export async function recordSystemError(input: {
  supabaseAdmin: SupabaseAdmin;
  component: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  errorMessage: string;
  payload?: Record<string, unknown>;
}) {
  await input.supabaseAdmin.from('system_error_logs').insert({
    component: input.component,
    severity: input.severity,
    error_message: input.errorMessage,
    payload: input.payload || {},
  });
}

export async function recordApiFailure(input: {
  supabaseAdmin: SupabaseAdmin;
  route: string;
  method: string;
  statusCode?: number;
  errorMessage?: string;
  payload?: Record<string, unknown>;
}) {
  await input.supabaseAdmin.from('api_failure_logs').insert({
    route: input.route,
    method: input.method,
    status_code: input.statusCode || null,
    error_message: input.errorMessage || null,
    payload: input.payload || {},
  });
}

export async function recordQueueHealth(input: {
  supabaseAdmin: SupabaseAdmin;
  queueName: string;
  pendingCount: number;
  processingCount: number;
  failedCount: number;
  lagSeconds: number;
}) {
  await input.supabaseAdmin.from('queue_health_metrics').insert({
    queue_name: input.queueName,
    pending_count: input.pendingCount,
    processing_count: input.processingCount,
    failed_count: input.failedCount,
    lag_seconds: input.lagSeconds,
  });
}
