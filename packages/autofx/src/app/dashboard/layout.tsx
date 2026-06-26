import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { DashboardSidebar } from "@/components/dashboard/Sidebar"
import { DashboardTopbar } from "@/components/dashboard/Topbar"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect("/login")

  const user = await db.user.findUnique({
    where: { id: session.userId },
    include: {
      subscription: { include: { package: true } },
      brokerAccount: true,
      _count: { select: { notifications: { where: { isRead: false } } } },
    },
  })

  if (!user) redirect("/login")

  return (
    <div className="min-h-screen bg-autofx-dark flex">
      <DashboardSidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopbar user={user} unreadCount={user._count.notifications} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
