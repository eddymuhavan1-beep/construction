"use server"

import { db } from "@/lib/db"
import { getUserId } from "@/lib/auth-helpers"
import {
  expenses,
  workers,
  attendance,
  materials,
  materialReceipts,
  materialUsage,
  equipment,
  siteDiary,
  procurementRequests,
} from "@/lib/db/schema"
import { and, desc, eq, sql } from "drizzle-orm"
import { getOverallProgress, getProgressData } from "@/app/actions/progress"
import { toNum } from "@/lib/format"

export async function getDashboardData() {
  const userId = await getUserId()

  const [
    overall,
    phases,
    expenseRows,
    workerRows,
    todayAttendance,
    equipmentRows,
    diaryCount,
    pendingProcurement,
    materialRows,
    receiptRows,
    usageRows,
  ] = await Promise.all([
    getOverallProgress(),
    getProgressData(),
    db.select().from(expenses).where(eq(expenses.userId, userId)),
    db.select().from(workers).where(eq(workers.userId, userId)),
    db
      .select()
      .from(attendance)
      .where(
        and(
          eq(attendance.userId, userId),
          eq(attendance.workDate, new Date().toISOString().slice(0, 10)),
          eq(attendance.present, true),
        ),
      ),
    db.select().from(equipment).where(eq(equipment.userId, userId)),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(siteDiary)
      .where(eq(siteDiary.userId, userId)),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(procurementRequests)
      .where(
        and(
          eq(procurementRequests.userId, userId),
          eq(procurementRequests.status, "draft"),
        ),
      ),
    db.select().from(materials).where(eq(materials.userId, userId)),
    db.select().from(materialReceipts).where(eq(materialReceipts.userId, userId)),
    db.select().from(materialUsage).where(eq(materialUsage.userId, userId)),
  ])

  const totalExpenses = expenseRows.reduce((s, e) => s + toNum(e.amount), 0)
  const materialSpend = receiptRows.reduce(
    (s, r) => s + toNum(r.quantity) * toNum(r.unitCost),
    0,
  )

  // Low-stock count: remaining < reorder level (only where reorder level set).
  let lowStock = 0
  for (const m of materialRows) {
    const received = receiptRows
      .filter((r) => r.materialId === m.id)
      .reduce((s, r) => s + toNum(r.quantity), 0)
    const used = usageRows
      .filter((u) => u.materialId === m.id)
      .reduce((s, u) => s + toNum(u.quantity), 0)
    const remaining = received - used
    if (toNum(m.reorderLevel) > 0 && remaining < toNum(m.reorderLevel)) lowStock++
  }

  // Expenses grouped by category for the chart.
  const byCategory = new Map<string, number>()
  for (const e of expenseRows) {
    byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + toNum(e.amount))
  }
  const expenseByCategory = [...byCategory.entries()].map(([category, amount]) => ({
    category,
    amount,
  }))

  return {
    overall,
    phases: phases.map((p) => ({
      name: p.name,
      completion: p.completion,
      weight: p.weight,
    })),
    totalExpenses,
    materialSpend,
    activeWorkers: workerRows.filter((w) => w.active).length,
    presentToday: todayAttendance.length,
    equipmentCount: equipmentRows.length,
    equipmentInUse: equipmentRows.filter((e) => e.status === "in_use").length,
    diaryCount: diaryCount[0]?.count ?? 0,
    pendingProcurement: pendingProcurement[0]?.count ?? 0,
    lowStock,
    materialCount: materialRows.length,
    expenseByCategory,
  }
}

export async function getRecentDiary(limit = 5) {
  const userId = await getUserId()
  return db
    .select()
    .from(siteDiary)
    .where(eq(siteDiary.userId, userId))
    .orderBy(desc(siteDiary.entryDate))
    .limit(limit)
}
