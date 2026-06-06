"use server"

import { db } from "@/lib/db"
import { getUserId } from "@/lib/auth-helpers"
import {
  projectPhases,
  phaseActivities,
  materials,
} from "@/lib/db/schema"
import { eq } from "drizzle-orm"

// The 11 occupiable levels of the tower (basement counted in substructure).
const FLOORS = [
  "Ground Floor",
  "1st Floor",
  "2nd Floor",
  "3rd Floor",
  "4th Floor",
  "5th Floor",
  "6th Floor",
  "7th Floor",
  "8th Floor",
  "9th Floor",
  "10th Floor",
]

// Each phase: name, weight, and the activities that belong to it.
// For the superstructure we generate 4 structural activities per floor.
const PHASE_BLUEPRINT: {
  name: string
  weight: number
  activities: { name: string; floorLabel?: string; weight?: number }[]
}[] = [
  {
    name: "Substructure & Foundation",
    weight: 15,
    activities: [
      { name: "Site clearance & setting out" },
      { name: "Bulk excavation" },
      { name: "Basement raft & retaining walls" },
      { name: "Foundation columns & ground beams" },
      { name: "Basement slab & waterproofing" },
    ],
  },
  {
    name: "Superstructure (RC Frame)",
    weight: 30,
    activities: FLOORS.flatMap((floor) => [
      { name: "Columns", floorLabel: floor },
      { name: "Beams", floorLabel: floor },
      { name: "Suspended slab", floorLabel: floor },
      { name: "Staircase", floorLabel: floor },
    ]),
  },
  {
    name: "Masonry & Walling",
    weight: 15,
    activities: FLOORS.map((floor) => ({
      name: "Blockwork & partitions",
      floorLabel: floor,
    })),
  },
  {
    name: "MEP (Mechanical, Electrical & Plumbing)",
    weight: 15,
    activities: [
      { name: "Electrical conduits & wiring" },
      { name: "Plumbing & drainage" },
      { name: "Firefighting & sprinklers" },
      { name: "HVAC & ventilation" },
      { name: "Lift installation" },
    ],
  },
  {
    name: "Finishes",
    weight: 20,
    activities: [
      { name: "Plastering & screeding" },
      { name: "Tiling & flooring" },
      { name: "Ceiling works" },
      { name: "Doors, windows & glazing" },
      { name: "Painting & decoration" },
      { name: "Fittings & fixtures" },
    ],
  },
  {
    name: "External Works & Handover",
    weight: 5,
    activities: [
      { name: "Landscaping & paving" },
      { name: "Boundary wall & gates" },
      { name: "Drainage & soakaway" },
      { name: "Snagging & defects" },
      { name: "Final inspection & handover" },
    ],
  },
]

const STANDARD_MATERIALS: { name: string; unit: string; category: string }[] = [
  { name: "Portland Cement", unit: "bags", category: "Structural" },
  { name: "Ballast / Aggregate", unit: "tonnes", category: "Structural" },
  { name: "River Sand", unit: "tonnes", category: "Structural" },
  { name: "Reinforcement Steel (Y12)", unit: "tonnes", category: "Structural" },
  { name: "Reinforcement Steel (Y16)", unit: "tonnes", category: "Structural" },
  { name: "BRC Mesh", unit: "rolls", category: "Structural" },
  { name: "Machine-cut Stone (6 inch)", unit: "pcs", category: "Walling" },
  { name: "Hollow Blocks", unit: "pcs", category: "Walling" },
  { name: "Hoop Iron", unit: "rolls", category: "Walling" },
  { name: "Timber (Formwork)", unit: "pcs", category: "Formwork" },
  { name: "Plywood (Shuttering)", unit: "sheets", category: "Formwork" },
  { name: "Binding Wire", unit: "kg", category: "Structural" },
  { name: "Nails (assorted)", unit: "kg", category: "Formwork" },
  { name: "Waterproofing Membrane", unit: "rolls", category: "Finishes" },
  { name: "Floor Tiles", unit: "boxes", category: "Finishes" },
  { name: "Paint (Emulsion)", unit: "litres", category: "Finishes" },
  { name: "PVC Conduit", unit: "lengths", category: "MEP" },
  { name: "PPR Pipes", unit: "lengths", category: "MEP" },
  { name: "Electrical Cable", unit: "rolls", category: "MEP" },
]

export async function isProjectSeeded() {
  const userId = await getUserId()
  const existing = await db
    .select({ id: projectPhases.id })
    .from(projectPhases)
    .where(eq(projectPhases.userId, userId))
    .limit(1)
  return existing.length > 0
}

export async function seedProject() {
  const userId = await getUserId()

  // Idempotent: bail if phases already exist for this user.
  const existing = await db
    .select({ id: projectPhases.id })
    .from(projectPhases)
    .where(eq(projectPhases.userId, userId))
    .limit(1)
  if (existing.length > 0) return { seeded: false }

  for (let p = 0; p < PHASE_BLUEPRINT.length; p++) {
    const phase = PHASE_BLUEPRINT[p]
    const [inserted] = await db
      .insert(projectPhases)
      .values({
        userId,
        name: phase.name,
        weight: phase.weight,
        sortOrder: p,
      })
      .returning({ id: projectPhases.id })

    const rows = phase.activities.map((a, i) => ({
      userId,
      phaseId: inserted.id,
      name: a.name,
      floorLabel: a.floorLabel ?? null,
      weight: a.weight ?? 1,
      progress: 0,
      status: "not_started",
      sortOrder: i,
    }))
    if (rows.length > 0) {
      await db.insert(phaseActivities).values(rows)
    }
  }

  // Seed the standard material register.
  await db.insert(materials).values(
    STANDARD_MATERIALS.map((m) => ({
      userId,
      name: m.name,
      unit: m.unit,
      category: m.category,
      reorderLevel: "0",
    })),
  )

  return { seeded: true }
}
