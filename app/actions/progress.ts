"use server"

import { db } from "@/lib/db"
import { getUserId } from "@/lib/auth-helpers"
import { projectPhases, phaseActivities } from "@/lib/db/schema"
import { and, asc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export type ActivityRow = typeof phaseActivities.$inferSelect
export type PhaseRow = typeof projectPhases.$inferSelect

export type PhaseWithActivities = PhaseRow & {
  activities: ActivityRow[]
  completion: number
}

function statusFromProgress(p: number): string {
  if (p >= 100) return "complete"
  if (p > 0) return "in_progress"
  return "not_started"
}

export async function getProgressData(): Promise<PhaseWithActivities[]> {
  const userId = await getUserId()
  const phases = await db
    .select()
    .from(projectPhases)
    .where(eq(projectPhases.userId, userId))
    .orderBy(asc(projectPhases.sortOrder))

  const activities = await db
    .select()
    .from(phaseActivities)
    .where(eq(phaseActivities.userId, userId))
    .orderBy(asc(phaseActivities.sortOrder))

  return phases.map((phase) => {
    const acts = activities.filter((a) => a.phaseId === phase.id)
    const totalWeight = acts.reduce((s, a) => s + a.weight, 0) || 1
    const weighted = acts.reduce((s, a) => s + a.progress * a.weight, 0)
    const completion = Math.round(weighted / totalWeight)
    return { ...phase, activities: acts, completion }
  })
}

/** Overall project completion weighted by phase weight. */
export async function getOverallProgress(): Promise<number> {
  const phases = await getProgressData()
  const totalWeight = phases.reduce((s, p) => s + p.weight, 0) || 1
  const weighted = phases.reduce((s, p) => s + p.completion * p.weight, 0)
  return Math.round(weighted / totalWeight)
}

export async function updateActivityProgress(id: number, progress: number) {
  const userId = await getUserId()
  const clamped = Math.max(0, Math.min(100, Math.round(progress)))
  await db
    .update(phaseActivities)
    .set({
      progress: clamped,
      status: statusFromProgress(clamped),
      updatedAt: new Date(),
    })
    .where(and(eq(phaseActivities.id, id), eq(phaseActivities.userId, userId)))
  revalidatePath("/progress")
  revalidatePath("/")
}

export async function addActivity(input: {
  phaseId: number
  name: string
  floorLabel?: string
  weight?: number
}) {
  const userId = await getUserId()
  const name = input.name.trim()
  if (!name) return
  const existing = await db
    .select({ sortOrder: phaseActivities.sortOrder })
    .from(phaseActivities)
    .where(
      and(
        eq(phaseActivities.userId, userId),
        eq(phaseActivities.phaseId, input.phaseId),
      ),
    )
  const nextOrder = existing.length
  await db.insert(phaseActivities).values({
    userId,
    phaseId: input.phaseId,
    name,
    floorLabel: input.floorLabel?.trim() || null,
    weight: input.weight && input.weight > 0 ? input.weight : 1,
    progress: 0,
    status: "not_started",
    sortOrder: nextOrder,
  })
  revalidatePath("/progress")
  revalidatePath("/")
}

export async function deleteActivity(id: number) {
  const userId = await getUserId()
  await db
    .delete(phaseActivities)
    .where(and(eq(phaseActivities.id, id), eq(phaseActivities.userId, userId)))
  revalidatePath("/progress")
  revalidatePath("/")
}

export async function addPhase(name: string, weight: number) {
  const userId = await getUserId()
  const trimmed = name.trim()
  if (!trimmed) return
  const existing = await db
    .select({ id: projectPhases.id })
    .from(projectPhases)
    .where(eq(projectPhases.userId, userId))
  await db.insert(projectPhases).values({
    userId,
    name: trimmed,
    weight: weight > 0 ? weight : 1,
    sortOrder: existing.length,
  })
  revalidatePath("/progress")
}
