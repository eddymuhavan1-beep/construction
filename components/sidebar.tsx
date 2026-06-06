"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  TrendingUp,
  NotebookPen,
  Package,
  Users,
  Truck,
  Wallet,
  FileBarChart,
  HardHat,
  LogOut,
  Menu,
  X,
} from "lucide-react"

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/diary", label: "Site Diary", icon: NotebookPen },
  { href: "/materials", label: "Materials", icon: Package },
  { href: "/workforce", label: "Workforce", icon: Users },
  { href: "/equipment", label: "Equipment", icon: Truck },
  { href: "/finances", label: "Finances", icon: Wallet },
  { href: "/reports", label: "Reports", icon: FileBarChart },
]

export function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/sign-in")
    router.refresh()
  }

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-sidebar text-sidebar-foreground px-4 h-14 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <HardHat className="h-5 w-5 text-sidebar-primary" />
          <span className="font-semibold tracking-tight">SiteControl</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      {open && (
        <button
          aria-label="Close menu overlay"
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed md:sticky top-0 z-50 md:z-0 h-svh w-64 shrink-0 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border transition-transform md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <HardHat className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="font-semibold tracking-tight">SiteControl</p>
            <p className="text-xs text-sidebar-foreground/60">Project Command</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="px-2 pb-2">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-sidebar-foreground/60">Site Administrator</p>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>
    </>
  )
}
