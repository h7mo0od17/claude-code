"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { User, Shield, CheckCircle2 } from "lucide-react"

export default function ProfilePage() {
  const [profile, setProfile] = useState<{
    name: string
    email: string
    phone: string
    country: string
    emailVerified: boolean
    twoFactorEnabled: boolean
  } | null>(null)
  const [form, setForm] = useState({ name: "", phone: "", country: "" })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/dashboard/profile")
      .then((r) => r.json())
      .then((d) => {
        setProfile(d.user)
        setForm({ name: d.user.name ?? "", phone: d.user.phone ?? "", country: d.user.country ?? "" })
      })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/dashboard/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error)
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } finally {
      setSaving(false)
    }
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Profile</h1>
        <p className="text-gray-400 mt-1">Manage your account information</p>
      </div>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary-400" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4 max-w-lg">
            <Input
              label="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">Email Address</label>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  className="flex h-10 flex-1 rounded-lg border border-autofx-dark-border bg-autofx-dark px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                />
                <Badge variant={profile.emailVerified ? "success" : "warning"}>
                  {profile.emailVerified ? "Verified" : "Unverified"}
                </Badge>
              </div>
            </div>
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Input
              label="Country"
              placeholder="e.g. United Kingdom"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}
            {saved && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-3 text-sm text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Profile saved successfully
              </div>
            )}

            <Button type="submit" loading={saving}>Save Changes</Button>
          </form>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary-400" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Two-Factor Authentication</p>
              <p className="text-sm text-gray-400 mt-0.5">
                Add an extra layer of security to your account
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={profile.twoFactorEnabled ? "success" : "outline"}>
                {profile.twoFactorEnabled ? "Enabled" : "Disabled"}
              </Badge>
              <Button variant="outline" size="sm">
                {profile.twoFactorEnabled ? "Manage" : "Enable 2FA"}
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-autofx-dark-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Change Password</p>
                <p className="text-sm text-gray-400 mt-0.5">Update your account password</p>
              </div>
              <Button variant="outline" size="sm">Change Password</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
