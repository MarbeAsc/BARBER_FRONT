import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import type { IconType } from 'react-icons'
import {
  FaCalendarAlt,
  FaBars,
  FaChevronDown,
  FaCut,
  FaHome,
  FaPlusCircle,
  FaTag,
  FaSearch,
  FaSignOutAlt,
  FaSprayCan,
  FaUserCircle,
  FaUserTie,
  FaUsers,
  FaTimes,
} from 'react-icons/fa'
import { inferRoleFromEmail, type UserRole } from '../lib/roles'

type NavItem = {
  to: string
  label: string
  icon: IconType
}

type NavigationBarProps = {
  menuId: string
  menuOpen: boolean
  userName?: string
  userEmail?: string
  userRole?: UserRole
  onToggleMenu: () => void
  onCloseMenu: () => void
  onLogout: () => void
}

const navItemsByRole: Record<UserRole, NavItem[]> = {
    Administrador: [
    { to: '/', label: 'Panel general', icon: FaHome },
    { to: '/servicios', label: 'Servicios', icon: FaCut },
    { to: '/anadidos', label: 'Añadidos', icon: FaPlusCircle },
    { to: '/perfumes', label: 'Perfumes', icon: FaSprayCan },
    { to: '/promociones', label: 'Promociones', icon: FaTag },
    { to: '/barberos', label: 'Barberos', icon: FaUserTie },
    { to: '/usuarios', label: 'Usuarios', icon: FaUsers },
  ],
  Barbero: [
    { to: '/', label: 'Panel general', icon: FaHome },
    { to: '/mis-citas', label: 'Mis citas', icon: FaCalendarAlt },
  ],
  Cliente: [
    { to: '/', label: 'Panel general', icon: FaHome },
    { to: '/promociones-cliente', label: 'Promociones', icon: FaTag },
    { to: '/mis-reservas', label: 'Reservar cita', icon: FaCalendarAlt },
  ],
}

