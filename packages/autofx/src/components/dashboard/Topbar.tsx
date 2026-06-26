"use client"

import Link from "next/link"
import { Bell } from "lucide-react"

interface TopbarProps {
  user: { name: string | null }
  unreadCount: number
}

export function DashboardTopbar({ user, unreadCount }: TopbarProps) {
  return (
    <header className="h-16 bg-autofx-dark-card border-b border-autofx-dark-border flex items-center justify-between px-6">
      <div>
        <p className="text-sm text-gray-400">
          Welcome back, <span className="font-semibold text-white">{user.name ?? "User"}</span>
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/dashboard/notifications" className="relative">
          <Bell className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
