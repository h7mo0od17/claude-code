'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ExternalLink, Info, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { PACKAGE_CONFIG, getPackageForBalance } from '@/types'

export default function ApplyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [checkingExisting, setCheckingExisting] = useState(true)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    exness_uid: '',
    exness_account_number: '',
    account_balance: '',
    account_currency: 'USD',
  })

  // Check if user already has an application
  useEffect(() => {
    async function check() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: existing } = await supabase
        .from('applications')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (existing) {
        router.push('/dashboard')
        return
      }
      setCheckingExisting(false)
    }
    check()
  }, [router])

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      setError('')
    }
  }

  const balance = parseFloat(form.account_balance)
  const suggestedPackage = !isNaN(balance) && balance > 0 ? getPackageForBalance(balance) : null
  const pkg = suggestedPackage ? PACKAGE_CONFIG[suggestedPackage] : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const balanceNum = parseFloat(form.account_balance)
    if (isNaN(balanceNum) || balanceNum < 500) {
      setError('Minimum qualifying balance is $500 USD.')
      return
    }
    if (!form.exness_uid.trim() || !form.exness_account_number.trim()) {
      setError('Please provide your Exness UID and account number.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error: insertError } = await supabase.from('applications').insert({
      user_id: user.id,
      exness_uid: form.exness_uid.trim(),
      exness_account_number: form.exness_account_number.trim(),
      account_balance: balanceNum,
      account_currency: form.account_currency,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setSubmitted(true)
  }

  if (checkingExisting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-amethyst/30 border-t-amethyst rounded-full animate-spin" />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/25
                         flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-green-400" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white mb-3">
            Application submitted
          </h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Your application is now under review. We&apos;ll notify you by email within
            24–48 hours once a decision has been made.
          </p>
          <Link href="/dashboard">
            <Button variant="primary" size="lg" className="w-full">
              View Dashboard
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-16"
         style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(124,58,237,0.07) 0%, transparent 60%)' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-amethyst flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">A</span>
            </div>
            <span className="font-display font-bold text-white text-lg">AutoFX</span>
          </Link>
          <h1 className="font-display font-bold text-3xl text-white mb-3">
            Connect your Exness account
          </h1>
          <p className="text-slate-400">
            Provide your Exness trading account details to complete your application.
          </p>
        </motion.div>

        {/* Exness notice */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-start gap-3 p-4 rounded-xl bg-sapphire/8 border border-sapphire/20 mb-8"
        >
          <Info className="h-4 w-4 text-sapphire-light mt-0.5 shrink-0" />
          <div className="text-sm text-slate-400">
            <span className="text-white font-medium">Don&apos;t have an Exness account?</span>
            {' '}AutoFX requires an active Exness trading account.{' '}
            <Link
              href="/exness"
              target="_blank"
              className="text-sapphire-light hover:underline inline-flex items-center gap-1"
            >
              Open one here <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="glass rounded-2xl p-8 border border-glass-border"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Exness UID"
                type="text"
                placeholder="e.g. 12345678"
                value={form.exness_uid}
                onChange={update('exness_uid')}
                required
                hint="Found in your Exness Personal Area profile"
              />
              <Input
                label="Exness Account Number"
                type="text"
                placeholder="e.g. 987654321"
                value={form.exness_account_number}
                onChange={update('exness_account_number')}
                required
                hint="Your MT4/MT5 trading account number"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Account Balance"
                type="number"
                placeholder="0.00"
                value={form.account_balance}
                onChange={update('account_balance')}
                required
                min="500"
                step="0.01"
                prefix="$"
                hint="Minimum $500 to qualify"
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-300 font-display">
                  Currency
                </label>
                <select
                  value={form.account_currency}
                  onChange={update('account_currency')}
                  className="w-full rounded-lg bg-nebula border border-glass-border px-4 py-2.5
                             text-sm text-slate-100 font-body transition-colors duration-200
                             focus:outline-none focus:ring-2 focus:ring-amethyst/40 focus:border-amethyst/50
                             hover:border-glass-border-hover"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>

            {/* Package preview */}
            {pkg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center justify-between px-4 py-3 rounded-lg
                           bg-amethyst/8 border border-amethyst/20"
              >
                <div>
                  <p className="text-xs text-slate-500 font-display uppercase tracking-wider mb-0.5">
                    Estimated eligibility
                  </p>
                  <p className="font-display font-semibold text-white">
                    {pkg.name} — ${pkg.price}/month
                  </p>
                </div>
                <span className="font-mono text-xs text-amethyst-light">{pkg.range}</span>
              </motion.div>
            )}

            {balance > 0 && balance < 500 && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                The minimum qualifying balance is $500 USD. Accounts below this threshold are not currently eligible.
              </div>
            )}

            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Consent */}
            <p className="text-xs text-slate-600 leading-relaxed">
              By submitting this application, you confirm that the Exness account details
              provided are accurate and that you have read and agree to the AutoFX{' '}
              <Link href="/terms" className="text-amethyst-light hover:underline">Terms of Service</Link>,{' '}
              <Link href="/risk-disclosure" className="text-amethyst-light hover:underline">Risk Disclosure</Link>, and{' '}
              <Link href="/privacy" className="text-amethyst-light hover:underline">Privacy Policy</Link>.
            </p>

            <Button type="submit" variant="primary" size="lg" loading={loading}>
              Submit Application
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
