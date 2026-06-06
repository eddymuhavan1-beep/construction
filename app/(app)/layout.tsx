import type React from "react"
import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/auth-helpers"
import { seedProject } from "@/app/actions/seed"
import { Sidebar } from "@/components/sidebar"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSessionUser()
  if (!user) redirect("/sign-in")

  // Ensure the project skeleton (phases, activities, materials) exists.
  await seedProject()

  return (
    <div className="flex min-h-svh bg-background">
      <Sidebar userName={user.name ?? "Administrator"} />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  )
}
