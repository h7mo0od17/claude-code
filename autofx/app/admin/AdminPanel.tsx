'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown, ChevronUp, ExternalLink, Check, X,
  Zap, ZapOff, CreditCard, User
} from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { PACKAGE_CONFIG, getPackageForBalance } from '@/types'
import { formatCurrency, formatDateTime } from '@/lib/utils'

type AppRow = {
  id: string
  user_id: string
  exness_uid: string
  exness_account_number: string
  account_balance: number
  account_currency: string
  status: string
  package: string | null
  package_price: number | null
  stripe_payment_link: string | null
  payment_status: string
  payment_confirmed_at: string | null
  mirror_active: boolean
  mirror_activated_at: string | null
  admin_notes: string
  rejection_reason: string
  submitted_at: string
  profiles: {
    full_name: string
    email: string
    phone: string
    country: string
  }
}

interface AdminPanelProps {
  applications: AppRow[]
  updateApplication: (fd: FormData) => Promise<void>
  confirmPayment: (fd: FormData) => Promise<void>
  toggleMirror: (fd: FormData) => Promise<void>
}

function ApplicationRow({
  app,
  updateApplication,
  confirmPayment,
  toggleMirror,
}: {
  app: AppRow
  updateApplication: (fd: FormData) => Promise<void>
  confirmPayment: (fd: FormData) => Promise<void>
  toggleMirror: (fd: FormData) => Promise<void>
}) {
  const [expanded, setExpanded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    status: app.status,
    package: app.package ?? getPackageForBalance(app.account_balance) ?? 'bronze',
    stripe_payment_link: app.stripe_payment_link ?? '',
    admin_notes: app.admin_notes ?? '',
    rejection_reason: app.rejection_reason ?? '',
  })

  const suggestedPackage = getPackageForBalance(app.account_balance)
  const profile = app.profiles

  const statusBadge: Record<string, 'pending' | 'approved' | 'rejected' | 'default'> = {
    pending: 'pending',
    under_review: 'pending',
    approved: 'approved',
    rejected: 'rejected',
  }

  async function handleSave() {
    setSaving(true)
    const fd = new FormData()
    fd.set('id', app.id)
    fd.set('status', form.status)
    if (form.status === 'approved') fd.set('package', form.package)
    fd.set('stripe_payment_link', form.stripe_payment_link)
    fd.set('admin_notes', form.admin_notes)
    fd.set('rejection_reason', form.rejection_reason)
    await updateApplication(fd)
    setSaving(false)
  }

  async function handleConfirmPayment() {
    setSaving(true)
    const fd = new FormData()
    fd.set('id', app.id)
    await confirmPayment(fd)
    setSaving(false)
  }

  async function handleToggleMirror() {
    setSaving(true)
    const fd = new FormData()
    fd.set('id', app.id)
    fd.set('active', String(!app.mirror_active))
    await toggleMirror(fd)
    setSaving(false)
  }

  return (
    <div className="glass rounded-xl border border-glass-border overflow-hidden">
      {/* Row header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors text-left"
      >
        {/* Status indicator */}
        <div className={`w-2 h-2 rounded-full shrink-0 ${
          app.mirror_active ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' :
          app.status === 'approved' ? 'bg-green-400' :
          app.status === 'rejected' ? 'bg-red-400' :
          'bg-yellow-400'
        }`} />

        <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center">
          <div className="min-w-0">
            <p className="font-display font-medium text-white text-sm truncate">
              {profile?.full_name}
            </p>
            <p className="text-xs text-slate-500 truncate">{profile?.email}</p>
          </div>
          <div>
            <p className="font-mono text-sm text-slate-300">
              {formatCurrency(app.account_balance, app.account_currency)}
            </p>
            <p className="text-xs text-slate-600">Balance</p>
          </div>
          <div>
            <Badge variant={statusBadge[app.status] ?? 'default'}>
              {app.status === 'pending' ? 'Review' :
               app.status === 'under_review' ? 'Review' :
               app.status === 'approved' ? 'Approved' : 'Rejected'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {app.package && (
              <Badge variant={app.package as 'bronze' | 'silver' | 'gold'}>
                {PACKAGE_CONFIG[app.package as keyof typeof PACKAGE_CONFIG]?.name}
              </Badge>
            )}
            {app.mirror_active && (
              <Badge variant="active">Live</Badge>
            )}
          </div>
        </div>

        <span className="text-xs text-slate-600 shrink-0 hidden sm:block">
          {formatDateTime(app.submitted_at)}
        </span>
        {expanded
          ? <ChevronUp className="h-4 w-4 text-slate-500 shrink-0" />
          : <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
        }
      </button>

      {/* Expanded detail */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-glass-border px-5 py-6 space-y-8">

              {/* Client info */}
              <div>
                <h4 className="text-xs font-display uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                  <User className="h-3.5 w-3.5" /> Client Information
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Name', value: profile?.full_name },
                    { label: 'Email', value: profile?.email },
                    { label: 'Phone', value: profile?.phone || '—' },
                    { label: 'Country', value: profile?.country || '—' },
                    { label: 'Exness UID', value: app.exness_uid },
                    { label: 'Account #', value: app.exness_account_number },
                    { label: 'Balance', value: formatCurrency(app.account_balance, app.account_currency) },
                    { label: 'Suggested pkg', value: suggestedPackage ? PACKAGE_CONFIG[suggestedPackage].name : 'Ineligible (<$500)' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-slate-600 uppercase tracking-wider font-display mb-0.5">{label}</p>
                      <p className="text-sm text-slate-300 font-mono">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin controls */}
              <div>
                <h4 className="text-xs font-display uppercase tracking-wider text-slate-500 mb-4">
                  Review & Manage
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-display font-medium text-slate-300 block mb-1.5">
                      Status
                    </label>
                    <select
                      value={form.status}
                      onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                      className="w-full rounded-lg bg-nebula border border-glass-border px-4 py-2.5
                                 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amethyst/40"
                    >
                      <option value="pending">Pending</option>
                      <option value="under_review">Under Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  {form.status === 'approved' && (
                    <div>
                      <label className="text-sm font-display font-medium text-slate-300 block mb-1.5">
                        Package
                        {suggestedPackage && (
                          <span className="text-xs text-champagne ml-2">
                            (Suggested: {PACKAGE_CONFIG[suggestedPackage].name})
                          </span>
                        )}
                      </label>
                      <select
                        value={form.package}
                        onChange={e => setForm(f => ({ ...f, package: e.target.value }))}
                        className="w-full rounded-lg bg-nebula border border-glass-border px-4 py-2.5
                                   text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amethyst/40"
                      >
                        <option value="bronze">BronzeFX — $149/month ($500–$2,999)</option>
                        <option value="silver">SilverFX — $399/month ($3,000–$9,999)</option>
                        <option value="gold">GoldFX — $1,499/month ($10,000+)</option>
                      </select>
                    </div>
                  )}
                </div>

                {form.status === 'approved' && (
                  <div className="mb-4">
                    <Input
                      label="Stripe Payment Link"
                      type="url"
                      placeholder="https://buy.stripe.com/..."
                      value={form.stripe_payment_link}
                      onChange={e => setForm(f => ({ ...f, stripe_payment_link: e.target.value }))}
                      hint="Paste the Stripe payment link for this client's package"
                    />
                  </div>
                )}

                {form.status === 'rejected' && (
                  <div className="mb-4">
                    <Input
                      label="Rejection reason (shown to client)"
                      type="text"
                      placeholder="e.g. Account balance below minimum requirement"
                      value={form.rejection_reason}
                      onChange={e => setForm(f => ({ ...f, rejection_reason: e.target.value }))}
                    />
                  </div>
                )}

                <div className="mb-5">
                  <Input
                    label="Internal notes"
                    type="text"
                    placeholder="Admin notes (not shown to client)"
                    value={form.admin_notes}
                    onChange={e => setForm(f => ({ ...f, admin_notes: e.target.value }))}
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="primary"
                    size="sm"
                    loading={saving}
                    onClick={handleSave}
                  >
                    <Check className="h-3.5 w-3.5" /> Save Changes
                  </Button>

                  {/* Confirm payment */}
                  {app.status === 'approved' && app.payment_status !== 'paid' && (
                    <Button
                      variant="gold"
                      size="sm"
                      loading={saving}
                      onClick={handleConfirmPayment}
                    >
                      <CreditCard className="h-3.5 w-3.5" /> Confirm Payment
                    </Button>
                  )}

                  {/* Mirror toggle */}
                  {app.status === 'approved' && app.payment_status === 'paid' && (
                    <Button
                      variant={app.mirror_active ? 'danger' : 'secondary'}
                      size="sm"
                      loading={saving}
                      onClick={handleToggleMirror}
                    >
                      {app.mirror_active
                        ? <><ZapOff className="h-3.5 w-3.5" /> Deactivate Mirror</>
                        : <><Zap className="h-3.5 w-3.5" /> Activate Mirror</>
                      }
                    </Button>
                  )}

                  {/* Stripe link shortcut */}
                  {app.stripe_payment_link && (
                    <a href={app.stripe_payment_link} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-3.5 w-3.5" /> View Stripe Link
                      </Button>
                    </a>
                  )}
                </div>
              </div>

              {/* Payment status */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-nebula/50 border border-glass-border">
                <div className="flex-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-display mb-1">Payment</p>
                  <p className="text-sm text-white font-mono">
                    {app.payment_status === 'paid'
                      ? `Confirmed ${app.payment_confirmed_at ? formatDateTime(app.payment_confirmed_at) : ''}`
                      : 'Not paid'}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-display mb-1">Mirror</p>
                  <p className={`text-sm font-mono ${app.mirror_active ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {app.mirror_active
                      ? `Active since ${app.mirror_activated_at ? formatDateTime(app.mirror_activated_at) : '—'}`
                      : 'Not active'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AdminPanel({
  applications,
  updateApplication,
  confirmPayment,
  toggleMirror,
}: AdminPanelProps) {
  const [filter, setFilter] = useState<string>('all')

  const filtered = applications.filter(a => {
    if (filter === 'all')      return true
    if (filter === 'pending')  return a.status === 'pending' || a.status === 'under_review'
    if (filter === 'approved') return a.status === 'approved'
    if (filter === 'active')   return a.mirror_active
    if (filter === 'rejected') return a.status === 'rejected'
    return true
  })

  const filters = [
    { key: 'all',      label: 'All' },
    { key: 'pending',  label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'active',   label: 'Live' },
    { key: 'rejected', label: 'Rejected' },
  ]

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-display transition-colors duration-200 ${
              filter === key
                ? 'bg-amethyst text-white'
                : 'bg-glass text-slate-400 hover:text-white border border-glass-border hover:bg-glass-hover'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Applications list */}
      {filtered.length === 0 ? (
        <div className="glass rounded-xl border border-glass-border py-16 text-center">
          <p className="text-slate-500 text-sm">No applications in this category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(app => (
            <ApplicationRow
              key={app.id}
              app={app}
              updateApplication={updateApplication}
              confirmPayment={confirmPayment}
              toggleMirror={toggleMirror}
            />
          ))}
        </div>
      )}
    </div>
  )
}
