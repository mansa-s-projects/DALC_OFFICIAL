import type { SupabaseAdmin } from './types/supabase-admin';
import { processNotificationEvent } from './notification-engine';
import { enqueueCrmSyncJob, mapLeadToCrmFields } from './crm-sync';

export type LeadStatus =
  | 'new'
  | 'assigned'
  | 'contacted'
  | 'qualified'
  | 'proposal_sent'
  | 'negotiation'
  | 'won'
  | 'lost'
  | 'unresponsive';

interface CommandContext {
  supabaseAdmin: SupabaseAdmin;
  actorId?: string;
  reason?: string;
  idempotencyKey?: string;
}

interface FollowUpTaskInput {
  leadId: string;
  ownerId?: string;
  taskType: 'first_call' | 'whatsapp_follow_up' | 'email_follow_up' | 'proposal_reminder' | 're_engagement_attempt';
  title: string;
  dueAt?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  createdBy?: string;
  idempotencyKey?: string;
}

const LEAD_STATUS_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  new: ['assigned', 'lost', 'unresponsive'],
  assigned: ['contacted', 'lost', 'unresponsive'],
  contacted: ['qualified', 'lost', 'unresponsive'],
  qualified: ['proposal_sent', 'lost', 'unresponsive'],
  proposal_sent: ['negotiation', 'won', 'lost', 'unresponsive'],
  negotiation: ['won', 'lost', 'unresponsive'],
  unresponsive: ['contacted', 'lost'],
  won: ['won'],
  lost: ['lost'],
};

function ensureTransition(currentStatus: LeadStatus, nextStatus: LeadStatus) {
  if (!LEAD_STATUS_TRANSITIONS[currentStatus]?.includes(nextStatus)) {
    throw new Error(`Invalid lead status transition: ${currentStatus} -> ${nextStatus}`);
  }
}

async function getLeadById(supabaseAdmin: SupabaseAdmin, leadId: string) {
  const { data, error } = await supabaseAdmin.from('leads').select('*').eq('id', leadId).single();
  if (error || !data) throw new Error(error?.message || 'Lead not found');
  return data;
}

async function writeLeadHistory(
  supabaseAdmin: SupabaseAdmin,
  payload: {
    leadId: string;
    actionType: string;
    actorId?: string;
    previousData?: Record<string, unknown>;
    nextData?: Record<string, unknown>;
    reason?: string;
    metadata?: Record<string, unknown>;
    idempotencyKey?: string;
  }
) {
  if (!payload.idempotencyKey) {
    const historyInsertPayload = {
      lead_id: payload.leadId,
      action_type: payload.actionType,
      actor_id: payload.actorId || null,
      previous_data: payload.previousData || null,
      next_data: payload.nextData || null,
      reason: payload.reason || null,
      metadata: payload.metadata || {},
    };
    await supabaseAdmin.from('lead_history').insert(historyInsertPayload).select('id');
    return;
  }

  const historyUpsertPayload = {
    lead_id: payload.leadId,
    action_type: payload.actionType,
    actor_id: payload.actorId || null,
    previous_data: payload.previousData || null,
    next_data: payload.nextData || null,
    reason: payload.reason || null,
    metadata: payload.metadata || {},
    idempotency_key: payload.idempotencyKey,
  };
  await supabaseAdmin
    .from('lead_history')
    .upsert(historyUpsertPayload, { onConflict: 'idempotency_key', ignoreDuplicates: true })
    .select('id');
}

