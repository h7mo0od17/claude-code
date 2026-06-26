import { redirect } from "next/navigation"
import { getAdminSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { Package, CheckCircle2 } from "lucide-react"

export default async function AdminPackagesPage() {
  const session = await getAdminSession()
  if (!session) redirect("/admin/login")

  const packages = await db.package.findMany({
    orderBy: { monthlyPrice: "asc" },
    include: { _count: { select: { subscriptions: { where: { status: "ACTIVE" } } } } },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Package Management</h1>
        <p className="text-gray-400 mt-1">Manage subscription tiers and pricing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <Badge variant={pkg.tier.toLowerCase() as "bronze" | "silver" | "gold"}>{pkg.name}</Badge>
                <Badge variant={pkg.isActive ? "success" : "warning"}>
                  {pkg.isActive ? "Active" : "Inactive"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-black text-white">
                  {formatCurrency(pkg.monthlyPrice.toNumber())}
                  <span className="text-sm text-gray-500 font-normal">/mo</span>
                </p>
                <p className="text-sm text-primary-400 mt-1">
                  Min. {formatCurrency(pkg.minDeposit.toNumber())} deposit
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Features</p>
                <ul className="space-y-1.5">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-autofx-dark-border">
                <p className="text-sm text-gray-500">
                  Active subscribers:{" "}
                  <span className="font-semibold text-white">{pkg._count.subscriptions}</span>
                </p>
                {pkg.stripePriceId && (
                  <p className="text-xs text-gray-600 mt-1">Stripe: {pkg.stripePriceId}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
