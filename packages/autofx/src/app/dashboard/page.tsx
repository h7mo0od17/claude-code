import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  Link2,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertCircle,
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

const CHECKLIST_STEPS = [
  { key: "account", label: "Create AutoFX Account" },
  { key: "email", label: "Verify Email" },
  { key: "package", label: "Choose Package" },
  { key: "payment", label: "Complete Payment" },
  { key: "broker", label: "Connect Broker Account" },
  { key: "verified", label: "Account Verified" },
  { key: "active", label: "Copy Trading Activated" },
]

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const user = await db.user.findUnique({
    where: { id: session.userId },
    include: {
      subscription: { include: { package: true } },
      brokerAccount: true,
      _count: { select: { notifications: { where: { isRead: false } } } },
    },
  })

  if (!user) redirect("/login")

  const sub = user.subscription
  const broker = user.brokerAccount

  // Determine checklist state
  const checklistState = {
    account: true,
    email: !!user.emailVerified,
    package: !!sub,
    payment: sub?.status === "ACTIVE" || sub?.status === "PAST_DUE",
    broker: !!broker,
    verified: broker?.status === "VERIFIED" || broker?.status === "ACTIVE",
    active: broker?.status === "ACTIVE" && sub?.status === "ACTIVE",
  }

  const completedSteps = Object.values(checklistState).filter(Boolean).length
  const allComplete = completedSteps === CHECKLIST_STEPS.length

  // Stats
  const copiedTradesCount = broker
    ? await db.copiedTrade.count({ where: { brokerAccountId: broker.id } })
    : 0
  const openTradesCount = broker
    ? await db.copiedTrade.count({ where: { brokerAccountId: broker.id, status: "OPEN" } })
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Your copy trading overview</p>
      </div>

      {/* Alert: action needed */}
      {!allComplete && (
        <div className="glass-card border-primary-600/50 bg-primary-600/5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-white">Complete your setup</p>
              <p className="text-sm text-gray-400 mt-0.5">
                {!checklistState.email && "Please verify your email to continue. "}
                {checklistState.email && !checklistState.package && (
                  <Link href="/dashboard/subscription" className="text-primary-400 hover:underline">
                    Choose a subscription package →
                  </Link>
                )}
                {checklistState.package && checklistState.payment && !checklistState.broker && (
                  <Link href="/dashboard/broker" className="text-primary-400 hover:underline">
                    Connect your broker account →
                  </Link>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Trading Status</p>
                {sub?.status === "ACTIVE" && broker?.status === "ACTIVE" ? (
                  <Badge variant="success">Active</Badge>
                ) : (
                  <Badge variant="warning">Not Active</Badge>
                )}
              </div>
              <TrendingUp className="w-8 h-8 text-primary-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Trades Copied</p>
                <p className="text-2xl font-black text-white">{copiedTradesCount}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-secondary-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Open Trades</p>
                <p className="text-2xl font-black text-white">{openTradesCount}</p>
              </div>
              <Clock className="w-8 h-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Account Balance</p>
                <p className="text-2xl font-black text-white">
                  {broker?.balance ? formatCurrency(broker.balance.toNumber()) : "—"}
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Getting Started Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Getting Started
              <span className="text-sm font-normal text-gray-400">
                {completedSteps}/{CHECKLIST_STEPS.length} complete
              </span>
            </CardTitle>
            <div className="mt-2 h-2 bg-autofx-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-purple-blue rounded-full transition-all"
                style={{ width: `${(completedSteps / CHECKLIST_STEPS.length) * 100}%` }}
              />
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {CHECKLIST_STEPS.map((step) => {
                const done = checklistState[step.key as keyof typeof checklistState]
                return (
                  <li key={step.key} className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        done
                          ? "bg-emerald-500/20"
                          : "border border-autofx-dark-border"
                      }`}
                    >
                      {done && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <span className={`text-sm ${done ? "text-white" : "text-gray-500"}`}>
                      {step.label}
                    </span>
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>

        {/* Subscription & Broker Summary */}
        <div className="space-y-4">
          {/* Subscription */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary-400" />
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sub ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Package</span>
                    <span className="text-sm font-medium text-white">{sub.package?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Status</span>
                    <Badge
                      variant={
                        sub.status === "ACTIVE"
                          ? "success"
                          : sub.status === "PAST_DUE"
                          ? "danger"
                          : "warning"
                      }
                    >
                      {sub.status.replace("_", " ")}
                    </Badge>
                  </div>
                  {sub.currentPeriodEnd && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Next Billing</span>
                      <span className="text-sm font-medium text-white">{formatDate(sub.currentPeriodEnd)}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 mb-3">No active subscription</p>
                  <Link href="/dashboard/subscription">
                    <Button size="sm">Choose a Package</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Broker */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-secondary-400" />
                Broker Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              {broker ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Account</span>
                    <span className="text-sm font-medium text-white">
                      ••••{broker.accountNumber.slice(-4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Server</span>
                    <span className="text-sm font-medium text-white truncate max-w-32">{broker.server}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Status</span>
                    <Badge
                      variant={
                        broker.status === "ACTIVE"
                          ? "success"
                          : broker.status === "VERIFIED"
                          ? "secondary"
                          : "danger"
                      }
                    >
                      {broker.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 mb-3">No broker connected</p>
                  <Link href="/dashboard/broker">
                    <Button size="sm" variant="outline">Connect Broker</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