async function updateSlaFlags(supabaseAdmin: SupabaseAdmin, leadId: string) {
  const lead = await getLeadById(supabaseAdmin, leadId);

  const createdAt = Date.parse(lead.created_at || '');
  const now = Date.now();
  const minutesSinceCreate = Number.isFinite(createdAt) ? (now - createdAt) / 60000 : 0;

  const hotNoContactBreach =
    lead.lead_temperature === 'hot' && !lead.last_contacted_at && minutesSinceCreate > 15;
  const assignedNoFollowUpBreach =
    lead.lead_status === 'assigned' && !lead.next_follow_up_at;

  const patch: Record<string, unknown> = {
    sla_first_contact_breached: hotNoContactBreach,
    sla_follow_up_breached: assignedNoFollowUpBreach,
  };

  if (hotNoContactBreach && !lead.sla_first_contact_breached_at) {
    patch.sla_first_contact_breached_at = new Date().toISOString();
  }

  if (assignedNoFollowUpBreach && !lead.sla_follow_up_breached_at) {
    patch.sla_follow_up_breached_at = new Date().toISOString();
  }

  const { error: slaError } = await supabaseAdmin
    .from('leads')
    .update(patch)
    .eq('id', leadId)
    .select('id');
  if (slaError) throw new Error(slaError.message || 'Failed to update lead SLA flags');

  if (hotNoContactBreach || assignedNoFollowUpBreach) {
    await processNotificationEvent(supabaseAdmin, {
      eventType: 'sla_breach',
      leadId,
      ownerId: lead.owner_id || null,
      triggerSource: 'command.updateSlaFlags',
      dedupeContext: `${leadId}:sla:${hotNoContactBreach ? 'first_contact' : ''}:${assignedNoFollowUpBreach ? 'follow_up' : ''}`,
      payload: {
        sla_first_contact_breached: hotNoContactBreach,
        sla_follow_up_breached: assignedNoFollowUpBreach,
      },
    });
  }

  const { data: overdueTasks } = await supabaseAdmin
    .from('lead_tasks')
    .select('id, due_at, owner_id, priority, status')
    .eq('lead_id', leadId)
    .neq('status', 'completed')
    .lt('due_at', new Date().toISOString())
    .limit(5);

  for (const task of overdueTasks || []) {
    await processNotificationEvent(supabaseAdmin, {
      eventType: 'overdue_follow_up_task',
      leadId,
      ownerId: task.owner_id || lead.owner_id || null,
      triggerSource: 'command.updateSlaFlags',
      dedupeContext: `${leadId}:task-overdue:${task.id}`,
      payload: {
        task_id: task.id,
        due_at: task.due_at,
        priority: task.priority,
      },
    });
  }
}

export async function assignLeadOwner(
  context: CommandContext,
  input: { leadId: string; ownerId: string; metadata?: Record<string, unknown> }
) {
  const lead = await getLeadById(context.supabaseAdmin, input.leadId);

  if (lead.owner_id === input.ownerId) return lead;

  const now = new Date().toISOString();
  const nextStatus = lead.lead_status === 'new' ? 'assigned' : lead.lead_status;

  if (lead.lead_status === 'new') {
    ensureTransition('new', 'assigned');
  }

  const ownerPatch = {
    owner_id: input.ownerId,
    assigned_to: input.ownerId,
    assigned_at: now,
    lead_status: nextStatus,
    status_updated_at: now,
  };
  const { data, error } = await context.supabaseAdmin
    .from('leads').update(ownerPatch)
    .eq('id', input.leadId)
    .select('*')
    .single();

  if (error || !data) throw new Error(error?.message || 'Failed to assign owner');

  const ownershipHistoryPayload = {
    lead_id: input.leadId,
    previous_owner_id: lead.owner_id || null,
    new_owner_id: input.ownerId,
    changed_by: context.actorId || null,
    reason: context.reason || 'owner_assignment',
    metadata: input.metadata || {},
  };
  await context.supabaseAdmin.from('lead_ownership_history').insert(ownershipHistoryPayload).select('id');

  await writeLeadHistory(context.supabaseAdmin, {
    leadId: input.leadId,
    actionType: 'owner_assigned',
    actorId: context.actorId,
    previousData: { owner_id: lead.owner_id || null, lead_status: lead.lead_status },
    nextData: { owner_id: data.owner_id, lead_status: data.lead_status },
    reason: context.reason,
    metadata: input.metadata,
    idempotencyKey: context.idempotencyKey,
  });

  await updateSlaFlags(context.supabaseAdmin, input.leadId);

  await processNotificationEvent(context.supabaseAdmin, {
    eventType: 'new_lead_assigned_to_owner',
    leadId: input.leadId,
    ownerId: input.ownerId,
    triggerSource: 'command.assignLeadOwner',
    dedupeContext: `${input.leadId}:${input.ownerId}:${now}`,
    payload: {
      previous_owner_id: lead.owner_id || null,
      new_owner_id: input.ownerId,
      status: data.lead_status,
    },
  });

  await enqueueCrmSyncJob({
    supabaseAdmin: context.supabaseAdmin,
    leadId: input.leadId,
    jobType: 'update',
    payload: mapLeadToCrmFields(data),
    dedupeContext: `${input.leadId}:assign:${now}`,
  });

  return data;
}

export async function reassignLead(
  context: CommandContext,
  input: { leadId: string; newOwnerId: string; metadata?: Record<string, unknown> }
) {
  return assignLeadOwner(context, {
    leadId: input.leadId,
    ownerId: input.newOwnerId,
    metadata: {
      ...(input.metadata || {}),
      reassigned: true,
    },
  });
}

