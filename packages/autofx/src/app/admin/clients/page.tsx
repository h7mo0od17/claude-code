import { redirect } from "next/navigation"
import Link from "next/link"
import { getAdminSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { Users } from "lucide-react"

export default async function AdminClientsPage() {
  const session = await getAdminSession()
  if (!session) redirect("/admin/login")

  const clients = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      subscription: { include: { package: true } },
      brokerAccount: { select: { status: true } },
      _count: { select: { payments: true } },
    },
    take: 100,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Client Management</h1>
          <p className="text-gray-400 mt-1">{clients.length} registered clients</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary-400" />
            All Clients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-autofx-dark-border">
                  {["Client", "Email", "Package", "Sub Status", "Broker", "Joined", ""].map((h) => (
                    <th key={h} className="text-left text-xs text-gray-500 font-medium pb-3 pr-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-autofx-dark-border/50 hover:bg-autofx-dark-card/50 transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-purple-blue flex items-center justify-center text-white font-bold text-xs">
                          {client.name?.charAt(0).toUpperCase() ?? "U"}
                        </div>
                        <span className="font-medium text-white">{client.name ?? "—"}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-400">{client.email}</td>
                    <td className="py-3 pr-4">
                      {client.subscription?.package ? (
                        <Badge variant={client.subscription.package.tier.toLowerCase() as "bronze" | "silver" | "gold"}>
                          {client.subscription.package.name}
                        </Badge>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      {client.subscription ? (
                        <Badge
                          variant={
                            client.subscription.status === "ACTIVE"
                              ? "success"
                              : client.subscription.status === "PAST_DUE"
                              ? "danger"
                              : "warning"
                          }
                        >
                          {client.subscription.status.replace("_", " ")}
                        </Badge>
                      ) : (
                        <span className="text-gray-600">None</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      {client.brokerAccount ? (
                        <Badge
                          variant={client.brokerAccount.status === "ACTIVE" ? "success" : "warning"}
                        >
                          {client.brokerAccount.status.replace("_", " ")}
                        </Badge>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-gray-400 text-xs">{formatDate(client.createdAt)}</td>
                    <td className="py-3">
                      <Link
                        href={`/admin/clients/${client.id}`}
                        className="text-primary-400 hover:underline text-xs"
                      >
                        View →
                      </Link>
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
