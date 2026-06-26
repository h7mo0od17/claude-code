"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Package,
  Receipt,
  BarChart3,
  Bell,
  BookOpen,
  Video,
  Server,
  UserCog,
  LogOut,
  HelpCircle,
} from "lucide-react"

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/clients", icon: Users, label: "Clients" },
  { href: "/admin/subscriptions", icon: CreditCard, label: "Subscriptions" },
  { href: "/admin/packages", icon: Package, label: "Packages" },
  { href: "/admin/payments", icon: Receipt, label: "Payments" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/admin/brokers", icon: Server, label: "Broker Servers" },
  { href: "/admin/notifications", icon: Bell, label: "Notifications" },
  { href: "/admin/tutorials", icon: Video, label: "Tutorial Videos" },
  { href: "/admin/faq", icon: HelpCircle, label: "Help Center" },
  { href: "/admin/admins", icon: UserCog, label: "Administrators" },
]

interface AdminSidebarProps {
  role: string
}

export function AdminSidebar({ role }: AdminSidebarProps) {
  const pathname = usePathname()

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" })
    window.location.href = "/admin/login"
  }

  return (
    <aside className="w-64 min-h-screen bg-autofx-dark-card border-r border-autofx-dark-border flex flex-col">
      <div className="p-6 border-b border-autofx-dark-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-purple-blue flex items-center justify-center">
            <span className="text-white font-black text-sm">FX</span>
          </div>
          <div>
            <span className="text-lg font-black gradient-text">AutoFX</span>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-autofx-dark-border">
        <span className="text-xs font-medium text-primary-400 bg-primary-600/20 border border-primary-600/30 rounded-full px-2.5 py-0.5">
          {role.replace("_", " ")}
        </span>
      </div>

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
      </nav>

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
