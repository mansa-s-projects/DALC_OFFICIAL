import { z } from 'zod';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { assignLeadOwner, createFollowUpTask, updateLeadStatus } from '@/lib/lead-commands';
import { enqueueWhatsAppJob } from '@/lib/whatsapp-automation';

export const commandCenterActionSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('assign_owner'),
    leadId: z.string().uuid(),
    ownerId: z.string().min(1),
  }),
  z.object({
    action: z.literal('send_whatsapp'),
    leadId: z.string().uuid(),
    templateKey: z.string().default('hot_lead_created'),
    triggerType: z.enum(['hot_lead_created', 'no_response_follow_up', 'follow_up_reminder']).default('follow_up_reminder'),
    recipientPhone: z.string().optional(),
  }),
  z.object({
    action: z.literal('create_follow_up'),
    leadId: z.string().uuid(),
    ownerId: z.string().optional(),
    title: z.string().min(1),
    dueAt: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).default('high'),
    taskType: z
      .enum(['first_call', 'whatsapp_follow_up', 'email_follow_up', 'proposal_reminder', 're_engagement_attempt'])
      .default('whatsapp_follow_up'),
  }),
  z.object({
    action: z.literal('mark_contacted'),
    leadId: z.string().uuid(),
  }),
  z.object({
    action: z.literal('schedule_next_step'),
    leadId: z.string().uuid(),
    nextFollowUpAt: z.string(),
    nextStatus: z
      .enum(['assigned', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'unresponsive'])
      .default('contacted'),
  }),
]);

export type CommandCenterActionInput = z.infer<typeof commandCenterActionSchema>;

export async function executeCommandCenterAction(input: CommandCenterActionInput) {
  const supabaseAdmin = getSupabaseAdminClient();
  const idempotencyBase = `${input.action}:${input.leadId}:${Date.now()}`;

  if (input.action === 'assign_owner') {
    return assignLeadOwner(
      {
        supabaseAdmin,
        actorId: 'command-center',
        reason: 'command_center.assign_owner',
        idempotencyKey: idempotencyBase,
      },
      {
        leadId: input.leadId,
        ownerId: input.ownerId,
      }
    );
  }

  if (input.action === 'send_whatsapp') {
    await enqueueWhatsAppJob({
      supabaseAdmin,
      leadId: input.leadId,
      triggerType: input.triggerType,
      templateKey: input.templateKey,
      recipientPhone: input.recipientPhone,
      payload: {
        lead_id: input.leadId,
        source: 'command_center',
      },
      dedupeContext: idempotencyBase,
    });

    return { queued: true };
  }

  if (input.action === 'create_follow_up') {
    return createFollowUpTask(
      {
        supabaseAdmin,
        actorId: 'command-center',
        reason: 'command_center.create_follow_up',
        idempotencyKey: idempotencyBase,
      },
      {
        leadId: input.leadId,
        ownerId: input.ownerId,
        title: input.title,
        dueAt: input.dueAt,
        priority: input.priority,
        taskType: input.taskType,
        createdBy: 'command-center',
        idempotencyKey: idempotencyBase,
      }
    );
  }

  if (input.action === 'mark_contacted') {
    return updateLeadStatus(
      {
        supabaseAdmin,
        actorId: 'command-center',
        reason: 'command_center.mark_contacted',
        idempotencyKey: idempotencyBase,
      },
      {
        leadId: input.leadId,
        nextStatus: 'contacted',
        lastContactedAt: new Date().toISOString(),
      }
    );
  }

  return updateLeadStatus(
    {
      supabaseAdmin,
      actorId: 'command-center',
      reason: 'command_center.schedule_next_step',
      idempotencyKey: idempotencyBase,
    },
    {
      leadId: input.leadId,
      nextStatus: input.nextStatus,
      nextFollowUpAt: input.nextFollowUpAt,
    }
  );
}
