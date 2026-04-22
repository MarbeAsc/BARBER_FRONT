import type { ReactNode } from 'react'

type AdminSectionFrameProps = {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}

export function AdminSectionFrame({
  eyebrow,
  title,
  description,
  children,
}: AdminSectionFrameProps) {
  return (
    <main className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <header className="mb-6 rounded-2xl border border-amber-100 bg-linear-to-r from-amber-50/70 to-white px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700/90">
          {eyebrow}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">{description}</p>
      </header>

      {children}
    </main>
  )
}
