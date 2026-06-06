"use client"

import { useState, useTransition } from "react"
import type { PhaseWithActivities } from "@/app/actions/progress"
import {
  updateActivityProgress,
  addActivity,
  deleteActivity,
} from "@/app/actions/progress"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { ChevronDown, Plus, Trash2 } from "lucide-react"

function statusBadge(progress: number) {
  if (progress >= 100)
    return <Badge className="bg-chart-3 text-white hover:bg-chart-3">Complete</Badge>
  if (progress > 0)
    return <Badge className="bg-primary text-primary-foreground">In Progress</Badge>
  return <Badge variant="secondary">Not Started</Badge>
}

function ActivityControl({ activity }: { activity: PhaseWithActivities["activities"][number] }) {
  const [value, setValue] = useState(activity.progress)
  const [pending, startTransition] = useTransition()

  function commit(v: number) {
    setValue(v)
    startTransition(async () => {
      await updateActivityProgress(activity.id, v)
    })
  }

  return (
    <div className="flex flex-col gap-2 py-3 border-b border-border last:border-0">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {activity.floorLabel ? `${activity.floorLabel} — ` : ""}
            {activity.name}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm font-semibold tabular-nums w-10 text-right">
            {value}%
          </span>
          {statusBadge(value)}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={() =>
              startTransition(async () => {
                await deleteActivity(activity.id)
                toast.success("Activity removed")
              })
            }
            aria-label="Delete activity"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={value}
          disabled={pending}
          onChange={(e) => setValue(Number(e.target.value))}
          onMouseUp={(e) => commit(Number((e.target as HTMLInputElement).value))}
          onTouchEnd={(e) => commit(Number((e.target as HTMLInputElement).value))}
          onKeyUp={(e) => commit(Number((e.target as HTMLInputElement).value))}
          className="flex-1 accent-[var(--primary)] cursor-pointer"
          aria-label={`Progress for ${activity.name}`}
        />
        <div className="flex gap-1">
          {[0, 25, 50, 75, 100].map((q) => (
            <button
              key={q}
              onClick={() => commit(q)}
              className={cn(
                "h-6 w-8 rounded text-xs font-medium transition-colors",
                value === q
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent",
              )}
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function AddActivityDialog({ phaseId }: { phaseId: number }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [floor, setFloor] = useState("")
  const [weight, setWeight] = useState("1")
  const [pending, startTransition] = useTransition()

  function submit() {
    if (!name.trim()) {
      toast.error("Enter an activity name")
      return
    }
    startTransition(async () => {
      await addActivity({
        phaseId,
        name,
        floorLabel: floor,
        weight: Number(weight) || 1,
      })
      toast.success("Activity added")
      setName("")
      setFloor("")
      setWeight("1")
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Add activity
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add activity</DialogTitle>
          <DialogDescription>Add a tracked activity to this phase.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="act-name">Activity name</Label>
            <Input
              id="act-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Column casting"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="act-floor">Floor / area (optional)</Label>
              <Input
                id="act-floor"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                placeholder="e.g. 3rd Floor"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="act-weight">Weight</Label>
              <Input
                id="act-weight"
                type="number"
                min={1}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={pending}>
            {pending ? "Adding..." : "Add activity"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ProgressBoard({ phases }: { phases: PhaseWithActivities[] }) {
  const [openPhase, setOpenPhase] = useState<number | null>(
    phases.find((p) => p.completion < 100)?.id ?? phases[0]?.id ?? null,
  )

  return (
    <div className="flex flex-col gap-4">
      {phases.map((phase) => {
        const isOpen = openPhase === phase.id
        return (
          <Card key={phase.id} className="overflow-hidden p-0">
            <button
              className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-accent/40 transition-colors"
              onClick={() => setOpenPhase(isOpen ? null : phase.id)}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-sm font-bold tabular-nums">
                {phase.completion}%
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground truncate">{phase.name}</h3>
                  <Badge variant="outline" className="text-xs font-normal">
                    weight {phase.weight}
                  </Badge>
                </div>
                <Progress value={phase.completion} className="mt-2 h-2" />
              </div>
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform shrink-0",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            {isOpen && (
              <div className="border-t border-border px-5 py-2 bg-card">
                {phase.activities.map((a) => (
                  <ActivityControl key={a.id} activity={a} />
                ))}
                <div className="py-3">
                  <AddActivityDialog phaseId={phase.id} />
                </div>
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
