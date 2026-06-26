import { redirect } from "next/navigation"
import { getAdminSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { UserCog } from "lucide-react"

export default async function AdminAdminsPage() {
  const session = await getAdminSession()
  if (!session) redirect("/admin/login")

  if (session.role !== "SUPER_ADMIN") {
    redirect("/admin")
  }

  const admins = await db.admin.findMany({
    orderBy: { createdAt: "desc" },
  })

  const roleColors: Record<string, "default" | "success" | "warning" | "secondary" | "danger"> = {
    SUPER_ADMIN: "default",
    OPERATIONS_ADMIN: "secondary",
    CUSTOMER_SUPPORT: "success",
    FINANCE_ADMIN: "warning",
    READ_ONLY_ADMIN: "outline" as unknown as "default",
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Administrator Management</h1>
        <p className="text-gray-400 mt-1">Manage admin accounts and permissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="w-4 h-4 text-primary-400" />
            Administrators ({admins.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-autofx-dark-border">
                  {["Name", "Email", "Username", "Role", "Status", "Last Login"].map((h) => (
                    <th key={h} className="text-left text-xs text-gray-500 font-medium pb-3 pr-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="border-b border-autofx-dark-border/50 hover:bg-autofx-dark-card/50 transition-colors"
                  >
                    <td className="py-3 pr-4 font-medium text-white">{admin.fullName}</td>
                    <td className="py-3 pr-4 text-gray-400">{admin.email}</td>
                    <td className="py-3 pr-4 text-gray-400">@{admin.username}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={roleColors[admin.role] ?? "default"}>
                        {admin.role.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={admin.status === "ACTIVE" ? "success" : "danger"}>
                        {admin.status}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-gray-400 text-xs">
                      {admin.lastLoginAt ? formatDate(admin.lastLoginAt) : "Never"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
