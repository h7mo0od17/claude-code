"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HelpCircle, Plus, Trash2 } from "lucide-react"

interface FaqItem {
  id: string
  question: string
  answer: string
  category: string
  order: number
  isActive: boolean
}

export default function AdminFaqPage() {
  const [items, setItems] = useState<FaqItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ question: "", answer: "", category: "general", order: "0" })

  useEffect(() => {
    fetch("/api/admin/faq")
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
  }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/admin/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, order: Number(form.order) }),
      })
      if (res.ok) {
        const data = await res.json()
        setItems((prev) => [...prev, data.item])
        setShowForm(false)
        setForm({ question: "", answer: "", category: "general", order: "0" })
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Help Center / FAQ</h1>
          <p className="text-gray-400 mt-1">Manage FAQ content for clients</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Add FAQ
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>Add FAQ Item</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4 max-w-lg">
              <Input label="Question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">Answer</label>
                <textarea
                  rows={4}
                  className="flex w-full rounded-lg border border-autofx-dark-border bg-autofx-dark-card px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600 resize-none"
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  required
                />
              </div>
              <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <div className="flex gap-3">
                <Button type="submit" loading={saving}>Add FAQ</Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-primary-400" />
            FAQ Items ({items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No FAQ items yet</p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="p-4 rounded-lg bg-autofx-dark/50 border border-autofx-dark-border">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-white">{item.question}</p>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">{item.answer}</p>
                      <p className="text-xs text-gray-600 mt-1">{item.category}</p>
                    </div>
                    <button
                      onClick={async () => {
                        await fetch(`/api/admin/faq/${item.id}`, { method: "DELETE" })
                        setItems((prev) => prev.filter((i) => i.id !== item.id))
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-400" />
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
