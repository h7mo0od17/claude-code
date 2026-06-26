"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Link2, Server, CheckCircle2, XCircle, AlertCircle, Eye, EyeOff } from "lucide-react"

interface BrokerServer {
  id: string
  name: string
  broker: { displayName: string }
}

interface BrokerAccountData {
  accountNumber: string
  server: string
  status: string
  accountName: string | null
  balance: number | null
  equity: number | null
  leverage: number | null
  verifiedAt: string | null
}

export default function BrokerPage() {
  const [servers, setServers] = useState<BrokerServer[]>([])
  const [brokerAccount, setBrokerAccount] = useState<BrokerAccountData | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [serverSearch, setServerSearch] = useState("")
  const [result, setResult] = useState<{ success?: boolean; error?: string; message?: string } | null>(null)

  const [form, setForm] = useState({
    accountNumber: "",
    password: "",
    server: "",
  })

  useEffect(() => {
    fetch("/api/broker/servers")
      .then((r) => r.json())
      .then((d) => setServers(d.servers ?? []))

    fetch("/api/dashboard/broker-account")
      .then((r) => r.json())
      .then((d) => setBrokerAccount(d.brokerAccount))
  }, [])

  const filteredServers = servers.filter((s) =>
    s.name.toLowerCase().includes(serverSearch.toLowerCase())
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setVerifying(true)
    setResult(null)

    try {
      const res = await fetch("/api/broker/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      setResult(data)
      if (data.success) {
        setBrokerAccount({
          accountNumber: form.accountNumber,
          server: form.server,
          status: "ACTIVE",
          accountName: data.accountInfo?.name,
          balance: data.accountInfo?.balance,
          equity: data.accountInfo?.equity,
          leverage: data.accountInfo?.leverage,
          verifiedAt: new Date().toISOString(),
        })
      }
    } catch {
      setResult({ success: false, error: "Connection failed. Please try again." })
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Broker Account</h1>
        <p className="text-gray-400 mt-1">Connect your MT4/MT5 broker account to start copy trading</p>
      </div>

      {/* Current account */}
      {brokerAccount && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-primary-400" />
              Connected Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Account Number", value: `••••${brokerAccount.accountNumber.slice(-4)}` },
                { label: "Account Name", value: brokerAccount.accountName ?? "—" },
                { label: "Server", value: brokerAccount.server },
                { label: "Balance", value: brokerAccount.balance ? `$${brokerAccount.balance.toLocaleString()}` : "—" },
                { label: "Equity", value: brokerAccount.equity ? `$${brokerAccount.equity.toLocaleString()}` : "—" },
                { label: "Leverage", value: brokerAccount.leverage ? `1:${brokerAccount.leverage}` : "—" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className="text-sm font-medium text-white">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Badge
                variant={
                  brokerAccount.status === "ACTIVE"
                    ? "success"
                    : brokerAccount.status === "VERIFIED"
                    ? "secondary"
                    : "danger"
                }
              >
                {brokerAccount.status.replace("_", " ")}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connection Form */}
      <Card>
        <CardHeader>
          <CardTitle>{brokerAccount ? "Update Broker Account" : "Connect Broker Account"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="glass-card border-yellow-500/30 mb-6">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <p className="text-sm text-gray-400">
                Your broker credentials are encrypted and used only for trade copying. AutoFX cannot withdraw funds from your account.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <Input
              label="Trading Account Number"
              type="text"
              placeholder="e.g. 12345678"
              value={form.accountNumber}
              onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
              required
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">
                Trading Account Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your MT4/MT5 password"
                  className="flex h-10 w-full rounded-lg border border-autofx-dark-border bg-autofx-dark-card px-3 pr-10 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">
                Trading Server
              </label>
              {servers.length > 0 ? (
                <div>
                  <Input
                    type="text"
                    placeholder="Search servers..."
                    value={serverSearch}
                    onChange={(e) => setServerSearch(e.target.value)}
                    icon={<Server className="w-4 h-4" />}
                  />
                  {serverSearch && (
                    <div className="mt-1 max-h-40 overflow-y-auto rounded-lg border border-autofx-dark-border bg-autofx-dark-card">
                      {filteredServers.length === 0 ? (
                        <p className="text-sm text-gray-500 p-3">No matching servers. You can type the server name manually.</p>
                      ) : (
                        filteredServers.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            className="w-full text-left px-3 py-2 text-sm hover:bg-autofx-dark transition-colors"
                            onClick={() => {
                              setForm({ ...form, server: s.name })
                              setServerSearch(s.name)
                            }}
                          >
                            <span className="text-white">{s.name}</span>
                            <span className="text-gray-500 ml-2 text-xs">{s.broker.displayName}</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Input
                  type="text"
                  placeholder="e.g. MetaQuotes-Demo"
                  value={form.server}
                  onChange={(e) => setForm({ ...form, server: e.target.value })}
                  required
                />
              )}
              {servers.length > 0 && (
                <Input
                  type="text"
                  placeholder="Or type server name manually"
                  value={form.server}
                  onChange={(e) => setForm({ ...form, server: e.target.value })}
                  required
                />
              )}
            </div>

            {result && (
              <div
                className={`rounded-lg px-4 py-3 flex items-start gap-2 ${
                  result.success
                    ? "bg-emerald-500/10 border border-emerald-500/30"
                    : "bg-red-500/10 border border-red-500/30"
                }`}
              >
                {result.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                )}
                <p className={`text-sm ${result.success ? "text-emerald-400" : "text-red-400"}`}>
                  {result.success ? result.message : result.error}
                </p>
              </div>
            )}

            <Button type="submit" loading={verifying} className="w-full" size="lg">
              {verifying ? "Verifying Account..." : "Verify & Connect Account"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Guide */}
      <Card>
        <CardHeader>
          <CardTitle>How to Find Your Credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Account Number",
                desc: "Open your MT4/MT5 terminal. Go to Tools → Options → Server tab. Your account number is displayed at the top.",
              },
              {
                step: "2",
                title: "Password",
                desc: "This is the Investor or Main password for your MT4/MT5 account, set when you created your broker account.",
              },
              {
                step: "3",
                title: "Server",
                desc: "Open MT4/MT5, go to File → Login, and your server name is shown in the Server dropdown.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-purple-blue flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
