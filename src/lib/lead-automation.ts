type SupabaseAdmin = any;
import { assignLeadOwner, createFollowUpTask } from './lead-commands';
import { processNotificationEvent } from './notification-engine';
import { enqueueWhatsAppJob } from './whatsapp-automation';

export type LeadIntentTier = 'hot' | 'warm' | 'cold';

export interface LeadRecord {
  id: string;
  created_at: string;
  phone?: string | null;
  session_id: string;
  source_page: string;
  source_section: string;
  cta_label: string;
  service_slug?: string | null;
  destination?: string | null;
  lead_score?: number | null;
  lead_temperature?: LeadIntentTier | null;
  last_scored_at?: string | null;
  last_automation_at?: string | null;
  automation_status?: string | null;
  assigned_to?: string | null;
  owner_id?: string | null;
  priority?: string | null;
  follow_up_state?: string | null;
  notifications_sent?: Record<string, unknown> | null;
  workflow_history?: Array<Record<string, unknown>> | null;
}

export interface EventRecord {
  id: string;
  created_at: string;
  event_name: string;
  page?: string | null;
  section?: string | null;
  cta_label?: string | null;
  metadata?: Record<string, unknown> | null;
  session_id: string;
  client_event_id?: string | null;
}

interface AutomationContext {
  lead: LeadRecord;
  events: EventRecord[];
  nowIso: string;
  previousScore: number;
  nextScore: number;
  previousTier: LeadIntentTier;
  nextTier: LeadIntentTier;
  scoreDelta: number;
  isNewLeadTrigger: boolean;
  hasLeadSubmitAfterWhatsApp: boolean;
  hasRepeatedHighIntentBurst: boolean;
  crossedScoreThreshold: boolean;
}

interface AutomationRule {
  id: string;
  shouldRun: (context: AutomationContext) => boolean;
  buildTriggerKey: (context: AutomationContext) => string;
  actions: AutomationActionName[];
}

type AutomationActionName =
  | 'send_internal_sales_alert'
  | 'assign_lead_to_salesperson'
  | 'mark_lead_urgent'
  | 'schedule_follow_up_task'
  | 'trigger_webhook';

const HOT_THRESHOLD = 80;
const WARM_THRESHOLD = 40;
const SCORE_THRESHOLD = 60;

const EVENT_WEIGHTS: Record<string, number> = {
  move_to_dubai_landing_start_move_click: 8,
  move_to_dubai_service_start_move_click: 8,
  move_to_dubai_landing_whatsapp_hero_click: 18,
  move_to_dubai_landing_whatsapp_contact_click: 16,
  move_to_dubai_landing_whatsapp_floating_click: 14,
  move_to_dubai_service_whatsapp_hero_click: 18,
  move_to_dubai_service_whatsapp_contact_click: 16,
  move_to_dubai_service_whatsapp_floating_click: 14,
  move_to_dubai_landing_lead_form_submit_success: 45,
  move_to_dubai_service_lead_form_submit_success: 45,
};

const ROUTING_RULES = [
  {
    id: 'team-a-relocation',
    match: (lead: LeadRecord) =>
      lead.source_page.startsWith('/move-to-dubai') &&
      (lead.service_slug === 'relocation-support' || lead.service_slug === 'visa-services'),
    owner: 'team_a',
  },
  {
    id: 'team-b-business',
    match: (lead: LeadRecord) => lead.service_slug === 'company-formation',
    owner: 'team_b',
  },
  {
    id: 'team-c-transport-luxury',
    match: (lead: LeadRecord) =>
      lead.source_page.includes('/transport') || lead.source_page.includes('/travel/transport'),
    owner: 'team_c',
  },
];

