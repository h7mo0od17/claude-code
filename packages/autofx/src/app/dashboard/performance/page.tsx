import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDatetime } from "@/lib/utils"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"

export default async function PerformancePage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const user = await db.user.findUnique({
    where: { id: session.userId },
    include: {
      brokerAccount: {
        include: {
          copiedTrades: {
            orderBy: { copiedAt: "desc" },
            take: 50,
          },
        },
      },
    },
  })
  if (!user) redirect("/login")

  const trades = user.brokerAccount?.copiedTrades ?? []
  const closedTrades = trades.filter((t) => t.status === "CLOSED")
  const openTrades = trades.filter((t) => t.status === "OPEN")

  const totalProfit = closedTrades.reduce((sum, t) => sum + (t.profit?.toNumber() ?? 0), 0)
  const winningTrades = closedTrades.filter((t) => (t.profit?.toNumber() ?? 0) > 0)
  const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0
  const avgProfit = closedTrades.length > 0 ? totalProfit / closedTrades.length : 0

  const stats = [
    { label: "Total Profit/Loss", value: formatCurrency(totalProfit), positive: totalProfit >= 0 },
    { label: "Total Trades", value: trades.length.toString(), neutral: true },
    { label: "Open Trades", value: openTrades.length.toString(), neutral: true },
    { label: "Win Rate", value: `${winRate.toFixed(1)}%`, positive: winRate >= 50 },
    { label: "Closed Trades", value: closedTrades.length.toString(), neutral: true },
    { label: "Avg. Trade P/L", value: formatCurrency(avgProfit), positive: avgProfit >= 0 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Performance</h1>
        <p className="text-gray-400 mt-1">Your copy trading performance overview</p>
      </div>

      {!user.brokerAccount ? (
        <Card>
          <CardContent className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-white mb-2">No Data Available</h2>
            <p className="text-gray-400">Connect your broker account to see performance data</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent>
                  <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                  <p
                    className={`text-2xl font-black ${
                      stat.neutral
                        ? "text-white"
                        : stat.positive
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trade History */}
          <Card>
            <CardHeader>
              <CardTitle>Trade History</CardTitle>
            </CardHeader>
            <CardContent>
              {trades.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No trades copied yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-autofx-dark-border">
                        {["Symbol", "Type", "Lot Size", "Open", "Close", "P/L", "Status"].map((h) => (
                          <th key={h} className="text-left text-xs text-gray-500 font-medium pb-3 pr-4">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {trades.map((trade) => {
                        const profit = trade.profit?.toNumber() ?? 0
                        return (
                          <tr
                            key={trade.id}
                            className="border-b border-autofx-dark-border/50 hover:bg-autofx-dark-card/50 transition-colors"
                          >
                            <td className="py-3 pr-4 font-medium text-white">{trade.symbol}</td>
                            <td className="py-3 pr-4">
                              <Badge variant={trade.type === "BUY" ? "success" : "danger"}>
                                {trade.type}
                              </Badge>
                            </td>
                            <td className="py-3 pr-4 text-gray-400">{trade.lotSize.toNumber().toFixed(2)}</td>
                            <td className="py-3 pr-4 text-gray-400">
                              {trade.openPrice ? Number(trade.openPrice).toFixed(5) : "—"}
                            </td>
                            <td className="py-3 pr-4 text-gray-400">
                              {trade.closePrice ? Number(trade.closePrice).toFixed(5) : "—"}
                            </td>
                            <td className={`py-3 pr-4 font-medium ${profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                              {trade.profit
                                ? (profit >= 0 ? "+" : "") + formatCurrency(profit)
                                : "—"}
                            </td>
                            <td className="py-3 pr-4">
                              <Badge
                                variant={
                                  trade.status === "CLOSED"
                                    ? "success"
                                    : trade.status === "OPEN"
                                    ? "secondary"
                                    : trade.status === "ERROR"
                                    ? "danger"
                                    : "default"
                                }
                              >
                                {trade.status}
                              </Badge>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