export function NavigationBar({
  menuId,
  menuOpen,
  userName,
  userEmail,
  userRole,
  onToggleMenu,
  onCloseMenu,
  onLogout,
}: NavigationBarProps) {
  const role = userRole ?? inferRoleFromEmail(userEmail)
  const navItems = navItemsByRole[role]
  const [profileOpen, setProfileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const profileRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!profileOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (!profileRef.current) return
      if (!profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setProfileOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [profileOpen])

  const roleLabel = role === 'Administrador' ? 'Administrador' : role === 'Barbero' ? 'Barbero' : 'Cliente'
  const filteredNavItems = navItems.filter((item) =>
    item.label.toLowerCase().includes(search.trim().toLowerCase()),
  )

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center gap-3 border-b border-cyan-300/24 bg-[linear-gradient(130deg,#081a36_0%,#0f2f63_52%,#0d3d69_100%)] px-4 py-3 shadow-[0_1px_0_rgba(186,230,253,0.08)_inset,0_12px_28px_-16px_rgba(2,6,23,0.68)] sm:px-5">
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-transparent text-blue-50 outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-blue-300/50"
          onClick={onToggleMenu}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
        >
          {menuOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
        </button>
        <span className="text-sm font-semibold tracking-tight text-blue-100/95">
        BarberShop
        </span>
        <div className="min-w-0 flex-1" />
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            className={`nav-profile-trigger inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-semibold text-blue-50 outline-none transition-all duration-200 ${
              profileOpen
                ? 'border-blue-200/70 bg-blue-600/50 shadow-[0_8px_24px_-14px_rgba(59,130,246,0.95)]'
                : 'border-blue-400/45 bg-blue-800/25 hover:border-blue-200/60 hover:bg-blue-700/40 hover:shadow-[0_8px_24px_-16px_rgba(59,130,246,0.75)]'
            } focus-visible:ring-2 focus-visible:ring-blue-300/65`}
            onClick={() => setProfileOpen((prev) => !prev)}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
          >
            <FaUserCircle className="h-5 w-5 text-blue-100/90" />
            <span className="max-w-[160px] truncate hidden sm:inline">{userEmail}</span>
            <span className="sm:hidden">Perfil</span>
            <FaChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen ? (
            <div
              className="nav-profile-dropdown absolute right-0 top-[calc(100%+10px)] z-70 w-72 rounded-2xl border border-cyan-200/30 bg-[linear-gradient(145deg,rgba(9,23,45,0.97)_0%,rgba(13,42,82,0.94)_55%,rgba(12,35,69,0.97)_100%)] p-2.5 shadow-[0_26px_48px_-24px_rgba(2,6,23,0.75)] backdrop-blur-sm"
              role="menu"
            >
              <div className="nav-profile-card rounded-xl border border-cyan-200/20 bg-[linear-gradient(140deg,rgba(255,255,255,0.13)_0%,rgba(255,255,255,0.07)_100%)] px-3 py-2.5">
                <p className="truncate text-[15px] font-semibold text-white">{userName ?? 'Usuario'}</p>
                <p className="mt-0.5 truncate text-xs text-blue-100/85">{userEmail}</p>
                <p className="nav-profile-role-chip mt-1.5 inline-flex rounded-full border border-blue-200/40 bg-blue-500/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-blue-100">
                  {roleLabel}
                </p>
              </div>
              <button
                type="button"
                className="nav-profile-logout mt-2 inline-flex w-full items-center gap-2 rounded-xl border border-white/70 bg-white px-3 py-2.5 text-left text-sm font-semibold text-slate-800 outline-none transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-300/70 hover:bg-rose-500 hover:text-white hover:shadow-[0_10px_20px_-18px_rgba(190,24,93,0.55)] focus-visible:ring-2 focus-visible:ring-rose-300/70"
                onClick={() => {
                  setProfileOpen(false)
                  onLogout()
                }}
                role="menuitem"
              >
                <FaSignOutAlt className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          ) : null}
        </div>
      </header>

      {menuOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 cursor-default bg-black/35 backdrop-blur-[1px]"
          aria-label="Cerrar menú"
          onClick={onCloseMenu}
        />
      ) : null}

      <aside
        id={menuId}
        className={`fixed left-0 top-0 z-50 flex h-full w-[min(280px,88vw)] flex-col border-r border-cyan-300/24 bg-[linear-gradient(130deg,#081a36_0%,#0f2f63_52%,#0d3d69_100%)] pb-6 pt-17 shadow-[4px_0_28px_-8px_rgba(2,6,23,0.68)] transition-transform duration-200 ease-out ${
          menuOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
        }`}
        aria-hidden={!menuOpen}
        inert={!menuOpen ? true : undefined}
      >
        <div className="flex flex-col items-center gap-2 px-3 pb-4 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-300/30 bg-blue-500/10 text-blue-300 shadow-[0_10px_30px_-18px_rgba(59,130,246,0.7)]">
            <FaCut className="h-6 w-6" />
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">BarberShop</h2>
        </div>
        <div className="px-3 pb-3">
          <label className="relative block" aria-label="Buscar en la aplicación">
            <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar opción..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/90 py-2 pl-9 pr-3 text-sm text-zinc-100 outline-none transition focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20"
            />
          </label>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 px-3" aria-label="Principal">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onCloseMenu}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-400/20 text-blue-200' : 'text-zinc-200 hover:bg-zinc-800'
                }`
              }
            >
              <span className="inline-flex items-center gap-2.5">
                <item.icon className="h-4 w-4" />
                {item.label}
              </span>
            </NavLink>
          ))}
          {filteredNavItems.length === 0 ? (
            <p className="rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-xs text-zinc-400">
              No se encontraron opciones para "{search}".
            </p>
          ) : null}
        </nav>
        <p className="mt-auto border-t border-white/10 px-4 pt-4 text-xs text-zinc-400">
          Conectado como <span className="font-medium text-zinc-200">{userName}</span>
        </p>
      </aside>
    </>
  )
}
