import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import type { Notification, CreateNotificationInput } from '../types';

// Fetch user's notifications
export function useNotifications(userId: string | undefined) {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: async (): Promise<Notification[]> => {
      if (!userId || !supabase) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!userId,
    staleTime: 30000, // 30 seconds
  });
}

// Fetch unread notification count
export function useUnreadCount(userId: string | undefined) {
  return useQuery({
    queryKey: ['notifications', 'unread-count', userId],
    queryFn: async (): Promise<number> => {
      if (!userId || !supabase) return 0;
      
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);
      
      if (error) {
        console.error('Error counting notifications:', error);
        return 0;
      }
      
      return count || 0;
    },
    enabled: !!userId,
  });
}

// Create a notification
export function useCreateNotification() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: CreateNotificationInput) => {
      if (!supabase) return { data: null, error: 'No supabase client' };
      
      const { data, error } = await supabase
        .from('notifications')
        .insert(input)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating notification:', error);
        throw error;
      }
      
      return { data, error: null };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notifications', variables.user_id] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count', variables.user_id] });
    },
  });
}

// Mark notification as read
export function useMarkAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ notificationId, userId }: { notificationId: string; userId: string }) => {
      if (!supabase) return { error: 'No supabase client' };
      
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId);
      
      if (error) {
        console.error('Error marking notification as read:', error);
        throw error;
      }
      
      return { error: null };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notifications', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count', variables.userId] });
    },
  });
}

// Mark all notifications as read
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      if (!supabase) return { error: 'No supabase client' };
      
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('is_read', false);
      
      if (error) {
        console.error('Error marking all notifications as read:', error);
        throw error;
      }
      
      return { error: null };
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count', userId] });
    },
  });
}

// Delete a notification
export function useDeleteNotification() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ notificationId, userId }: { notificationId: string; userId: string }) => {
      if (!supabase) return { error: 'No supabase client' };
      
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      
      if (error) {
        console.error('Error deleting notification:', error);
        throw error;
      }
      
      return { error: null };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notifications', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count', variables.userId] });
    },
  });
}
