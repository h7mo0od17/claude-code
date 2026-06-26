import { redirect } from "next/navigation"
import { getAdminSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react"

export default async function AdminAnalyticsPage() {
  const session = await getAdminSession()
  if (!session) redirect("/admin/login")

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [
    newUsersThisMonth,
    newSubscriptionsThisMonth,
    revenueThisMonth,
    activeUsers,
    subscriptionsByPackage,
    recentPayments,
  ] = await Promise.all([
    db.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    db.subscription.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    db.payment.aggregate({
      where: { status: "SUCCEEDED", createdAt: { gte: thirtyDaysAgo } },
      _sum: { amount: true },
    }),
    db.user.count({ where: { subscription: { status: "ACTIVE" } } }),
    db.subscription.groupBy({
      by: ["packageId"],
      where: { status: "ACTIVE" },
      _count: { id: true },
    }),
    db.payment.findMany({
      where: { status: "SUCCEEDED" },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: { amount: true, createdAt: true },
    }),
  ])

  // Get package details for groupBy results
  const packages = await db.package.findMany({
    where: { id: { in: subscriptionsByPackage.map((s) => s.packageId) } },
    select: { id: true, name: true, tier: true },
  })

  const packageMap = Object.fromEntries(packages.map((p) => [p.id, p]))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Analytics</h1>
        <p className="text-gray-400 mt-1">Platform performance overview</p>
      </div>

      {/* 30-day metrics */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Last 30 Days</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "New Clients", value: newUsersThisMonth.toString(), icon: Users, color: "text-primary-400" },
            { label: "New Subscriptions", value: newSubscriptionsThisMonth.toString(), icon: TrendingUp, color: "text-secondary-400" },
            {
              label: "Revenue",
              value: formatCurrency(revenueThisMonth._sum.amount?.toNumber() ?? 0),
              icon: DollarSign,
              color: "text-emerald-400",
            },
            { label: "Active Clients", value: activeUsers.toString(), icon: BarChart3, color: "text-yellow-400" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-black text-white">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Subscriptions by package */}
      <Card>
        <CardHeader>
          <CardTitle>Active Subscriptions by Package</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptionsByPackage.map((item) => {
              const pkg = packageMap[item.packageId]
              const count = item._count.id
              const total = subscriptionsByPackage.reduce((s, i) => s + i._count.id, 0)
              const pct = total > 0 ? (count / total) * 100 : 0

              return (
                <div key={item.packageId}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-white">{pkg?.name ?? "Unknown"}</span>
                    <span className="text-sm text-gray-400">{count} clients</span>
                  </div>
                  <div className="h-2 bg-autofx-dark rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-purple-blue rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
            {subscriptionsByPackage.length === 0 && (
              <p className="text-gray-500 text-center py-4">No active subscriptions</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
