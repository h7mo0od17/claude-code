"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  User,
  CreditCard,
  Link2,
  BarChart3,
  Receipt,
  Bell,
  HelpCircle,
  LogOut,
  BookOpen,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/performance", icon: BarChart3, label: "Performance" },
  { href: "/dashboard/subscription", icon: CreditCard, label: "Subscription" },
  { href: "/dashboard/broker", icon: Link2, label: "Broker Account" },
  { href: "/dashboard/payments", icon: Receipt, label: "Payment History" },
  { href: "/dashboard/notifications", icon: Bell, label: "Notifications" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
  { href: "/dashboard/support", icon: HelpCircle, label: "Support" },
]

interface SidebarProps {
  user: {
    name: string | null
    email: string
    subscription?: { package?: { name: string; tier: string } | null } | null
  }
}

export function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/login"
  }

  return (
    <aside className="w-64 min-h-screen bg-autofx-dark-card border-r border-autofx-dark-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-autofx-dark-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-purple-blue flex items-center justify-center">
            <span className="text-white font-black text-sm">FX</span>
          </div>
          <span className="text-xl font-black gradient-text">AutoFX</span>
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-autofx-dark-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-purple-blue flex items-center justify-center text-white font-bold text-sm">
            {user.name?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.name ?? "User"}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
        {user.subscription?.package && (
          <div className="mt-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-600/20 text-primary-400 border border-primary-600/30">
              {user.subscription.package.name}
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-gradient-purple-blue text-white"
                      : "text-gray-400 hover:bg-autofx-dark hover:text-white"
                  )}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="mt-4 pt-4 border-t border-autofx-dark-border">
          <Link
            href="/dashboard/getting-started"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-autofx-dark hover:text-white transition-colors"
          >
            <BookOpen className="w-4 h-4 flex-shrink-0" />
            Getting Started
          </Link>
        </div>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-autofx-dark-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors w-full"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
