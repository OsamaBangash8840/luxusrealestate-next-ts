'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Bell, CheckCheck, Sparkles, ShieldAlert, Clock, ArrowRight } from 'lucide-react'
import socket from '@/hooks/socket'
import { useAuth } from '@/app/hooks/useAuth'
import { Typography } from '@/app/components/common'
import { toast } from 'react-toastify'
import Link from 'next/link'

export interface INotificationItem {
  id: string
  title: string
  message: string
  type?: 'offer' | 'tour' | 'chat' | 'system'
  isRead: boolean
  createdAt: string
  link?: string
}

export const NotificationBell: React.FC = () => {
  const { isAuthenticated, token } = useAuth()
  const [notifications, setNotifications] = useState<INotificationItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const bellRef = useRef<HTMLDivElement>(null)

  // Listen to outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Socket connection for notifications
  useEffect(() => {
    if (!isAuthenticated) return

    if (!socket.connected) {
      if (token) {
        socket.auth = { token }
      }
      socket.connect()
    }

    const handleNewNotification = (data: any) => {
      const item: INotificationItem = {
        id: data._id || data.id || `notif-${Date.now()}`,
        title: data.title || 'New Notification',
        message: data.message || 'You have received a new property update.',
        type: data.type || 'offer',
        isRead: false,
        createdAt: data.createdAt || new Date().toISOString(),
        link: data.link || (data.propertyId ? `/properties/${data.propertyId}` : undefined),
      }

      setNotifications((prev) => [item, ...prev])
      toast.info(`🔔 ${item.title}: ${item.message}`, {
        autoClose: 5000,
      })
    }

    socket.on('newNotification', handleNewNotification)
    socket.on('newMessageNotification', handleNewNotification)

    return () => {
      socket.off('newNotification', handleNewNotification)
      socket.off('newMessageNotification', handleNewNotification)
    }
  }, [isAuthenticated, token])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAllRead = () => {
    notifications.forEach((n) => {
      if (!n.isRead) {
        socket.emit('markNotificationRead', { notificationId: n.id })
      }
    })
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const markSingleRead = (id: string) => {
    socket.emit('markNotificationRead', { notificationId: id })
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="relative" ref={bellRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-sm border border-border bg-card text-foreground hover:bg-muted transition-colors focus:outline-none"
        aria-label="View notifications"
      >
        <Bell className="h-4 w-4 text-body" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground ring-2 ring-background">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-sm border border-border bg-card shadow-xl z-50 text-xs overflow-hidden">
          {/* Header */}
          <div className="p-3.5 border-b border-border flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <Typography as="span" variant="extraSmallBold" className="font-semibold uppercase tracking-wider text-foreground">
                Notifications ({unreadCount} unread)
              </Typography>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-[11px] font-medium text-accent hover:underline flex items-center gap-1"
              >
                <CheckCheck className="h-3 w-3" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-border">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-body">
                <Bell className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                <Typography as="p" variant="smallRegular" className="text-xs">
                  You&apos;re all caught up! No new notifications.
                </Typography>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markSingleRead(notif.id)}
                  className={`p-3.5 transition-colors cursor-pointer hover:bg-muted/50 ${
                    !notif.isRead ? 'bg-accent/5' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <Typography as="span" variant="extraSmallBold" className="font-semibold text-foreground">
                      {notif.title}
                    </Typography>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <Typography as="p" variant="smallRegular" className="text-xs text-body leading-relaxed">
                    {notif.message}
                  </Typography>
                  {notif.link && (
                    <Link
                      href={notif.link}
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-1 text-[11px] text-accent hover:underline font-semibold mt-1.5"
                    >
                      <span>Review Details</span>
                      <ArrowRight className="h-2.5 w-2.5" />
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-border bg-muted/20 text-center">
            <Link
              href="/messages"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-semibold text-body hover:text-foreground uppercase tracking-wider"
            >
              Open Negotiation Console &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
