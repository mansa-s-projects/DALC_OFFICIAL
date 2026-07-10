'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { Bell, Check, ExternalLink, Trash2 } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
} from '@/features/notifications/hooks/useNotifications'
import { NOTIFICATION_ICONS, NOTIFICATION_COLORS } from '@/features/notifications/types'
import type { Notification } from '@/features/notifications/types'

function timeAgo(date: string) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (s < 60) return 'Just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return format(new Date(date), 'MMM dd, yyyy')
}

function NotificationRow({
  n,
  userId,
  onRead,
  onDelete,
}: {
  n: Notification
  userId: string
  onRead: (id: string) => void
  onDelete: (id: string) => void
}) {
  const icon = NOTIFICATION_ICONS[n.type] ?? '🔔'
  const colorClass = NOTIFICATION_COLORS[n.priority]

  return (
    <div
      className={`flex gap-4 p-5 border-b border-white/5 transition-colors ${
        !n.is_read ? 'bg-[#C8A96E]/5' : 'hover:bg-white/[0.02]'
      }`}
    >
      <div
        className={`w-11 h-11 rounded-full flex items-center justify-center text-lg shrink-0 border ${colorClass}`}
      >
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <p className={`font-medium text-sm ${n.is_read ? 'text-gray-400' : 'text-white'}`}>
            {n.title}
          </p>
          <span className="text-xs text-gray-600 shrink-0">{timeAgo(n.created_at)}</span>
        </div>
        <p className="text-gray-500 text-sm mt-1">{n.message}</p>
        <div className="flex items-center gap-3 mt-3">
          {n.action_url && (
            <Link
              href={n.action_url}
              onClick={() => onRead(n.id)}
              className="flex items-center gap-1 text-xs text-[#C8A96E] hover:text-white transition"
            >
              View <ExternalLink className="w-3 h-3" />
            </Link>
          )}
          {!n.is_read && (
            <button
              onClick={() => onRead(n.id)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition"
            >
              <Check className="w-3 h-3" /> Mark read
            </button>
          )}
          <button
            onClick={() => onDelete(n.id)}
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-red-400 transition ml-auto"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {!n.is_read && (
        <div className="w-2 h-2 rounded-full bg-[#C8A96E] mt-2 shrink-0" />
      )}
    </div>
  )
}

export default function NotificationsPage() {
  const { session } = useAppStore()
  const userId = session?.user?.id

  const { data: notifications = [], isLoading } = useNotifications(userId)
  const markAsRead = useMarkAsRead()
  const markAllAsRead = useMarkAllAsRead()
  const deleteNotification = useDeleteNotification()

  const unread = notifications.filter(n => !n.is_read).length

  const handleRead = (id: string) => {
    if (userId) markAsRead.mutate({ notificationId: id, userId })
  }

  const handleDelete = (id: string) => {
    if (userId) deleteNotification.mutate({ notificationId: id, userId })
  }

  const handleMarkAll = () => {
    if (userId) markAllAsRead.mutate(userId)
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center">
        <div className="text-center">
          <Bell className="w-10 h-10 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-6">Sign in to see your notifications</p>
          <Link
            href="/auth/sign-in"
            className="bg-[#C8A96E] text-[#070707] font-semibold px-6 py-3 rounded-lg hover:bg-[#D4B886] transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#C8A96E]">Notifications</h1>
            {unread > 0 && (
              <p className="text-gray-400 text-sm mt-1">{unread} unread</p>
            )}
          </div>
          {unread > 0 && (
            <button
              onClick={handleMarkAll}
              disabled={markAllAsRead.isPending}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#C8A96E] transition disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="p-12 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#C8A96E] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-16 text-center">
              <Bell className="w-10 h-10 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">No notifications yet</p>
              <p className="text-gray-600 text-xs mt-1">
                Status updates and quote alerts will appear here
              </p>
            </div>
          ) : (
            notifications.map(n => (
              <NotificationRow
                key={n.id}
                n={n}
                userId={userId}
                onRead={handleRead}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <p className="text-center text-gray-600 text-xs mt-6">
            Showing last {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  )
}
