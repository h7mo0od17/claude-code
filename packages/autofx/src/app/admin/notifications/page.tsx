"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Bell, Send } from "lucide-react"

export default function AdminNotificationsPage() {
  const [form, setForm] = useState({ title: "", message: "", type: "SYSTEM_ANNOUNCEMENT" })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, target: "all" }),
      })
      if (res.ok) {
        setSent(true)
        setForm({ title: "", message: "", type: "SYSTEM_ANNOUNCEMENT" })
        setTimeout(() => setSent(false), 5000)
      }
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Notification Management</h1>
        <p className="text-gray-400 mt-1">Send system announcements to all clients</p>
      </div>

      {sent && (
        <div className="glass-card border-emerald-500/30">
          <p className="text-sm text-emerald-400">✓ Announcement sent to all clients</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary-400" />
            Send Announcement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSend} className="space-y-4 max-w-lg">
            <Input
              label="Title"
              placeholder="Announcement title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">Message</label>
              <textarea
                rows={4}
                placeholder="Write your announcement..."
                className="flex w-full rounded-lg border border-autofx-dark-border bg-autofx-dark-card px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600 resize-none"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
            </div>
            <Button type="submit" loading={sending} className="gap-2">
              <Send className="w-4 h-4" /> Send to All Clients
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
