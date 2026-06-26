"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Server, Plus, Trash2 } from "lucide-react"

interface BrokerServer {
  id: string
  name: string
  host: string
  port: number
  isActive: boolean
  broker: { displayName: string }
}

export default function AdminBrokersPage() {
  const [servers, setServers] = useState<BrokerServer[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", host: "", port: "443" })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/admin/broker-servers")
      .then((r) => r.json())
      .then((d) => setServers(d.servers ?? []))
  }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/admin/broker-servers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const data = await res.json()
        setServers((prev) => [...prev, data.server])
        setForm({ name: "", host: "", port: "443" })
        setShowForm(false)
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/broker-servers/${id}`, { method: "DELETE" })
    setServers((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Broker Server Management</h1>
          <p className="text-gray-400 mt-1">Manage trading servers clients can connect to</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Server
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>Add New Server</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4 max-w-lg">
              <Input
                label="Server Name"
                placeholder="e.g. MetaQuotes-Demo"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Host"
                placeholder="e.g. demo.metaquotes.net"
                value={form.host}
                onChange={(e) => setForm({ ...form, host: e.target.value })}
                required
              />
              <Input
                label="Port"
                type="number"
                value={form.port}
                onChange={(e) => setForm({ ...form, port: e.target.value })}
              />
              <div className="flex gap-3">
                <Button type="submit" loading={saving}>Add Server</Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-4 h-4 text-primary-400" />
            Broker Servers ({servers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {servers.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No servers configured yet</p>
          ) : (
            <div className="space-y-3">
              {servers.map((server) => (
                <div
                  key={server.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-autofx-dark/50 border border-autofx-dark-border"
                >
                  <div className="flex items-center gap-3">
                    <Server className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium text-white">{server.name}</p>
                      <p className="text-xs text-gray-500">
                        {server.host}:{server.port} · {server.broker.displayName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={server.isActive ? "success" : "warning"}>
                      {server.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <button
                      onClick={() => handleDelete(server.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
