"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, Plus, MessageSquare } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Ticket {
  id: string
  subject: string
  status: string
  priority: string
  createdAt: string
  _count: { messages: number }
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ subject: "", message: "", priority: "NORMAL" })
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetch("/api/dashboard/support")
      .then((r) => r.json())
      .then((d) => setTickets(d.tickets ?? []))
  }, [success])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch("/api/dashboard/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSuccess(true)
        setShowForm(false)
        setForm({ subject: "", message: "", priority: "NORMAL" })
        setTimeout(() => setSuccess(false), 5000)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const statusVariant: Record<string, "success" | "warning" | "default" | "danger"> = {
    OPEN: "warning",
    IN_PROGRESS: "secondary" as unknown as "default",
    RESOLVED: "success",
    CLOSED: "default",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Support</h1>
          <p className="text-gray-400 mt-1">Submit and track your support tickets</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" /> New Ticket
        </Button>
      </div>

      {success && (
        <div className="glass-card border-emerald-500/30">
          <p className="text-sm text-emerald-400">
            ✓ Your support ticket has been submitted. We&apos;ll respond within 24 hours.
          </p>
        </div>
      )}

      {/* New Ticket Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>New Support Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
              <Input
                label="Subject"
                placeholder="Briefly describe your issue"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">Priority</label>
                <select
                  className="flex h-10 w-full rounded-lg border border-autofx-dark-border bg-autofx-dark-card px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-600"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                >
                  <option value="LOW">Low</option>
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">Message</label>
                <textarea
                  rows={5}
                  placeholder="Describe your issue in detail..."
                  className="flex w-full rounded-lg border border-autofx-dark-border bg-autofx-dark-card px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600 resize-none"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" loading={submitting}>Submit Ticket</Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Ticket List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary-400" />
            My Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No support tickets yet</p>
              <p className="text-sm text-gray-600">Click &quot;New Ticket&quot; to get help</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-autofx-dark/50 border border-autofx-dark-border hover:border-primary-600/50 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-white">{ticket.subject}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatDate(ticket.createdAt)} · {ticket._count.messages} message{ticket._count.messages !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariant[ticket.status] ?? "default"}>
                      {ticket.status.replace("_", " ")}
                    </Badge>
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
