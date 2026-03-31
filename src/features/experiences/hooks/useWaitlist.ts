import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';

export interface WaitlistEntry {
  id: string;
  user_id: string;
  experience_id: string;
  time_slot?: string;
  booking_date?: string;
  status: 'waiting' | 'notified' | 'booked' | 'expired';
  created_at: string;
}

export interface WaitlistInput {
  experience_id: string;
  user_id: string;
  time_slot?: string;
  booking_date?: string;
}

// Check if user is already on waitlist for an experience
export function useWaitlistStatus(experienceId: string | undefined, userId: string | undefined) {
  return useQuery({
    queryKey: ['waitlist-status', experienceId, userId],
    enabled: Boolean(experienceId && userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('waitlist_entries')
        .select('*')
        .eq('experience_id', experienceId)
        .eq('user_id', userId)
        .in('status', ['waiting', 'notified'])
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      return data as WaitlistEntry | null;
    },
  });
}

// Join waitlist
export function useJoinWaitlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: WaitlistInput) => {
      const { data, error } = await supabase
        .from('waitlist_entries')
        .insert({
          experience_id: input.experience_id,
          user_id: input.user_id,
          time_slot: input.time_slot,
          booking_date: input.booking_date,
          status: 'waiting',
        })
        .select()
        .single();

      if (error) throw error;
      return data as WaitlistEntry;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['waitlist-status', variables.experience_id, variables.user_id] });
    },
  });
}

// Leave waitlist
export function useLeaveWaitlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ entryId, experienceId, userId }: { entryId: string; experienceId: string; userId: string }) => {
      const { error } = await supabase
        .from('waitlist_entries')
        .update({ status: 'expired' })
        .eq('id', entryId);

      if (error) throw error;
      return { entryId, experienceId, userId };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['waitlist-status', variables.experienceId, variables.userId] });
    },
  });
}

// Admin: Get waitlist for an experience
export function useExperienceWaitlist(experienceId: string | undefined) {
  return useQuery({
    queryKey: ['experience-waitlist', experienceId],
    enabled: Boolean(experienceId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('waitlist_entries')
        .select(`
          *,
          user:profiles(id, first_name, last_name, email)
        `)
        .eq('experience_id', experienceId)
        .eq('status', 'waiting')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as (WaitlistEntry & { user: { id: string; first_name: string; last_name: string; email: string } })[];
    },
  });
}

// Admin: Notify waitlist users when spot opens
export function useNotifyWaitlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ entryIds, experienceId }: { entryIds: string[]; experienceId: string }) => {
      const { data, error } = await supabase
        .from('waitlist_entries')
        .update({ status: 'notified', notified_at: new Date().toISOString() })
        .in('id', entryIds)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['experience-waitlist', variables.experienceId] });
    },
  });
}
