import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import AdminPanel from './AdminPanel'
import Navbar from '@/components/layout/Navbar'

export const metadata = { title: 'Admin — AutoFX' }

/* ------------------------------------------------------------------ */
/* Server actions — all DB writes live here, never in the client       */
/* ------------------------------------------------------------------ */

async function updateApplication(formData: FormData) {
  'use server'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const id      = formData.get('id')      as string
  const status  = formData.get('status')  as string
  const pkg     = formData.get('package') as string | null
  const link    = formData.get('stripe_payment_link') as string
  const notes   = formData.get('admin_notes') as string
  const reject  = formData.get('rejection_reason') as string

  type PriceMap = Record<string, number>
  const prices: PriceMap = { bronze: 149, silver: 399, gold: 1499 }

  await supabase
    .from('applications')
    .update({
      status,
      ...(pkg ? { package: pkg, package_price: prices[pkg] ?? null } : {}),
      stripe_payment_link: link || null,
      admin_notes: notes ?? '',
      rejection_reason: reject ?? '',
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id)

  revalidatePath('/admin')
}

async function confirmPayment(formData: FormData) {
  'use server'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const id = formData.get('id') as string

  await supabase
    .from('applications')
    .update({
      payment_status: 'paid',
      payment_confirmed_at: new Date().toISOString(),
      payment_confirmed_by: user.id,
    })
    .eq('id', id)

  revalidatePath('/admin')
}

async function toggleMirror(formData: FormData) {
  'use server'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const id     = formData.get('id')     as string
  const active = formData.get('active') === 'true'

  await supabase
    .from('applications')
    .update({
      mirror_active: active,
      mirror_activated_at: active ? new Date().toISOString() : null,
      mirror_activated_by: active ? user.id : null,
    })
    .eq('id', id)

  revalidatePath('/admin')
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Fetch all applications joined with profiles using the view
  const { data: applications } = await supabase
    .from('applications')
    .select(`
      *,
      profiles (
        full_name, email, phone, country
      )
    `)
    .order('submitted_at', { ascending: false })

  // Dashboard stats
  const total    = applications?.length ?? 0
  const pending  = applications?.filter(a => a.status === 'pending' || a.status === 'under_review').length ?? 0
  const approved = applications?.filter(a => a.status === 'approved').length ?? 0
  const active   = applications?.filter(a => a.mirror_active).length ?? 0

  return (
    <>
      <Navbar user={user} isAdmin />

      <main className="min-h-screen pt-20 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8 pt-4">
            <div>
              <h1 className="font-display font-bold text-2xl text-white">Admin Dashboard</h1>
              <p className="text-sm text-slate-500 mt-1">Manage client applications and subscriptions</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono text-amethyst-light
                            bg-amethyst/10 border border-amethyst/20">
              {total} total
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Applications', value: total,    color: 'text-white' },
              { label: 'Pending Review',      value: pending,  color: 'text-yellow-400' },
              { label: 'Approved',            value: approved, color: 'text-green-400' },
              { label: 'Mirror Active',       value: active,   color: 'text-emerald-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="glass rounded-xl p-5 border border-glass-border">
                <p className={`font-mono text-3xl font-bold ${color} mb-1`}>{value}</p>
                <p className="text-xs text-slate-500 font-display uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>

          {/* Client list + management */}
          <AdminPanel
            applications={applications ?? []}
            updateApplication={updateApplication}
            confirmPayment={confirmPayment}
            toggleMirror={toggleMirror}
          />
        </div>
      </main>
    </>
  )
}
