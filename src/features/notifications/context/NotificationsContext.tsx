'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAppStore } from '../../../store/useAppStore';
import type { Notification } from '../types';

interface NotificationsContextType {
  isConnected: boolean;
}

const NotificationsContext = createContext<NotificationsContextType>({
  isConnected: false,
});

export function useNotificationsContext() {
  return useContext(NotificationsContext);
}

interface NotificationsProviderProps {
  children: ReactNode;
}

export function NotificationsProvider({ children }: NotificationsProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const { session } = useAppStore();
  const queryClient = useQueryClient();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId || !supabase) {
      setIsConnected(false);
      return;
    }

    // Subscribe to real-time notifications
    const channel = supabase
      .channel('user-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          
          // Invalidate queries to refetch notifications
          queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
          queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count', userId] });
          
          // Show a browser notification if permitted
          if (Notification.permission === 'granted') {
            new Notification(newNotification.title, {
              body: newNotification.message,
              icon: '/favicon.ico',
            });
          }
          
          console.info('📬 New notification:', newNotification.title, newNotification.message);
        }
      )
      .subscribe();

    setIsConnected(true);

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
      setIsConnected(false);
    };
  }, [userId, queryClient]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <NotificationsContext.Provider value={{ isConnected }}>
      {children}
    </NotificationsContext.Provider>
  );
}
