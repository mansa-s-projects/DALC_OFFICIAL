import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { processNextCrmSyncJob, crmAdapters } from '@/lib/crm-sync';
import { processNextWhatsAppJob } from '@/lib/whatsapp-automation';
import { processNextLeadEnrichmentJob } from '@/lib/lead-enrichment';
import { recordQueueHealth, recordSystemError } from '@/lib/monitoring';

function isAuthorized(request: NextRequest) {
  const expected = process.env.WORKER_CRON_TOKEN;
  if (!expected) return false;
  const provided = request.headers.get('x-worker-token') || '';
  return expected === provided;
}

async function collectQueueStats(supabaseAdmin: any, table: string) {
  const [{ count: pendingCount }, { count: processingCount }, { count: failedCount }] = await Promise.all([
    supabaseAdmin.from(table).select('id', { count: 'exact', head: true }).in('status', ['pending', 'retry']),
    supabaseAdmin.from(table).select('id', { count: 'exact', head: true }).eq('status', 'processing'),
    supabaseAdmin.from(table).select('id', { count: 'exact', head: true }).eq('status', 'failed'),
  ]);

  const { data: oldestPending } = await supabaseAdmin
    .from(table)
    .select('created_at')
    .in('status', ['pending', 'retry'])
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  const lagSeconds = oldestPending?.created_at
    ? Math.max(0, Math.floor((Date.now() - Date.parse(oldestPending.created_at)) / 1000))
    : 0;

  return {
    pendingCount: Number(pendingCount || 0),
    processingCount: Number(processingCount || 0),
    failedCount: Number(failedCount || 0),
    lagSeconds,
  };
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseAdmin = getSupabaseAdminClient();

  try {
    const crmJob = await processNextCrmSyncJob({
      supabaseAdmin,
      adapter: crmAdapters.hubspot,
    });
    const whatsappJob = await processNextWhatsAppJob(supabaseAdmin);
    const enrichmentJob = await processNextLeadEnrichmentJob(supabaseAdmin);

    const crmStats = await collectQueueStats(supabaseAdmin, 'crm_sync_jobs');
    const whatsappStats = await collectQueueStats(supabaseAdmin, 'whatsapp_jobs');
    const enrichmentStats = await collectQueueStats(supabaseAdmin, 'lead_enrichment_jobs');

    await Promise.all([
      recordQueueHealth({
        supabaseAdmin,
        queueName: 'crm_sync_jobs',
        pendingCount: crmStats.pendingCount,
        processingCount: crmStats.processingCount,
        failedCount: crmStats.failedCount,
        lagSeconds: crmStats.lagSeconds,
      }),
      recordQueueHealth({
        supabaseAdmin,
        queueName: 'whatsapp_jobs',
        pendingCount: whatsappStats.pendingCount,
        processingCount: whatsappStats.processingCount,
        failedCount: whatsappStats.failedCount,
        lagSeconds: whatsappStats.lagSeconds,
      }),
      recordQueueHealth({
        supabaseAdmin,
        queueName: 'lead_enrichment_jobs',
        pendingCount: enrichmentStats.pendingCount,
        processingCount: enrichmentStats.processingCount,
        failedCount: enrichmentStats.failedCount,
        lagSeconds: enrichmentStats.lagSeconds,
      }),
    ]);

    return NextResponse.json({
      ok: true,
      processed: {
        crm_sync_jobs: crmJob?.id || null,
        whatsapp_jobs: whatsappJob?.id || null,
        lead_enrichment_jobs: enrichmentJob?.id || null,
      },
      queues: {
        crm_sync_jobs: crmStats,
        whatsapp_jobs: whatsappStats,
        lead_enrichment_jobs: enrichmentStats,
      },
    });
  } catch (error) {
    await recordSystemError({
      supabaseAdmin,
      component: 'sales-ops.worker.process-queues',
      severity: 'error',
      errorMessage: error instanceof Error ? error.message : 'Queue worker failure',
    });

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Queue worker failure',
      },
      { status: 500 }
    );
  }
}
