import Link from "next/link"
import { getDashboardData, getRecentDiary } from "@/app/actions/dashboard"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { PhaseProgressChart, ExpenseCategoryChart } from "@/components/dashboard/charts"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatKES, formatDate } from "@/lib/format"
import {
  TrendingUp,
  Wallet,
  Users,
  Truck,
  Package,
  AlertTriangle,
  ArrowRight,
} from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const [data, recentDiary] = await Promise.all([
    getDashboardData(),
    getRecentDiary(4),
  ])

  return (
    <>
      <PageHeader
        title="Project Dashboard"
        description="10-storey + basement development — live command center."
      />
      <div className="px-4 md:px-8 py-6 flex flex-col gap-6">
        {/* Hero progress */}
        <Card className="p-6 bg-sidebar text-sidebar-foreground border-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-sidebar-foreground/70">Overall completion</p>
              <p className="text-5xl font-bold tracking-tight tabular-nums mt-1">
                {data.overall}%
              </p>
            </div>
            <Button asChild variant="secondary" className="gap-1.5">
              <Link href="/progress">
                Manage progress <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Progress value={data.overall} className="mt-4 h-3 bg-sidebar-accent" />
        </Card>

        {/* KPI grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total expenditure"
            value={formatKES(data.totalExpenses)}
            icon={Wallet}
            accent
          />
          <StatCard
            label="Material spend"
            value={formatKES(data.materialSpend)}
            hint={`${data.materialCount} materials tracked`}
            icon={Package}
          />
          <StatCard
            label="Workers present today"
            value={data.presentToday}
            hint={`${data.activeWorkers} active on payroll`}
            icon={Users}
          />
          <StatCard
            label="Equipment on site"
            value={data.equipmentCount}
            hint={`${data.equipmentInUse} in use`}
            icon={Truck}
          />
        </div>

        {/* Alerts */}
        {(data.lowStock > 0 || data.pendingProcurement > 0) && (
          <div className="grid gap-3 sm:grid-cols-2">
            {data.lowStock > 0 && (
              <Card className="p-4 flex items-center gap-3 border-l-4 border-l-destructive">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {data.lowStock} material{data.lowStock > 1 ? "s" : ""} below reorder level
                  </p>
                  <Link href="/materials" className="text-xs text-primary hover:underline">
                    Review stock →
                  </Link>
                </div>
              </Card>
            )}
            {data.pendingProcurement > 0 && (
              <Card className="p-4 flex items-center gap-3 border-l-4 border-l-chart-4">
                <Package className="h-5 w-5 text-chart-4 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {data.pendingProcurement} draft procurement request
                    {data.pendingProcurement > 1 ? "s" : ""}
                  </p>
                  <Link href="/materials" className="text-xs text-primary hover:underline">
                    Send to suppliers →
                  </Link>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          <PhaseProgressChart data={data.phases} />
          <ExpenseCategoryChart data={data.expenseByCategory} />
        </div>

        {/* Recent diary */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Recent site diary</h3>
            <Link href="/diary" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          {recentDiary.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No diary entries yet. Start logging daily site activity.
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {recentDiary.map((entry) => (
                <li key={entry.id} className="py-3 flex items-start gap-3">
                  <Badge variant="outline" className="shrink-0 mt-0.5">
                    {formatDate(entry.entryDate)}
                  </Badge>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {entry.workDone}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  )
}
