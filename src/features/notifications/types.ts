export type NotificationType = 
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'request_update'
  | 'message_received'
  | 'document_status'
  | 'payment_received'
  | 'reminder'
  | 'system';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  is_read: boolean;
  action_url?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  read_at?: string;
}

export interface CreateNotificationInput {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  action_url?: string;
  metadata?: Record<string, unknown>;
}

export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  booking_confirmed: '✓',
  booking_cancelled: '✕',
  request_update: '↻',
  message_received: '✉',
  document_status: '📄',
  payment_received: '💳',
  reminder: '⏰',
  system: '⚙',
};

export const NOTIFICATION_COLORS: Record<NotificationPriority, string> = {
  low: 'text-gray-400 border-gray-500/30 bg-gray-500/10',
  normal: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  high: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
  urgent: 'text-red-400 border-red-500/30 bg-red-500/10',
};
