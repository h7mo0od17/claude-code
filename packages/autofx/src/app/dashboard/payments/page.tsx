import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatCurrency } from "@/lib/utils"
import { Receipt } from "lucide-react"

export default async function PaymentHistoryPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const payments = await db.payment.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    include: { subscription: { include: { package: { select: { name: true } } } } },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Payment History</h1>
        <p className="text-gray-400 mt-1">All your subscription payments and invoices</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-primary-400" />
            Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">No payments yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-autofx-dark/50 border border-autofx-dark-border"
                >
                  <div>
                    <p className="font-medium text-white">
                      {payment.subscription?.package?.name ?? "Subscription"} — {payment.description ?? "Payment"}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatDate(payment.createdAt)}
                      {payment.invoiceNumber && ` · ${payment.invoiceNumber}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-white">
                      {formatCurrency(payment.amount.toNumber())}
                    </span>
                    <Badge
                      variant={
                        payment.status === "SUCCEEDED"
                          ? "success"
                          : payment.status === "FAILED"
                          ? "danger"
                          : "warning"
                      }
                    >
                      {payment.status}
                    </Badge>
                    {payment.invoiceUrl && (
                      <a
                        href={payment.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-400 hover:underline"
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
