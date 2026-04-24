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
  info: 'border-blue-200/90 bg-linear-to-r from-blue-50 to-sky-50 text-blue-900',
  success: 'border-emerald-200/90 bg-linear-to-r from-emerald-50 to-teal-50 text-emerald-900',
  warning: 'border-amber-200/90 bg-linear-to-r from-amber-50 to-orange-50 text-amber-900',
  error: 'border-rose-200/90 bg-linear-to-r from-rose-50 to-pink-50 text-rose-900',
}

const variantAccentStyles: Record<NotificationVariant, string> = {
  info: 'bg-blue-600',
  success: 'bg-emerald-600',
  warning: 'bg-amber-500',
  error: 'bg-rose-600',
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

      <div className="pointer-events-none fixed bottom-4 left-4 z-1100 flex w-[min(94vw,420px)] flex-col gap-3">
        {toastQueue.map((item) => (
          <article
            key={item.id}
            className={`notification-toast pointer-events-auto relative overflow-hidden rounded-2xl border px-4 py-3 shadow-lg shadow-slate-900/10 ring-1 ring-white/70 ${variantStyles[item.variant ?? 'info']}`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`notification-toast-dot mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full ${variantAccentStyles[item.variant ?? 'info']}`}
              />
              <div>
                <p className="text-base font-bold tracking-tight">{item.title}</p>
                <p className="mt-1 text-sm leading-5 text-slate-700">{item.message}</p>
              </div>
            </div>
            <span className={`notification-toast-progress ${variantAccentStyles[item.variant ?? 'info']}`} />
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
