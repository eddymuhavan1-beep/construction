import { auth } from "@/lib/auth"
import { headers } from "next/headers"

/**
 * Resolve the current user id from the Better Auth session.
 * Every server action that touches user data MUST go through this helper —
 * it is the only thing standing between one user and another's rows.
 */
export async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

export async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user ?? null
}