const AUTOMATION_RULES: AutomationRule[] = [
  {
    id: 'new_hot_lead',
    shouldRun: (context) => context.isNewLeadTrigger && context.nextTier === 'hot',
    buildTriggerKey: () => 'new_hot_lead',
    actions: [
      'send_internal_sales_alert',
      'assign_lead_to_salesperson',
      'mark_lead_urgent',
      'schedule_follow_up_task',
      'trigger_webhook',
    ],
  },
  {
    id: 'warm_to_hot_transition',
    shouldRun: (context) => context.previousTier === 'warm' && context.nextTier === 'hot',
    buildTriggerKey: () => 'warm_to_hot_transition',
    actions: [
      'send_internal_sales_alert',
      'assign_lead_to_salesperson',
      'mark_lead_urgent',
      'schedule_follow_up_task',
      'trigger_webhook',
    ],
  },
  {
    id: 'lead_form_after_whatsapp',
    shouldRun: (context) => context.hasLeadSubmitAfterWhatsApp,
    buildTriggerKey: (context) => {
      const submitEvent = context.events
        .slice()
        .reverse()
        .find((event) => event.event_name.includes('lead_form_submit_success'));
      return `lead_form_after_whatsapp_${submitEvent?.id ?? 'unknown'}`;
    },
    actions: ['send_internal_sales_alert', 'schedule_follow_up_task'],
  },
  {
    id: 'repeated_high_intent_burst',
    shouldRun: (context) => context.hasRepeatedHighIntentBurst,
    buildTriggerKey: () => `repeated_high_intent_${Math.floor(Date.now() / 600000)}`,
    actions: ['mark_lead_urgent', 'send_internal_sales_alert'],
  },
  {
    id: 'score_crossed_threshold',
    shouldRun: (context) => context.crossedScoreThreshold,
    buildTriggerKey: () => `score_crossed_${SCORE_THRESHOLD}`,
    actions: ['assign_lead_to_salesperson', 'send_internal_sales_alert', 'trigger_webhook'],
  },
];

function getTier(score: number): LeadIntentTier {
  if (score >= HOT_THRESHOLD) return 'hot';
  if (score >= WARM_THRESHOLD) return 'warm';
  return 'cold';
}

function getWeight(eventName: string): number {
  return EVENT_WEIGHTS[eventName] ?? 0;
}

function resolveOwner(lead: LeadRecord): string {
  const matched = ROUTING_RULES.find((rule) => rule.match(lead));
  return matched?.owner ?? 'default_sales_queue';
}

function appendHistory(
  previous: Array<Record<string, unknown>> | null | undefined,
  entry: Record<string, unknown>
) {
  const history = Array.isArray(previous) ? previous.slice() : [];
  history.push(entry);
  return history;
}

async function insertActionLog(
  supabaseAdmin: SupabaseAdmin,
  payload: {
    leadId: string;
    triggerName: string;
    triggerKey: string;
    actionName: AutomationActionName;
    status: 'executed' | 'skipped' | 'failed';
    details?: Record<string, unknown>;
  }
): Promise<boolean> {
  const { error } = await supabaseAdmin.from('lead_automations').insert({
    lead_id: payload.leadId,
    trigger_name: payload.triggerName,
    trigger_key: payload.triggerKey,
    action_name: payload.actionName,
    status: payload.status,
    details: payload.details || {},
    executed_at: new Date().toISOString(),
  });

  if (!error) return true;

  if (String(error.message || '').toLowerCase().includes('duplicate')) {
    return false;
  }

  throw error;
}

async function applyLeadPatch(
  supabaseAdmin: SupabaseAdmin,
  leadId: string,
  patch: Record<string, unknown>
) {
  const { error } = await supabaseAdmin
    .from('leads')
    .update({ ...patch, last_automation_at: new Date().toISOString() })
    .eq('id', leadId);

  if (error) throw error;
}

