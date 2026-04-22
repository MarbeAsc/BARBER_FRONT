export type NotificationVariant = 'info' | 'success' | 'warning' | 'error'

export type NotificationPayload = {
  title: string
  message: string
  variant?: NotificationVariant
}

export type NotificationItem = NotificationPayload & {
  id: string
  createdAt: string
  read: boolean
}

type Listener = (payload: NotificationPayload) => void

const listeners = new Set<Listener>()

export function subscribeNotifications(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function showNotification(payload: NotificationPayload) {
  listeners.forEach((listener) => listener(payload))
}
