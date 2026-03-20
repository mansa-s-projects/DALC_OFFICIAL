'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, X, Clock, ExternalLink } from 'lucide-react';
import { useNotifications, useUnreadCount, useMarkAsRead, useMarkAllAsRead, useDeleteNotification } from '../../features/notifications/hooks/useNotifications';
import { useAppStore } from '../../store/useAppStore';
import type { Notification } from '../../features/notifications/types';
import { NOTIFICATION_ICONS, NOTIFICATION_COLORS } from '../../features/notifications/types';

function NotificationItem({ notification, onRead, onDelete }: { 
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
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className={`relative p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${
        !notification.is_read ? 'bg-luxury-gold/5' : ''
      }`}
    >
      <div className="flex gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${colorClass}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`text-sm font-medium truncate ${notification.is_read ? 'text-gray-400' : 'text-white'}`}>
              {notification.title}
            </h4>
            <button
              onClick={(e) => { e.preventDefault(); onDelete(); }}
              className="text-gray-500 hover:text-white/70 flex-shrink-0"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notification.message}</p>
          <div className="flex items-center gap-2 mt-2">
            <Clock className="w-3 h-3 text-gray-600" />
            <span className="text-[10px] text-gray-600">{timeAgo(notification.created_at)}</span>
            {notification.action_url && (
              <Link
                to={notification.action_url}
                onClick={onRead}
                className="flex items-center gap-1 text-[10px] text-luxury-gold hover:text-white ml-auto"
              >
                View <ExternalLink className="w-2.5 h-2.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
      {!notification.is_read && (
        <button
          onClick={(e) => { e.preventDefault(); onRead(); }}
          className="absolute bottom-2 right-2 text-[10px] text-luxury-gold hover:text-white opacity-0 hover:opacity-100 transition-opacity"
        >
          Mark read
        </button>
      )}
    </motion.div>
  );
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { session } = useAppStore();
  const userId = session?.user?.id;
  
  const { data: notifications = [], isLoading } = useNotifications(userId);
  const { data: unreadCount = 0 } = useUnreadCount(userId);
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const deleteNotification = useDeleteNotification();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-luxury-gold transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-luxury-gold text-black text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-luxury-black border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
              <h3 className="text-white font-medium">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={markAllAsRead.isPending}
                  className="text-xs text-luxury-gold hover:text-white disabled:opacity-50 flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="w-6 h-6 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRead={() => handleMarkAsRead(notification.id)}
                    onDelete={() => handleDelete(notification.id)}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-white/10 bg-white/5">
                <Link
                  to="/notifications"
                  onClick={() => setIsOpen(false)}
                  className="block text-center text-xs text-luxury-gold hover:text-white"
                >
                  View all notifications
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
