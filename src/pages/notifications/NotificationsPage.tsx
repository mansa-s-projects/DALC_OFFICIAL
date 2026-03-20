'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Check, X, Clock, ExternalLink, Filter, Trash2 } from 'lucide-react';
import Navbar from '../../components/navigation/Navbar';
import Footer from '../../components/navigation/Footer';
import { useNotifications, useMarkAsRead, useMarkAllAsRead, useDeleteNotification } from '../../features/notifications/hooks/useNotifications';
import { useAppStore } from '../../store/useAppStore';
import type { Notification, NotificationType } from '../../features/notifications/types';
import { NOTIFICATION_ICONS, NOTIFICATION_COLORS } from '../../features/notifications/types';

type FilterType = 'all' | 'unread' | 'bookings' | 'requests' | 'system';

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'bookings', label: 'Bookings' },
  { value: 'requests', label: 'Requests' },
  { value: 'system', label: 'System' },
];

function NotificationItem({ 
  notification, 
  onRead, 
  onDelete 
}: { 
  notification: Notification; 
  onRead: () => void;
  onDelete: () => void;
}) {
  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const icon = NOTIFICATION_ICONS[notification.type] || '🔔';
  const colorClass = NOTIFICATION_COLORS[notification.priority];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-6 border-b border-white/5 hover:bg-white/5 transition-colors ${
        !notification.is_read ? 'bg-luxury-gold/5' : ''
      }`}
    >
      <div className="flex gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${colorClass}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className={`text-base font-medium ${notification.is_read ? 'text-gray-400' : 'text-white'}`}>
                {notification.title}
              </h4>
              <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
            </div>
            <button
              onClick={(e) => { e.preventDefault(); onDelete(); }}
              className="text-gray-500 hover:text-red-400 flex-shrink-0 p-1"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <Clock className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-xs text-gray-600">{timeAgo(notification.created_at)}</span>
            {notification.action_url && (
              <Link
                to={notification.action_url}
                onClick={onRead}
                className="flex items-center gap-1 text-xs text-luxury-gold hover:text-white ml-auto"
              >
                View <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      </div>
      {!notification.is_read && (
        <button
          onClick={(e) => { e.preventDefault(); onRead(); }}
          className="absolute bottom-4 right-4 text-xs text-luxury-gold hover:text-white flex items-center gap-1"
        >
          <Check className="w-3 h-3" />
          Mark as read
        </button>
      )}
    </motion.div>
  );
}

function groupByDate(notifications: Notification[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const groups: { [key: string]: Notification[] } = {
    'Today': [],
    'Yesterday': [],
    'Earlier': [],
  };
  
  notifications.forEach((notification) => {
    const notifDate = new Date(notification.created_at);
    notifDate.setHours(0, 0, 0, 0);
    
    if (notifDate.getTime() === today.getTime()) {
      groups['Today'].push(notification);
    } else if (notifDate.getTime() === yesterday.getTime()) {
      groups['Yesterday'].push(notification);
    } else {
      groups['Earlier'].push(notification);
    }
  });
  
  return groups;
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const { session } = useAppStore();
  const userId = session?.user?.id;
  
  const { data: notifications = [], isLoading } = useNotifications(userId);
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const deleteNotification = useDeleteNotification();

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.is_read;
    if (filter === 'bookings') return n.type.includes('booking');
    if (filter === 'requests') return n.type.includes('request');
    if (filter === 'system') return n.type === 'system' || n.type === 'message_received';
    return true;
  });

  const groupedNotifications = groupByDate(filteredNotifications);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAsRead = (notificationId: string) => {
    if (userId) {
      markAsRead.mutate({ notificationId, userId });
    }
  };

  const handleMarkAllAsRead = () => {
    if (userId) {
      markAllAsRead.mutate(userId);
    }
  };

  const handleDelete = (notificationId: string) => {
    if (userId) {
      deleteNotification.mutate({ notificationId, userId });
    }
  };

  return (
    <div className="min-h-screen bg-[#050607] text-white">
      <Navbar />
      
      <main className="pt-28 pb-16 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display text-white">Notifications</h1>
              <p className="text-gray-500 mt-1">
                {unreadCount > 0 
                  ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                  : 'All caught up!'
                }
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markAllAsRead.isPending}
                className="px-4 py-2 bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold text-sm rounded-lg hover:bg-luxury-gold/20 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Mark all read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === option.value
                    ? 'bg-luxury-gold text-luxury-black'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="bg-luxury-black/50 border border-white/10 rounded-xl overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-500 mt-4">Loading notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-12 text-center">
                <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No notifications yet</p>
                <p className="text-gray-600 text-sm mt-1">
                  {filter === 'all' 
                    ? 'You will see booking confirmations and request updates here'
                    : `No ${filter} notifications`
                  }
                </p>
              </div>
            ) : (
              Object.entries(groupedNotifications).map(([group, groupNotifications]) => {
                if (groupNotifications.length === 0) return null;
                return (
                  <div key={group}>
                    <div className="px-6 py-3 bg-white/5 border-b border-white/10">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{group}</span>
                    </div>
                    {groupNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onRead={() => handleMarkAsRead(notification.id)}
                        onDelete={() => handleDelete(notification.id)}
                      />
                    ))}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
