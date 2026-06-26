"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Video, Plus, Trash2, Eye } from "lucide-react"

interface Tutorial {
  id: string
  title: string
  description: string | null
  videoUrl: string
  category: string
  order: number
  isActive: boolean
}

export default function AdminTutorialsPage() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: "", description: "", videoUrl: "", category: "general", order: "0" })

  useEffect(() => {
    fetch("/api/admin/tutorials")
      .then((r) => r.json())
      .then((d) => setTutorials(d.tutorials ?? []))
  }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/admin/tutorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, order: Number(form.order) }),
      })
      if (res.ok) {
        const data = await res.json()
        setTutorials((prev) => [...prev, data.tutorial])
        setShowForm(false)
        setForm({ title: "", description: "", videoUrl: "", category: "general", order: "0" })
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/tutorials/${id}`, { method: "DELETE" })
    setTutorials((prev) => prev.filter((t) => t.id !== id))
  }

  const categories = [
    "general", "account-setup", "payment", "broker-connection", "copy-trading", "faq", "troubleshooting",
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Tutorial Video Library</h1>
          <p className="text-gray-400 mt-1">Manage educational content for clients</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Video
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>Add Tutorial Video</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4 max-w-lg">
              <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">Description</label>
                <textarea
                  rows={2}
                  className="flex w-full rounded-lg border border-autofx-dark-border bg-autofx-dark-card px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600 resize-none"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <Input label="Video URL (YouTube/Vimeo)" type="url" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} required />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">Category</label>
                <select
                  className="flex h-10 w-full rounded-lg border border-autofx-dark-border bg-autofx-dark-card px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-600"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c.replace(/-/g, " ")}</option>
                  ))}
                </select>
              </div>
              <Input label="Order" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
              <div className="flex gap-3">
                <Button type="submit" loading={saving}>Add Video</Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-4 h-4 text-primary-400" />
            Videos ({tutorials.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tutorials.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No tutorials added yet</p>
          ) : (
            <div className="space-y-3">
              {tutorials.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-4 rounded-lg bg-autofx-dark/50 border border-autofx-dark-border">
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-primary-400 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-white">{t.title}</p>
                      <p className="text-xs text-gray-500">{t.category} · Order: {t.order}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={t.isActive ? "success" : "warning"}>{t.isActive ? "Active" : "Inactive"}</Badge>
                    <a href={t.videoUrl} target="_blank" rel="noopener noreferrer">
                      <Eye className="w-4 h-4 text-gray-500 hover:text-white" />
                    </a>
                    <button onClick={() => handleDelete(t.id)}>
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