export async function updateLeadStatus(
  context: CommandContext,
  input: {
    leadId: string;
    nextStatus: LeadStatus;
    metadata?: Record<string, unknown>;
    lastContactedAt?: string;
    nextFollowUpAt?: string | null;
  }
) {
  const lead = await getLeadById(context.supabaseAdmin, input.leadId);
  const current = lead.lead_status as LeadStatus;
  ensureTransition(current, input.nextStatus);

  const patch: Record<string, unknown> = {
    lead_status: input.nextStatus,
    status_updated_at: new Date().toISOString(),
  };

  if (input.lastContactedAt) {
    patch.last_contacted_at = input.lastContactedAt;
  }

  if (input.nextFollowUpAt !== undefined) {
    patch.next_follow_up_at = input.nextFollowUpAt;
  }

  if (input.nextStatus === 'won' || input.nextStatus === 'lost') {
    patch.closed_at = new Date().toISOString();
  }

  const { data, error } = await context.supabaseAdmin
    .from('leads').update(patch)
    .eq('id', input.leadId)
    .select('*')
    .single();

  if (error || !data) throw new Error(error?.message || 'Failed to update lead status');

  await writeLeadHistory(context.supabaseAdmin, {
    leadId: input.leadId,
    actionType: 'status_changed',
    actorId: context.actorId,
    previousData: { lead_status: lead.lead_status },
    nextData: { lead_status: data.lead_status },
    reason: context.reason,
    metadata: input.metadata,
    idempotencyKey: context.idempotencyKey,
  });

  await updateSlaFlags(context.supabaseAdmin, input.leadId);

  if (input.nextStatus === 'won') {
    await processNotificationEvent(context.supabaseAdmin, {
      eventType: 'lead_marked_won',
      leadId: input.leadId,
      ownerId: data.owner_id || null,
      triggerSource: 'command.updateLeadStatus',
      dedupeContext: `${input.leadId}:won:${data.status_updated_at}`,
      payload: {
        previous_status: lead.lead_status,
        next_status: data.lead_status,
      },
    });
  }

  if (input.nextStatus === 'lost') {
    await processNotificationEvent(context.supabaseAdmin, {
      eventType: 'lead_marked_lost',
      leadId: input.leadId,
      ownerId: data.owner_id || null,
      triggerSource: 'command.updateLeadStatus',
      dedupeContext: `${input.leadId}:lost:${data.status_updated_at}`,
      payload: {
        previous_status: lead.lead_status,
        next_status: data.lead_status,
      },
    });
  }

  if (input.nextStatus === 'unresponsive') {
    await processNotificationEvent(context.supabaseAdmin, {
      eventType: 'unresponsive_lead_detected',
      leadId: input.leadId,
      ownerId: data.owner_id || null,
      triggerSource: 'command.updateLeadStatus',
      dedupeContext: `${input.leadId}:unresponsive:${data.status_updated_at}`,
      payload: {
        previous_status: lead.lead_status,
        next_status: data.lead_status,
      },
    });
  }

  await enqueueCrmSyncJob({
    supabaseAdmin: context.supabaseAdmin,
    leadId: input.leadId,
    jobType: 'status_change',
    payload: {
      ...mapLeadToCrmFields(data),
      previous_status: lead.lead_status,
      next_status: data.lead_status,
    },
    dedupeContext: `${input.leadId}:status:${data.status_updated_at}`,
  });

  return data;
}

export async function createFollowUpTask(context: CommandContext, input: FollowUpTaskInput) {
  if (input.idempotencyKey) {
    const existing = await context.supabaseAdmin
      .from('lead_tasks')
      .select('*')
      .eq('idempotency_key', input.idempotencyKey)
      .maybeSingle();

    if (existing.data) return existing.data;
  }

  const payload = {
    lead_id: input.leadId,
    owner_id: input.ownerId || null,
    task_type: input.taskType,
    title: input.title,
    due_at: input.dueAt || null,
    status: 'open',
    priority: input.priority || 'medium',
    created_by: input.createdBy || context.actorId || null,
    idempotency_key: input.idempotencyKey || null,
  };

  const { data, error } = await context.supabaseAdmin
    .from('lead_tasks')
    .upsert(payload, { onConflict: 'idempotency_key', ignoreDuplicates: true })
    .select('*')
    .maybeSingle();

  if (error) throw new Error(error.message || 'Failed to create follow up task');

  const task =
    data ||
    (
      await context.supabaseAdmin
        .from('lead_tasks')
        .select('*')
        .eq('idempotency_key', input.idempotencyKey || '')
        .maybeSingle()
    ).data;

  const { error: followUpError } = await context.supabaseAdmin
    .from('leads')
    .update({ next_follow_up_at: input.dueAt || null })
    .eq('id', input.leadId)
    .select('id');
  if (followUpError) throw new Error(followUpError.message || 'Failed to update next follow up time');

  await writeLeadHistory(context.supabaseAdmin, {
    leadId: input.leadId,
    actionType: 'task_created',
    actorId: context.actorId,
    nextData: { task_type: input.taskType, due_at: input.dueAt || null },
    reason: context.reason,
    metadata: { task_id: task?.id || null },
    idempotencyKey: context.idempotencyKey,
  });

  await updateSlaFlags(context.supabaseAdmin, input.leadId);
  return task;
}

