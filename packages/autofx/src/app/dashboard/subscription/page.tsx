import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate, formatCurrency } from "@/lib/utils"
import { CreditCard, Calendar, RefreshCw } from "lucide-react"

export default async function SubscriptionPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const user = await db.user.findUnique({
    where: { id: session.userId },
    include: {
      subscription: { include: { package: true } },
      payments: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  })
  if (!user) redirect("/login")

  const sub = user.subscription

  if (!sub) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white">Subscription</h1>
          <p className="text-gray-400 mt-1">Manage your copy trading subscription</p>
        </div>
        <Card>
          <CardContent className="text-center py-12">
            <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-white mb-2">No Active Subscription</h2>
            <p className="text-gray-400 mb-6">Choose a package to start copy trading</p>
            <Link href="/pricing">
              <Button>View Packages</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusMap: Record<string, "success" | "warning" | "danger" | "default"> = {
    ACTIVE: "success",
    PENDING_PAYMENT: "warning",
    PAST_DUE: "danger",
    GRACE_PERIOD: "warning",
    CANCELLED: "danger",
    SUSPENDED: "danger",
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Subscription</h1>
        <p className="text-gray-400 mt-1">Manage your copy trading subscription</p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Current Plan
            <Badge variant={statusMap[sub.status] ?? "default"}>{sub.status.replace(/_/g, " ")}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">Package</p>
              <p className="text-lg font-bold text-white">{sub.package?.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Monthly Price</p>
              <p className="text-lg font-bold text-white">
                {sub.package?.monthlyPrice ? formatCurrency(sub.package.monthlyPrice.toNumber()) : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Start Date</p>
              <p className="text-sm font-medium text-white">
                {sub.activatedAt ? formatDate(sub.activatedAt) : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Current Period</p>
              <p className="text-sm font-medium text-white">
                {sub.currentPeriodStart ? formatDate(sub.currentPeriodStart) : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Next Billing Date</p>
              <p className="text-sm font-medium text-white">
                {sub.currentPeriodEnd ? formatDate(sub.currentPeriodEnd) : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Min. Deposit</p>
              <p className="text-sm font-medium text-white">
                {sub.package?.minDeposit ? formatCurrency(sub.package.minDeposit.toNumber()) : "—"}
              </p>
            </div>
          </div>

          {sub.status === "PAST_DUE" && sub.gracePeriodEnd && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">
                Your payment failed. Please update your payment method before{" "}
                <strong>{formatDate(sub.gracePeriodEnd)}</strong> to avoid service interruption.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-primary-400" />
            Billing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user.payments.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">No billing history yet</p>
          ) : (
            <div className="space-y-3">
              {user.payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between py-3 border-b border-autofx-dark-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-white">{payment.description ?? "Subscription"}</p>
                      <p className="text-xs text-gray-500">{formatDate(payment.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-white">{formatCurrency(payment.amount.toNumber())}</span>
                    <Badge
                      variant={payment.status === "SUCCEEDED" ? "success" : payment.status === "FAILED" ? "danger" : "warning"}
                    >
                      {payment.status}
                    </Badge>
                    {payment.invoiceUrl && (
                      <a
                        href={payment.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary-400 hover:underline"
                      >
                        Invoice
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
