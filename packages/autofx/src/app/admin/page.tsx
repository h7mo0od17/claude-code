import { getAdminSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Users, CreditCard, TrendingUp, DollarSign, Activity } from "lucide-react"

export default async function AdminOverviewPage() {
  const session = await getAdminSession()
  if (!session) redirect("/admin/login")

  const [
    totalUsers,
    activeSubscriptions,
    totalRevenue,
    activeBrokerAccounts,
    recentActivity,
    pendingTickets,
  ] = await Promise.all([
    db.user.count(),
    db.subscription.count({ where: { status: "ACTIVE" } }),
    db.payment.aggregate({
      where: { status: "SUCCEEDED" },
      _sum: { amount: true },
    }),
    db.brokerAccount.count({ where: { status: "ACTIVE" } }),
    db.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { user: { select: { name: true, email: true } } },
    }),
    db.supportTicket.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] } } }),
  ])

  const stats = [
    { label: "Total Clients", value: totalUsers.toString(), icon: Users, color: "text-primary-400" },
    { label: "Active Subscriptions", value: activeSubscriptions.toString(), icon: CreditCard, color: "text-secondary-400" },
    { label: "Active Trading Accounts", value: activeBrokerAccounts.toString(), icon: TrendingUp, color: "text-emerald-400" },
    { label: "Total Revenue", value: formatCurrency(totalRevenue._sum.amount?.toNumber() ?? 0), icon: DollarSign, color: "text-yellow-400" },
    { label: "Pending Tickets", value: pendingTickets.toString(), icon: Activity, color: "text-orange-400" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Admin Overview</h1>
        <p className="text-gray-400 mt-1">Platform health and activity summary</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                  <p className="text-2xl font-black text-white">{s.value}</p>
                </div>
                <s.icon className={`w-8 h-8 ${s.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary-400" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between py-2 border-b border-autofx-dark-border last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-white">{log.action.replace(/_/g, " ")}</p>
                  <p className="text-xs text-gray-500">
                    {log.user?.name ?? log.user?.email ?? "System"} · {log.createdAt.toLocaleString()}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium ${
                    log.result === "SUCCESS" ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {log.result}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
