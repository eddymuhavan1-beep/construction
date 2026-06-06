import type React from "react"

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border bg-card px-4 md:px-8 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground text-balance">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1 text-pretty">{description}</p>
        )}
      </div>
      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  )
}
