import { useCallback, useEffect, useId, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import type { CSSProperties } from 'react'
import { useAuth } from '../context/AuthContext'
import { NavigationBar } from './NavigationBar'

const shellSurfaceStyle = {
  backgroundColor: '#fbfdfc',
  colorScheme: 'light',
  ['--text' as string]: '#6b6375',
  ['--text-h' as string]: '#08060d',
  ['--bg' as string]: '#ffffff',
  ['--border' as string]: '#e5e4e7',
  ['--accent' as string]: '#aa3bff',
  ['--accent-bg' as string]: 'rgba(170, 59, 255, 0.1)',
  ['--accent-border' as string]: 'rgba(170, 59, 255, 0.5)',
  ['--shadow' as string]:
    'rgba(0, 0, 0, 0.1) 0 10px 15px -3px, rgba(0, 0, 0, 0.05) 0 4px 6px -2px',
} as CSSProperties

export function AppShell() {
  const { username, logout } = useAuth()
  const location = useLocation()
  const menuId = useId()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    queueMicrotask(() => setMenuOpen(false))
  }, [location.pathname, location.key])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen, closeMenu])

  return (
    <div className="min-h-svh w-full min-w-0 bg-white" style={shellSurfaceStyle}>
      <NavigationBar
        menuId={menuId}
        menuOpen={menuOpen}
        userName={username?.username}
        userEmail={username?.email}
        userRole={username?.role}
        onToggleMenu={() => setMenuOpen((v) => !v)}
        onCloseMenu={closeMenu}
        onLogout={logout}
      />

      <Outlet />
    </div>
  )
}
