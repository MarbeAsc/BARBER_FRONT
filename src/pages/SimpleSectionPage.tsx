type SimpleSectionPageProps = {
  title: string
  description: string
}

export function SimpleSectionPage({ title, description }: SimpleSectionPageProps) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 text-[var(--text)] sm:px-6 lg:px-8 lg:py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-h)] sm:text-3xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed">{description}</p>
    </main>
  )
}
