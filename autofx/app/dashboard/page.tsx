import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Clock, CheckCircle2, XCircle, Zap, ArrowRight,
  CreditCard, ExternalLink, AlertCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { PACKAGE_CONFIG, type Application, type Profile } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'

function StatusBanner({ app }: { app: Application }) {
  // No application
  if (!app) return null

  const isActive  = app.mirror_active
  const isPaid    = app.payment_status === 'paid'
  const isApproved = app.status === 'approved'
  const isRejected = app.status === 'rejected'
  const isPending  = !isApproved && !isRejected

  if (isActive) {
    return (
      <div className="flex items-center gap-3 px-5 py-4 rounded-xl
                      bg-emerald-500/8 border border-emerald-500/25">
        <Zap className="h-5 w-5 text-emerald-400 shrink-0" />
        <div>
          <p className="font-display font-semibold text-emerald-400 text-sm">
            Trade mirroring is active
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Strategies are being mirrored into your Exness account in real time.
          </p>
        </div>
      </div>
    )
  }

  if (isApproved && isPaid) {
    return (
      <div className="flex items-center gap-3 px-5 py-4 rounded-xl
                      bg-blue-500/8 border border-blue-500/25">
        <Clock className="h-5 w-5 text-blue-400 shrink-0" />
        <div>
          <p className="font-display font-semibold text-blue-400 text-sm">
            Payment received — awaiting activation
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Our team will activate your trade mirroring shortly. You&apos;ll receive an email when it&apos;s live.
          </p>
        </div>
      </div>
    )
  }

  if (isApproved && !isPaid) {
    return (
      <div className="flex items-center gap-3 px-5 py-4 rounded-xl
                      bg-champagne/8 border border-champagne/25">
        <CreditCard className="h-5 w-5 text-champagne shrink-0" />
        <div>
          <p className="font-display font-semibold text-champagne text-sm">
            Application approved — activate your subscription
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete payment below to start trade mirroring.
          </p>
        </div>
      </div>
    )
  }

  if (isRejected) {
    return (
      <div className="flex items-center gap-3 px-5 py-4 rounded-xl
                      bg-red-500/8 border border-red-500/25">
        <XCircle className="h-5 w-5 text-red-400 shrink-0" />
        <div>
          <p className="font-display font-semibold text-red-400 text-sm">Application not approved</p>
          {app.rejection_reason && (
            <p className="text-xs text-slate-500 mt-0.5">{app.rejection_reason}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 px-5 py-4 rounded-xl
                    bg-yellow-500/8 border border-yellow-500/25">
      <Clock className="h-5 w-5 text-yellow-400 shrink-0" />
      <div>
        <p className="font-display font-semibold text-yellow-400 text-sm">
          Application under review
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          We&apos;ll review your application within 24–48 hours and notify you by email.
        </p>
      </div>
    </div>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [{ data: profile }, { data: app }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('applications').select('*').eq('user_id', user.id).single(),
  ])

  const isAdmin = profile?.role === 'admin'
  const pkg = app?.package ? PACKAGE_CONFIG[app.package as keyof typeof PACKAGE_CONFIG] : null

  return (
    <>
      <Navbar user={user} isAdmin={isAdmin} />

      <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">

          {/* Page header */}
          <div className="mb-8">
            <h1 className="font-display font-bold text-2xl text-white mb-1">
              Welcome back, {profile?.full_name?.split(' ')[0] ?? 'there'}
            </h1>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>

          {/* No application yet */}
          {!app && (
            <div className="glass rounded-2xl p-10 border border-glass-border text-center">
              <div className="w-14 h-14 rounded-full bg-amethyst/10 border border-amethyst/20
                             flex items-center justify-center mx-auto mb-5">
                <AlertCircle className="h-7 w-7 text-amethyst-light" />
              </div>
              <h2 className="font-display font-semibold text-white text-xl mb-2">
                No application on file
              </h2>
              <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                Submit your Exness account details to begin the review process.
              </p>
              <Link href="/apply">
                <Button variant="primary" size="lg">
                  Start Application <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}

          {/* Application exists */}
          {app && (
            <div className="flex flex-col gap-6">

              {/* Status banner */}
              <StatusBanner app={app as Application} />

              {/* Subscription activation — shown only when approved + unpaid */}
              {app.status === 'approved' && app.payment_status === 'unpaid' && app.stripe_payment_link && pkg && (
                <div className="glass rounded-2xl p-8 border border-champagne/25">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div>
                      <p className="text-xs font-display uppercase tracking-wider text-champagne mb-1">
                        Your Plan
                      </p>
                      <h2 className="font-display font-bold text-white text-2xl mb-1">
                        {pkg.name}
                      </h2>
                      <p className="font-mono text-3xl text-champagne font-bold">
                        ${pkg.price}
                        <span className="text-slate-500 text-base font-normal ml-1">/month</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Qualifying balance: {pkg.range}
                      </p>
                    </div>
                    <a
                      href={app.stripe_payment_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0"
                    >
                      <Button variant="gold" size="lg" className="w-full sm:w-auto">
                        <CreditCard className="h-4 w-4" />
                        Activate Subscription
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </a>
                  </div>
                  <p className="text-xs text-slate-600 mt-6 pt-5 border-t border-glass-border">
                    You&apos;ll be redirected to a secure Stripe payment page. After payment,
                    our team will activate your trade mirroring within 24 hours.
                    By proceeding, you confirm you have read our{' '}
                    <Link href="/risk-disclosure" className="text-amethyst-light hover:underline">Risk Disclosure</Link>.
                  </p>
                </div>
              )}

              {/* Application details */}
              <div className="glass rounded-2xl p-6 border border-glass-border">
                <h3 className="font-display font-semibold text-white mb-5 flex items-center justify-between">
                  Application Details
                  {app.status && (
                    <Badge variant={app.status as 'pending' | 'approved' | 'rejected'}>
                      {app.status === 'pending' ? 'Under Review' :
                       app.status === 'under_review' ? 'Under Review' :
                       app.status === 'approved' ? 'Approved' : 'Rejected'}
                    </Badge>
                  )}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { label: 'Exness UID', value: app.exness_uid },
                    { label: 'Account Number', value: app.exness_account_number },
                    { label: 'Account Balance', value: formatCurrency(app.account_balance, app.account_currency) },
                    { label: 'Currency', value: app.account_currency },
                    { label: 'Submitted', value: formatDate(app.submitted_at) },
                    {
                      label: 'Package',
                      value: pkg ? `${pkg.name} — $${pkg.price}/month` : app.status === 'approved' ? 'Determining…' : 'Pending review',
                    },
                    {
                      label: 'Payment',
                      value: app.payment_status === 'paid' ? 'Confirmed' : 'Not yet activated',
                    },
                    {
                      label: 'Mirror Status',
                      value: app.mirror_active ? 'Active' : 'Not yet active',
                    },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs font-display uppercase tracking-wider text-slate-600 mb-1">
                        {label}
                      </p>
                      <p className="text-sm text-slate-300 font-mono">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mirror active status */}
              {app.mirror_active && (
                <div className="glass rounded-2xl p-6 border border-emerald-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-semibold text-white">Mirror Status</h3>
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Live
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">
                    Trade mirroring has been active since{' '}
                    <span className="text-white font-mono">
                      {app.mirror_activated_at ? formatDate(app.mirror_activated_at) : '—'}
                    </span>.
                    All mirrored trades are visible in your Exness account history.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