async function runAction(
  supabaseAdmin: SupabaseAdmin,
  context: AutomationContext,
  triggerName: string,
  triggerKey: string,
  actionName: AutomationActionName
) {
  const actionInserted = await insertActionLog(supabaseAdmin, {
    leadId: context.lead.id,
    triggerName,
    triggerKey,
    actionName,
    status: 'executed',
    details: {
      previous_score: context.previousScore,
      next_score: context.nextScore,
      previous_tier: context.previousTier,
      next_tier: context.nextTier,
    },
  });

  if (!actionInserted) return;

  const existingNotifications =
    (context.lead.notifications_sent as Record<string, unknown> | null) ?? {};
  // Always read from context.lead so sequential runAction calls see each other's appends
  const existingHistory = context.lead.workflow_history;

  const historyEntry: Record<string, unknown> = {
    timestamp: context.nowIso,
    trigger: triggerName,
    action: actionName,
  };

  if (actionName === 'send_internal_sales_alert') {
    const newHistory = appendHistory(existingHistory, { ...historyEntry, reason: 'intent_threshold_triggered' });
    await applyLeadPatch(supabaseAdmin, context.lead.id, {
      automation_status: 'alerted',
      notifications_sent: {
        ...existingNotifications,
        [`${triggerName}:${actionName}`]: context.nowIso,
      },
      workflow_history: newHistory,
    });
    (context.lead as LeadRecord).workflow_history = newHistory;
    return;
  }

  if (actionName === 'assign_lead_to_salesperson') {
    const owner = context.lead.owner_id || context.lead.assigned_to || resolveOwner(context.lead);
    await assignLeadOwner(
      {
        supabaseAdmin,
        actorId: 'automation-engine',
        reason: `automation:${triggerName}`,
        idempotencyKey: `${context.lead.id}:${triggerKey}:${actionName}:assign`,
      },
      {
        leadId: context.lead.id,
        ownerId: owner,
        metadata: { trigger: triggerName },
      }
    );

    const newHistory = appendHistory(existingHistory, { ...historyEntry, owner });
    await applyLeadPatch(supabaseAdmin, context.lead.id, {
      automation_status: 'assigned',
      workflow_history: newHistory,
    });
    (context.lead as LeadRecord).workflow_history = newHistory;
    return;
  }

  if (actionName === 'mark_lead_urgent') {
    const newHistory = appendHistory(existingHistory, historyEntry);
    await applyLeadPatch(supabaseAdmin, context.lead.id, {
      priority: 'urgent',
      follow_up_state: 'immediate',
      automation_status: 'urgent',
      workflow_history: newHistory,
    });
    (context.lead as LeadRecord).workflow_history = newHistory;
    return;
  }

  if (actionName === 'schedule_follow_up_task') {
    const dueMinutes = context.nextTier === 'hot' ? 15 : 120;
    const dueAt = new Date(Date.now() + dueMinutes * 60 * 1000).toISOString();

    await createFollowUpTask(
      {
        supabaseAdmin,
        actorId: 'automation-engine',
        reason: `automation:${triggerName}`,
        idempotencyKey: `${context.lead.id}:${triggerKey}:${actionName}:task`,
      },
      {
        leadId: context.lead.id,
        ownerId: context.lead.owner_id || context.lead.assigned_to || resolveOwner(context.lead),
        taskType: context.nextTier === 'hot' ? 'first_call' : 'whatsapp_follow_up',
        title:
          context.nextTier === 'hot'
            ? 'Immediate first contact for high-intent lead'
            : 'Follow up on warm relocation lead',
        dueAt,
        priority: context.nextTier === 'hot' ? 'urgent' : 'high',
        createdBy: 'automation-engine',
        idempotencyKey: `${context.lead.id}:${triggerKey}:${actionName}:task`,
      }
    );

    const newHistory = appendHistory(existingHistory, historyEntry);
    await applyLeadPatch(supabaseAdmin, context.lead.id, {
      follow_up_state: context.nextTier === 'hot' ? 'scheduled_15m' : 'scheduled_2h',
      next_follow_up_at: dueAt,
      workflow_history: newHistory,
    });
    (context.lead as LeadRecord).workflow_history = newHistory;
    return;
  }

  const webhookUrl = process.env.LEAD_AUTOMATION_WEBHOOK_URL;
  if (actionName === 'trigger_webhook' && webhookUrl) {
    const webhookResp = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lead_id: context.lead.id,
        trigger: triggerName,
        score: context.nextScore,
        tier: context.nextTier,
        assigned_to: context.lead.assigned_to || resolveOwner(context.lead),
      }),
    });
    if (!webhookResp.ok) {
      console.warn(`[lead-automation] Webhook responded ${webhookResp.status} for lead ${context.lead.id}`);
    }

    const newHistory = appendHistory(existingHistory, historyEntry);
    await applyLeadPatch(supabaseAdmin, context.lead.id, {
      workflow_history: newHistory,
    });
    (context.lead as LeadRecord).workflow_history = newHistory;
  }
}

