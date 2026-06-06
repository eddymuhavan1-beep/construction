"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Clipboard,
  Package,
  Users,
  Wrench,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  userRole: string;
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Projects",
      href: "/dashboard/projects",
      icon: Building2,
    },
    {
      label: "Site Diary",
      href: "/dashboard/diary",
      icon: Clipboard,
    },
    {
      label: "Materials",
      href: "/dashboard/materials",
      icon: Package,
    },
    {
      label: "Workforce",
      href: "/dashboard/workforce",
      icon: Users,
    },
    {
      label: "Equipment",
      href: "/dashboard/equipment",
      icon: Wrench,
    },
    {
      label: "Financial",
      href: "/dashboard/financial",
      icon: DollarSign,
    },
    {
      label: "Reports",
      href: "/dashboard/reports",
      icon: BarChart3,
    },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border overflow-y-auto">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