export async function completeFollowUpTask(
  context: CommandContext,
  input: { taskId: string; completionNote?: string; metadata?: Record<string, unknown> }
) {
  const { data: task, error: taskError } = await context.supabaseAdmin
    .from('lead_tasks')
    .select('*')
    .eq('id', input.taskId)
    .single();

  if (taskError || !task) throw new Error(taskError?.message || 'Task not found');
  if (task.status === 'completed') return task;

  const now = new Date().toISOString();

  const completedTaskPatch = {
    status: 'completed',
    completed_at: now,
    completion_note: input.completionNote || null,
  };
  const { data, error } = await context.supabaseAdmin
    .from('lead_tasks')
    .update(completedTaskPatch)
    .eq('id', input.taskId)
    .select('id, lead_id, status, completed_at, completion_note')
    .single();

  if (error || !data) throw new Error(error?.message || 'Failed to complete task');

  const lead = await getLeadById(context.supabaseAdmin, task.lead_id);

  const contactPatch = {
    last_contacted_at: now,
    follow_up_count: Math.max(0, Number(lead.follow_up_count || 0)) + 1,
  };
  const { error: contactError } = await context.supabaseAdmin
    .from('leads')
    .update(contactPatch)
    .eq('id', task.lead_id)
    .select('id');
  if (contactError) throw new Error(contactError.message || 'Failed to update lead contact markers');

  await writeLeadHistory(context.supabaseAdmin, {
    leadId: task.lead_id,
    actionType: 'task_completed',
    actorId: context.actorId,
    previousData: { task_status: task.status },
    nextData: { task_status: 'completed' },
    reason: context.reason,
    metadata: { task_id: task.id, ...(input.metadata || {}) },
    idempotencyKey: context.idempotencyKey,
  });

  await updateSlaFlags(context.supabaseAdmin, task.lead_id);
  return data;
}

export async function closeLeadAsWon(
  context: CommandContext,
  input: { leadId: string; wonValue: number; metadata?: Record<string, unknown> }
) {
  const lead = await updateLeadStatus(context, {
    leadId: input.leadId,
    nextStatus: 'won',
    metadata: input.metadata,
  });

  const { data, error } = await context.supabaseAdmin
    .from('leads').update({ won_value: input.wonValue, closed_at: new Date().toISOString() })
    .eq('id', input.leadId)
    .select('*')
    .single();

  if (error || !data) throw new Error(error?.message || 'Failed to close lead as won');

  await writeLeadHistory(context.supabaseAdmin, {
    leadId: input.leadId,
    actionType: 'lead_won',
    actorId: context.actorId,
    previousData: { lead_status: lead.lead_status },
    nextData: { lead_status: 'won', won_value: input.wonValue },
    reason: context.reason,
    metadata: input.metadata,
    idempotencyKey: context.idempotencyKey,
  });

  return data;
}

export async function closeLeadAsLost(
  context: CommandContext,
  input: { leadId: string; lostReason: string; metadata?: Record<string, unknown> }
) {
  const lead = await updateLeadStatus(context, {
    leadId: input.leadId,
    nextStatus: 'lost',
    metadata: input.metadata,
  });

  const { data, error } = await context.supabaseAdmin
    .from('leads').update({ lost_reason: input.lostReason, closed_at: new Date().toISOString() })
    .eq('id', input.leadId)
    .select('*')
    .single();

  if (error || !data) throw new Error(error?.message || 'Failed to close lead as lost');

  await writeLeadHistory(context.supabaseAdmin, {
    leadId: input.leadId,
    actionType: 'lead_lost',
    actorId: context.actorId,
    previousData: { lead_status: lead.lead_status },
    nextData: { lead_status: 'lost', lost_reason: input.lostReason },
    reason: context.reason,
    metadata: input.metadata,
    idempotencyKey: context.idempotencyKey,
  });

  return data;
}