export async function processLeadAutomation(input: {
  supabaseAdmin: SupabaseAdmin;
  lead: LeadRecord;
  events: EventRecord[];
  triggerSource: 'lead_created' | 'event_tracked';
}) {
  const { supabaseAdmin, lead, triggerSource } = input;
  const events = input.events.slice().sort((a, b) =>
    String(a.created_at).localeCompare(String(b.created_at))
  );

  const nowIso = new Date().toISOString();
  const previousScore = Math.max(0, Number(lead.lead_score ?? 0));
  const previousTier = getTier(previousScore);

  const newEvents = events.filter(
    (event) => !lead.last_scored_at || event.created_at > lead.last_scored_at
  );

  const scoreDelta = newEvents.reduce((total, event) => total + getWeight(event.event_name), 0);
  const nextScore = Math.min(100, previousScore + scoreDelta);
  const nextTier = getTier(nextScore);

  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;

  const eventsLast10Min = events.filter((event) => {
    const ts = Date.parse(event.created_at);
    return Number.isFinite(ts) && ts >= tenMinutesAgo;
  });

  const eventsLast30Min = events.filter((event) => {
    const ts = Date.parse(event.created_at);
    return Number.isFinite(ts) && ts >= thirtyMinutesAgo;
  });

  const hasLeadSubmitEvent = newEvents.some((event) =>
    event.event_name.includes('lead_form_submit_success')
  );
  const hasRecentWhatsappClick = eventsLast30Min.some((event) => event.event_name.includes('whatsapp'));

  const hasRepeatedHighIntentBurst =
    eventsLast10Min.filter((event) => getWeight(event.event_name) >= 14).length >= 3;

  const context: AutomationContext = {
    lead,
    events,
    nowIso,
    previousScore,
    nextScore,
    previousTier,
    nextTier,
    scoreDelta,
    isNewLeadTrigger: triggerSource === 'lead_created',
    hasLeadSubmitAfterWhatsApp: hasLeadSubmitEvent && hasRecentWhatsappClick,
    hasRepeatedHighIntentBurst,
    crossedScoreThreshold: previousScore < SCORE_THRESHOLD && nextScore >= SCORE_THRESHOLD,
  };

  await applyLeadPatch(supabaseAdmin, lead.id, {
    lead_score: nextScore,
    lead_temperature: nextTier,
    priority: nextTier === 'hot' ? 'high' : nextTier === 'warm' ? 'medium' : 'low',
    last_scored_at: nowIso,
  });

  if (triggerSource === 'lead_created' && nextTier === 'hot') {
    await processNotificationEvent(supabaseAdmin, {
      eventType: 'new_hot_lead_created',
      leadId: lead.id,
      ownerId: lead.owner_id || lead.assigned_to || null,
      triggerSource: 'automation.processLeadAutomation',
      dedupeContext: `${lead.id}:new-hot:${nowIso}`,
      payload: {
        previous_tier: previousTier,
        next_tier: nextTier,
        score: nextScore,
      },
    });

    await enqueueWhatsAppJob({
      supabaseAdmin,
      leadId: lead.id,
      triggerType: 'hot_lead_created',
      templateKey: 'hot_lead_created',
      recipientPhone: lead.phone || undefined,
      payload: {
        lead_id: lead.id,
        source_page: lead.source_page,
      },
      dedupeContext: `${lead.id}:new-hot:${nowIso}`,
    });
  }

  if (previousTier === 'warm' && nextTier === 'hot') {
    await processNotificationEvent(supabaseAdmin, {
      eventType: 'warm_lead_became_hot',
      leadId: lead.id,
      ownerId: lead.owner_id || lead.assigned_to || null,
      triggerSource: 'automation.processLeadAutomation',
      dedupeContext: `${lead.id}:warm-to-hot:${nowIso}`,
      payload: {
        previous_tier: previousTier,
        next_tier: nextTier,
        previous_score: previousScore,
        next_score: nextScore,
      },
    });

    await enqueueWhatsAppJob({
      supabaseAdmin,
      leadId: lead.id,
      triggerType: 'follow_up_reminder',
      templateKey: 'warm_to_hot_transition',
      recipientPhone: lead.phone || undefined,
      payload: {
        lead_id: lead.id,
        previous_tier: previousTier,
        next_tier: nextTier,
      },
      dedupeContext: `${lead.id}:warm-to-hot:${nowIso}`,
    });
  }

  for (const rule of AUTOMATION_RULES) {
    if (!rule.shouldRun(context)) continue;

    const triggerKey = rule.buildTriggerKey(context);
    for (const action of rule.actions) {
      await runAction(supabaseAdmin, context, rule.id, triggerKey, action);
    }
  }
}
