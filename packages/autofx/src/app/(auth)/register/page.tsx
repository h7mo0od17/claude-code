"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Lock, User, Eye, EyeOff, CheckCircle2 } from "lucide-react"

const passwordRequirements = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
]

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultPackage = searchParams.get("package") ?? ""

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    agreeRisk: false,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (!form.agreeTerms || !form.agreeRisk) {
      setError("Please agree to Terms of Service and Risk Disclosure")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          defaultPackage,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Registration failed")
        setLoading(false)
        return
      }

      router.push("/verify-email-sent?email=" + encodeURIComponent(form.email))
    } catch {
      setError("An unexpected error occurred")
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-white mb-2">Create Account</h1>
        <p className="text-gray-400">Join AutoFX and start copy trading today</p>
      </div>

      <div className="glass-card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Smith"
            icon={<User className="w-4 h-4" />}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            autoComplete="name"
          />

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
                placeholder="Create a strong password"
                className="flex h-10 w-full rounded-lg border border-autofx-dark-border bg-autofx-dark-card pl-10 pr-10 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {form.password && (
              <div className="mt-2 space-y-1">
                {passwordRequirements.map((req) => (
                  <div key={req.label} className="flex items-center gap-2 text-xs">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${req.test(form.password) ? "text-emerald-400" : "text-gray-600"}`}
                    />
                    <span className={req.test(form.password) ? "text-emerald-400" : "text-gray-600"}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat your password"
            icon={<Lock className="w-4 h-4" />}
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            required
            autoComplete="new-password"
          />

          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 rounded border-autofx-dark-border bg-autofx-dark-card accent-primary-600"
                checked={form.agreeTerms}
                onChange={(e) => setForm({ ...form, agreeTerms: e.target.checked })}
              />
              <span className="text-sm text-gray-400">
                I agree to the{" "}
                <Link href="/terms" className="text-primary-400 hover:underline" target="_blank">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-primary-400 hover:underline" target="_blank">Privacy Policy</Link>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 rounded border-autofx-dark-border bg-autofx-dark-card accent-primary-600"
                checked={form.agreeRisk}
                onChange={(e) => setForm({ ...form, agreeRisk: e.target.checked })}
              />
              <span className="text-sm text-gray-400">
                I have read and understood the{" "}
                <Link href="/risk-disclosure" className="text-primary-400 hover:underline" target="_blank">Risk Disclosure</Link>
              </span>
            </label>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Create Account
          </Button>
        </form>
      </div>

      <p className="text-center mt-6 text-sm text-gray-400">
        Already have an account?{" "}
        <Link href="/login" className="text-primary-400 hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}
