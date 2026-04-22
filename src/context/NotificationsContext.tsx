import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  subscribeNotifications,
  type NotificationItem,
  type NotificationPayload,
  type NotificationVariant,
} from '../lib/notifications'

type NotificationsContextValue = {
  notifications: NotificationItem[]
  unreadCount: number
  pushNotification: (payload: NotificationPayload) => void
  markAsRead: (id: string) => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null)

const variantStyles: Record<NotificationVariant, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-800',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  warning: 'border-orange-200 bg-orange-50 text-orange-800',
  error: 'border-rose-200 bg-rose-50 text-rose-800',
}

function buildNotification(payload: NotificationPayload): NotificationItem {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    title: payload.title,
    message: payload.message,
    variant: payload.variant ?? 'info',
    createdAt: new Date().toISOString(),
    read: false,
  }
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [toastQueue, setToastQueue] = useState<NotificationItem[]>([])

  const pushNotification = (payload: NotificationPayload) => {
    const next = buildNotification(payload)
    setNotifications((prev) => [next, ...prev])
    setToastQueue((prev) => [next, ...prev].slice(0, 4))

    window.setTimeout(() => {
      setToastQueue((prev) => prev.filter((item) => item.id !== next.id))
    }, 4200)
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
    )
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id))
    setToastQueue((prev) => prev.filter((item) => item.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
    setToastQueue([])
  }

  useEffect(() => subscribeNotifications(pushNotification), [])

  const unreadCount = notifications.filter((item) => !item.read).length

  const value = useMemo<NotificationsContextValue>(
    () => ({
      notifications,
      unreadCount,
      pushNotification,
      markAsRead,
      removeNotification,
      clearAll,
    }),
    [notifications, unreadCount],
  )

  return (
    <NotificationsContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed right-4 top-20 z-1100 flex w-[min(92vw,360px)] flex-col gap-2">
        {toastQueue.map((item) => (
          <article
            key={item.id}
            className={`pointer-events-auto rounded-xl border px-3 py-2 shadow-sm ${variantStyles[item.variant ?? 'info']}`}
          >
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="mt-0.5 text-xs">{item.message}</p>
          </article>
        ))}
      </div>
    </NotificationsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) {
    throw new Error('useNotifications debe usarse dentro de NotificationsProvider')
  }
  return ctx
}
