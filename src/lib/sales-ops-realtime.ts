import { supabase } from '@/lib/supabase';

export interface SalesOpsRealtimeHandlers {
  onNewLead?: (payload: any) => void;
  onLeadUpdate?: (payload: any) => void;
  onTaskUpdate?: (payload: any) => void;
  onStatusChange?: (payload: any) => void;
}

export function subscribeSalesOpsRealtime(handlers: SalesOpsRealtimeHandlers) {
  const channel = supabase.channel('sales-ops-live');

  channel.on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'leads' },
    (payload) => {
      handlers.onNewLead?.(payload);
    }
  );

  channel.on(
    'postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'leads' },
    (payload) => {
      handlers.onLeadUpdate?.(payload);
    }
  );

  channel.on(
    'postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'lead_tasks' },
    (payload) => {
      handlers.onTaskUpdate?.(payload);
    }
  );

  channel.on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'lead_history',
      filter: 'action_type=eq.status_changed',
    },
    (payload) => {
      handlers.onStatusChange?.(payload);
    }
  );

  channel.subscribe();
  return channel;
}

export function unsubscribeSalesOpsRealtime(channel: ReturnType<typeof supabase.channel>) {
  return supabase.removeChannel(channel);
}
