type NavigationLoaderContentProps = {
  title: string
  subtitle: string
}

export function NavigationLoaderContent({ title, subtitle }: NavigationLoaderContentProps) {
  return (
    <div
      key={title}
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
        <p className="text-base font-semibold tracking-tight text-white sm:text-lg">{title}</p>
        <p className="text-sm leading-relaxed text-amber-100/80 sm:text-[0.9375rem]">{subtitle}</p>
        <p className="flex items-center justify-center gap-1 pt-1 text-xs font-medium text-amber-200/65">
          <span className="nav-loader-dot inline-block h-1 w-1 rounded-full bg-amber-200/90" />
          <span className="nav-loader-dot inline-block h-1 w-1 rounded-full bg-amber-200/90" />
          <span className="nav-loader-dot inline-block h-1 w-1 rounded-full bg-amber-200/90" />
        </p>
      </div>
    </div>
  )
}
