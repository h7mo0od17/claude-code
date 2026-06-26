import { redirect } from "next/navigation"
import { getAdminSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatCurrency } from "@/lib/utils"
import { CreditCard } from "lucide-react"

export default async function AdminSubscriptionsPage() {
  const session = await getAdminSession()
  if (!session) redirect("/admin/login")

  const subscriptions = await db.subscription.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      package: true,
    },
    take: 100,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Subscription Management</h1>
        <p className="text-gray-400 mt-1">{subscriptions.length} total subscriptions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary-400" />
            All Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-autofx-dark-border">
                  {["Client", "Package", "Status", "Start Date", "Next Billing", "Price"].map((h) => (
                    <th key={h} className="text-left text-xs text-gray-500 font-medium pb-3 pr-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="border-b border-autofx-dark-border/50 hover:bg-autofx-dark-card/50 transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <p className="font-medium text-white">{sub.user.name ?? "—"}</p>
                      <p className="text-xs text-gray-500">{sub.user.email}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={sub.package.tier.toLowerCase() as "bronze" | "silver" | "gold"}>
                        {sub.package.name}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge
                        variant={
                          sub.status === "ACTIVE"
                            ? "success"
                            : sub.status === "PAST_DUE" || sub.status === "SUSPENDED"
                            ? "danger"
                            : "warning"
                        }
                      >
                        {sub.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-gray-400 text-xs">
                      {sub.activatedAt ? formatDate(sub.activatedAt) : "—"}
                    </td>
                    <td className="py-3 pr-4 text-gray-400 text-xs">
                      {sub.currentPeriodEnd ? formatDate(sub.currentPeriodEnd) : "—"}
                    </td>
                    <td className="py-3 pr-4 font-medium text-white">
                      {formatCurrency(sub.package.monthlyPrice.toNumber())}/mo
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
