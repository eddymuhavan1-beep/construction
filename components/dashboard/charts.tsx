"use client"

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card } from "@/components/ui/card"
import { formatKES } from "@/lib/format"

const PIE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

export function PhaseProgressChart({
  data,
}: {
  data: { name: string; completion: number }[]
}) {
  return (
    <Card className="p-5">
      <h3 className="font-semibold text-foreground mb-4">Completion by phase</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 24 }}>
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            tick={{ fontSize: 11 }}
            tickFormatter={(v: string) => (v.length > 22 ? v.slice(0, 20) + "…" : v)}
          />
          <Tooltip
            cursor={{ fill: "var(--accent)" }}
            formatter={(v: number) => [`${v}%`, "Complete"]}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--popover)",
              color: "var(--popover-foreground)",
              fontSize: 12,
            }}
          />
          <Bar dataKey="completion" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

export function ExpenseCategoryChart({
  data,
}: {
  data: { category: string; amount: number }[]
}) {
  const total = data.reduce((s, d) => s + d.amount, 0)
  return (
    <Card className="p-5">
      <h3 className="font-semibold text-foreground mb-1">Spending by category</h3>
      <p className="text-sm text-muted-foreground mb-4">{formatKES(total)} total</p>
      {data.length === 0 ? (
        <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">
          No expenses recorded yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={95}
              innerRadius={55}
              paddingAngle={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v: number, n: string) => [formatKES(v), n]}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--popover)",
                color: "var(--popover-foreground)",
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
        {data.map((d, i) => (
          <div key={d.category} className="flex items-center gap-1.5 text-xs">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
            />
            <span className="text-muted-foreground capitalize">{d.category}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
