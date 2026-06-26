import { redirect } from "next/navigation"
import { getAdminSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatCurrency } from "@/lib/utils"
import { Receipt } from "lucide-react"

export default async function AdminPaymentsPage() {
  const session = await getAdminSession()
  if (!session) redirect("/admin/login")

  const payments = await db.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      subscription: { include: { package: { select: { name: true } } } },
    },
    take: 100,
  })

  const totalRevenue = payments
    .filter((p) => p.status === "SUCCEEDED")
    .reduce((sum, p) => sum + p.amount.toNumber(), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Payment Management</h1>
          <p className="text-gray-400 mt-1">{payments.length} total transactions</p>
        </div>
        <div className="glass-card text-right">
          <p className="text-xs text-gray-500">Total Revenue</p>
          <p className="text-2xl font-black gradient-text">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-primary-400" />
            All Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-autofx-dark-border">
                  {["Client", "Package", "Amount", "Status", "Invoice #", "Date"].map((h) => (
                    <th key={h} className="text-left text-xs text-gray-500 font-medium pb-3 pr-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-autofx-dark-border/50 hover:bg-autofx-dark-card/50 transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <p className="font-medium text-white">{payment.user.name ?? "—"}</p>
                      <p className="text-xs text-gray-500">{payment.user.email}</p>
                    </td>
                    <td className="py-3 pr-4 text-gray-400 text-xs">
                      {payment.subscription?.package?.name ?? "—"}
                    </td>
                    <td className="py-3 pr-4 font-medium text-white">
                      {formatCurrency(payment.amount.toNumber())}
                    </td>
                    <td className="py-3 pr-4">
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
                    </td>
                    <td className="py-3 pr-4 text-gray-400 text-xs">
                      {payment.invoiceNumber ?? "—"}
                    </td>
                    <td className="py-3 pr-4 text-gray-400 text-xs">{formatDate(payment.createdAt)}</td>
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
