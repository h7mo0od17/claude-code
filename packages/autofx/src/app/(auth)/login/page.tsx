"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ email: "", password: "", otp: "" })
  const [needsOTP, setNeedsOTP] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.requiresOTP) {
          setNeedsOTP(true)
          setLoading(false)
          return
        }
        setError(data.error ?? "Login failed")
        setLoading(false)
        return
      }

      router.push("/dashboard")
    } catch {
      setError("An unexpected error occurred")
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-white mb-2">Welcome Back</h1>
        <p className="text-gray-400">Sign in to your AutoFX account</p>
      </div>

      <div className="glass-card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon={<Mail className="w-4 h-4" />}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            autoComplete="email"
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="flex h-10 w-full rounded-lg border border-autofx-dark-border bg-autofx-dark-card pl-10 pr-10 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                autoComplete="current-password"
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

          {needsOTP && (
            <Input
              label="Two-Factor Code"
              type="text"
              placeholder="000000"
              maxLength={6}
              value={form.otp}
              onChange={(e) => setForm({ ...form, otp: e.target.value })}
              required
            />
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div />
            <Link href="/forgot-password" className="text-sm text-primary-400 hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Sign In
          </Button>
        </form>
      </div>

      <p className="text-center mt-6 text-sm text-gray-400">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary-400 hover:underline font-medium">
          Create one free
        </Link>
      </p>
    </div>
  )
}
