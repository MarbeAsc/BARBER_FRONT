import { NavLink } from 'react-router-dom'
import { inferRoleFromEmail, type UserRole } from '../lib/roles'

type NavItem = {
  to: string
  label: string
}

type NavigationBarProps = {
  menuId: string
  menuOpen: boolean
  userName?: string
  userEmail?: string
  onToggleMenu: () => void
  onCloseMenu: () => void
  onLogout: () => void
}

const navItemsByRole: Record<UserRole, NavItem[]> = {
  admin: [
    { to: '/', label: 'Panel general' },
    { to: '/servicios', label: 'Servicios' },
    { to: '/anadidos', label: 'Añadidos' },
    { to: '/perfumes', label: 'Perfumes' },
    { to: '/barberos', label: 'Barberos' },
  ],
  barbero: [
    { to: '/', label: 'Panel general' },
    { to: '/mis-citas', label: 'Mis citas' },
  ],
  cliente: [
    { to: '/', label: 'Panel general' },
    { to: '/mis-reservas', label: 'Reservar cita' },
  ],
}

function TasksBrandIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  )
}

function HamburgerIcon({ open }: { open: boolean }) {
  const bar =
    'h-0.5 w-6 rounded-full bg-amber-50/95 transition-transform duration-200 ease-out'
  return (
    <span className="flex h-5 w-6 flex-col justify-center gap-[5px]" aria-hidden>
      <span className={`${bar} ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
      <span className={`${bar} ${open ? 'scale-x-0 opacity-0' : ''}`} />
      <span className={`${bar} ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
    </span>
  )
}

export function NavigationBar({
  menuId,
  menuOpen,
  userName,
  userEmail,
  onToggleMenu,
  onCloseMenu,
  onLogout,
}: NavigationBarProps) {
  const role = inferRoleFromEmail(userEmail)
  const navItems = navItemsByRole[role]

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center gap-3 border-b border-amber-500/35 bg-linear-to-r from-[#121216] via-[#15151b] to-[#0f0f14] px-4 py-3 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_8px_28px_-12px_rgba(0,0,0,0.6)] sm:px-5">
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-transparent text-amber-50 outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-amber-300/50"
          onClick={onToggleMenu}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
        >
          <HamburgerIcon open={menuOpen} />
        </button>
        <span className="text-sm font-semibold tracking-tight text-amber-100/95">
        BarberShop
        </span>
        <div className="min-w-0 flex-1 text-right text-xs font-bold text-white sm:text-sm">
          <span className="hidden truncate rounded-full border border-amber-400/35 bg-amber-800/25 p-4 sm:inline">
            {userEmail}
          </span>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-lg border border-amber-400/40 bg-amber-800/25 px-3 py-1.5 text-sm font-semibold text-amber-50 transition hover:bg-amber-700/40"
          onClick={onLogout}
        >
          Cerrar sesión
        </button>
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
        className={`fixed left-0 top-0 z-50 flex h-full w-[min(280px,88vw)] flex-col border-r border-white/10 bg-zinc-950 pb-6 pt-17 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.55)] transition-transform duration-200 ease-out ${
          menuOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
        }`}
        aria-hidden={!menuOpen}
        inert={!menuOpen ? true : undefined}
      >
        <div className="flex flex-col items-center gap-2 px-3 pb-4 text-center">
          <TasksBrandIcon className="h-10 w-10 shrink-0 text-amber-300" />
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">BarberFlow Pro</h2>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 px-3" aria-label="Principal">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onCloseMenu}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-amber-400/20 text-amber-200' : 'text-zinc-200 hover:bg-zinc-800'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <p className="mt-auto border-t border-white/10 px-4 pt-4 text-xs text-zinc-400">
          Conectado como <span className="font-medium text-zinc-200">{userName}</span>
        </p>
      </aside>
    </>
  )
}
