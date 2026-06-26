import { redirect } from "next/navigation"
import { getAdminSession } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin/Sidebar"
import { AdminTopbar } from "@/components/admin/Topbar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession()
  if (!session) redirect("/admin/login")

  return (
    <div className="min-h-screen bg-autofx-dark flex">
      <AdminSidebar role={session.role} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar email={session.email} role={session.role} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
