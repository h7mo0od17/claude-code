import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDatetime } from "@/lib/utils"
import { Bell, CheckCircle2 } from "lucide-react"

export default async function NotificationsPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const notifications = await db.notification.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  // Mark all as read
  await db.notification.updateMany({
    where: { userId: session.userId, isRead: false },
    data: { isRead: true },
  })

  const typeIcons: Record<string, string> = {
    PAYMENT_SUCCESS: "💳",
    PAYMENT_FAILED: "❌",
    SUBSCRIPTION_ACTIVATED: "🎉",
    SUBSCRIPTION_REJECTED: "⚠️",
    SUBSCRIPTION_RENEWED: "🔄",
    BROKER_CONNECTED: "🔗",
    BROKER_DISCONNECTED: "🔌",
    EMAIL_VERIFIED: "✅",
    SYSTEM_ANNOUNCEMENT: "📢",
    SUPPORT_REPLY: "💬",
    TRADE_COPIED: "📊",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Notifications</h1>
          <p className="text-gray-400 mt-1">Your account activity and updates</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary-400" />
            All Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-autofx-dark/50 border border-autofx-dark-border"
                >
                  <span className="text-xl flex-shrink-0">{typeIcons[n.type] ?? "🔔"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white">{n.title}</p>
                    <p className="text-sm text-gray-400 mt-0.5">{n.message}</p>
                    <p className="text-xs text-gray-600 mt-1">{formatDatetime(n.createdAt)}</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
