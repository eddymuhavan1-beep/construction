export function formatKES(value: number | string | null | undefined): string {
  const n = typeof value === "string" ? Number.parseFloat(value) : (value ?? 0)
  const safe = Number.isFinite(n) ? n : 0
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(safe)
}

export function formatNumber(value: number | string | null | undefined): string {
  const n = typeof value === "string" ? Number.parseFloat(value) : (value ?? 0)
  const safe = Number.isFinite(n) ? n : 0
  return new Intl.NumberFormat("en-KE", { maximumFractionDigits: 2 }).format(safe)
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—"
  const d = typeof value === "string" ? new Date(value) : value
  if (Number.isNaN(d.getTime())) return "—"
  return new Intl.DateTimeFormat("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d)
}

export function toNum(value: number | string | null | undefined): number {
  const n = typeof value === "string" ? Number.parseFloat(value) : (value ?? 0)
  return Number.isFinite(n) ? n : 0
}

export const todayISO = () => new Date().toISOString().slice(0, 10)
