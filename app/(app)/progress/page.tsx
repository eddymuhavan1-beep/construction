import { getProgressData, getOverallProgress } from "@/app/actions/progress"
import { PageHeader } from "@/components/page-header"
import { ProgressBoard } from "@/components/progress/progress-board"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export const dynamic = "force-dynamic"

export default async function ProgressPage() {
  const [phases, overall] = await Promise.all([
    getProgressData(),
    getOverallProgress(),
  ])

  const completedPhases = phases.filter((p) => p.completion >= 100).length
  const inProgress = phases.filter((p) => p.completion > 0 && p.completion < 100).length

  return (
    <>
      <PageHeader
        title="Construction Progress"
        description="Track completion across every phase, floor and activity of the build."
      />
      <div className="px-4 md:px-8 py-6 flex flex-col gap-6 max-w-5xl">
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall project completion</p>
              <p className="text-4xl font-bold tracking-tight tabular-nums mt-1">
                {overall}%
              </p>
            </div>
            <div className="flex gap-6 text-sm">
              <div>
                <p className="text-2xl font-semibold tabular-nums">{completedPhases}</p>
                <p className="text-muted-foreground">Phases done</p>
              </div>
              <div>
                <p className="text-2xl font-semibold tabular-nums">{inProgress}</p>
                <p className="text-muted-foreground">In progress</p>
              </div>
              <div>
                <p className="text-2xl font-semibold tabular-nums">{phases.length}</p>
                <p className="text-muted-foreground">Total phases</p>
              </div>
            </div>
          </div>
          <Progress value={overall} className="mt-4 h-3" />
        </Card>

        <ProgressBoard phases={phases} />
      </div>
    </>
  )
}
