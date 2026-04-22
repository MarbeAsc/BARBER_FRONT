import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigation } from 'react-router-dom'
import { NavigationLoaderContent } from './NavigationLoaderContent'

/** Tiempo mínimo visible del panel (login y cambios de pantalla, incluso si el chunk ya está en caché). */
const MIN_VISIBLE_MS = 360

type LoaderCopy = {
  title: string
  subtitle: string
}

function pathToPanelLabel(pathname: string): string {
  const p = pathname === '' ? '/' : pathname
  if (p === '/') return 'Panel general'
  const map: Record<string, string> = {
    '/login': 'Inicio de sesión',
    '/tareas': 'Agenda',
    '/equipo': 'Barberos',
    '/informes': 'Informes',
    '/ajustes': 'Ajustes',
  }
  return map[p] ?? 'Pantalla'
}

function deriveCopy(prev: string | null, next: string): LoaderCopy {
  if (prev === '/login' && next !== '/login') {
    return {
      title: 'Iniciando sesión',
      subtitle: 'Preparando agenda, clientes y caja...',
    }
  }
  if (next === '/login' && prev !== null && prev !== '/login') {
    return {
      title: 'Cerrando sesión',
      subtitle: 'Cerrando tu sesión y protegiendo los datos...',
    }
  }
  const label = pathToPanelLabel(next)
  return {
    title: `Cargando ${label}`,
    subtitle: 'Organizando la información del sistema...',
  }
}

function defaultCopy(pathname: string): LoaderCopy {
  return deriveCopy(null, pathname)
}

/**
 * Pantalla de bloqueo tipo aplicación interna:
 * - Mientras React Router está en `loading` (loaders / rutas `lazy`).
 * - Tras cada cambio de `pathname`, aunque la navegación sea instantánea (módulo ya en caché).
 */
export function NavigationLoadingOverlay() {
  const navigation = useNavigation()
  const location = useLocation()

  const [fromRouter, setFromRouter] = useState(false)
  const [fromPathChange, setFromPathChange] = useState(false)
  const [copy, setCopy] = useState<LoaderCopy>(() => defaultCopy(location.pathname))

  const loadStartedAt = useRef<number | null>(null)
  const hideRouterTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hidePathTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevPathname = useRef<string | null>(null)

  useEffect(() => {
    if (navigation.state === 'loading') {
      if (hideRouterTimeout.current) {
        clearTimeout(hideRouterTimeout.current)
        hideRouterTimeout.current = null
      }
      loadStartedAt.current = performance.now()
      const nextPath = navigation.location?.pathname ?? location.pathname
      queueMicrotask(() => {
        setFromRouter(true)
        setCopy(deriveCopy(prevPathname.current, nextPath))
      })
      return
    }

    if (navigation.state !== 'idle' || loadStartedAt.current === null) {
      return
    }

    const elapsed = performance.now() - loadStartedAt.current
    const remainder = Math.max(0, MIN_VISIBLE_MS - elapsed)
    hideRouterTimeout.current = setTimeout(() => {
      setFromRouter(false)
      loadStartedAt.current = null
      hideRouterTimeout.current = null
    }, remainder)

    return () => {
      if (hideRouterTimeout.current) {
        clearTimeout(hideRouterTimeout.current)
        hideRouterTimeout.current = null
      }
    }
  }, [navigation.state, navigation.location?.pathname, location.pathname])

  useEffect(() => {
    const prev = prevPathname.current
    prevPathname.current = location.pathname

    if (prev === null) {
      return
    }
    if (prev === location.pathname) {
      return
    }

    if (hidePathTimeout.current) {
      clearTimeout(hidePathTimeout.current)
    }
    queueMicrotask(() => {
      setFromPathChange(true)
      setCopy(deriveCopy(prev, location.pathname))
    })
    hidePathTimeout.current = setTimeout(() => {
      setFromPathChange(false)
      hidePathTimeout.current = null
    }, MIN_VISIBLE_MS)

    return () => {
      if (hidePathTimeout.current) {
        clearTimeout(hidePathTimeout.current)
        hidePathTimeout.current = null
      }
    }
  }, [location.pathname])

  const visible = fromRouter || fromPathChange

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-1000 flex flex-col items-center justify-center bg-[#0b0b0e]/92 text-amber-50/95 backdrop-blur-xs"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={copy.title}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="nav-loader-glow absolute -left-1/4 top-1/3 h-[55%] w-[70%] rounded-full bg-amber-300/15 blur-3xl" />
        <div className="nav-loader-glow absolute -right-1/4 bottom-1/4 h-[45%] w-[60%] rounded-full bg-amber-400/15 blur-3xl [animation-delay:-1.1s]" />
        <div className="absolute inset-0 bg-linear-to-b from-[#121216]/90 via-zinc-950/88 to-[#0a0a0c]/95" />
      </div>

      <NavigationLoaderContent title={copy.title} subtitle={copy.subtitle} />
    </div>
  )
}
