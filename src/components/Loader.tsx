import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigation } from 'react-router-dom'

/** Tiempo mínimo visible del loader para evitar parpadeo visual. */
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
 * Loader global único para transiciones de navegación.
 * Concentramos en un solo componente la lógica y la UI (estilo ANFORA).
 */
export function Loader() {
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

    if (prev === null) return
    if (prev === location.pathname) return

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
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="nav-loader-glow absolute -left-1/4 top-1/3 h-[55%] w-[70%] rounded-full bg-amber-300/15 blur-3xl" />
        <div className="nav-loader-glow absolute -right-1/4 bottom-1/4 h-[45%] w-[60%] rounded-full bg-amber-400/15 blur-3xl [animation-delay:-1.1s]" />
        <div className="absolute inset-0 bg-linear-to-b from-[#121216]/90 via-zinc-950/88 to-[#0a0a0c]/95" />
      </div>

      <div
        key={copy.title}
        className="nav-loader-pop relative z-10 flex max-w-[min(340px,90vw)] flex-col items-center gap-7 px-6 text-center"
      >
        <div className="relative flex h-24 w-24 items-center justify-center" aria-hidden>
          <span className="absolute inset-0 rounded-full border border-amber-400/25 motion-safe:animate-[ping_2.4s_cubic-bezier(0,0,0.2,1)_infinite]" />
          <span className="absolute inset-2 rounded-full border border-amber-300/20 motion-safe:animate-[ping_2.8s_cubic-bezier(0,0,0.2,1)_infinite] [animation-delay:0.25s]" />
          <span className="absolute inset-4 rounded-full bg-amber-500/10 blur-md motion-safe:animate-pulse" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-amber-400/40 border-t-amber-100 shadow-[0_0_24px_rgba(245,158,11,0.3)] motion-safe:animate-spin">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-100/90 shadow-[0_0_12px_rgba(254,243,199,0.9)]" />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-base font-semibold tracking-tight text-white sm:text-lg">{copy.title}</p>
          <p className="text-sm leading-relaxed text-amber-100/80 sm:text-[0.9375rem]">{copy.subtitle}</p>
          <p className="flex items-center justify-center gap-1 pt-1 text-xs font-medium text-amber-200/65">
            <span className="nav-loader-dot inline-block h-1 w-1 rounded-full bg-amber-200/90" />
            <span className="nav-loader-dot inline-block h-1 w-1 rounded-full bg-amber-200/90" />
            <span className="nav-loader-dot inline-block h-1 w-1 rounded-full bg-amber-200/90" />
          </p>
        </div>
      </div>
    </div>
  )
}
