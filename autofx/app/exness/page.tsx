import Link from 'next/link'
import { ExternalLink, Shield, Globe, Award } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/server'

const EXNESS_LINK = 'https://one.exnessonelink.com/a/h8lfycrgnt'

const WHY_EXNESS = [
  {
    icon: Shield,
    title: 'Regulated & trusted',
    body: 'Exness is regulated by multiple tier-1 authorities including FCA, CySEC, and FSA.',
  },
  {
    icon: Globe,
    title: 'Available in 190+ countries',
    body: 'Open an account from virtually anywhere in the world with fast onboarding.',
  },
  {
    icon: Award,
    title: 'Required for AutoFX mirroring',
    body: 'AutoFX currently mirrors strategies exclusively into Exness trading accounts.',
  },
]

export default async function ExnessPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    isAdmin = profile?.role === 'admin'
  }

  return (
    <>
      <Navbar user={user} isAdmin={isAdmin} />

      <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">

          <div className="text-center mb-12">
            <p className="text-xs font-display uppercase tracking-[0.2em] text-amethyst-light mb-4">
              Step Zero
            </p>
            <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
              Open your Exness account
            </h1>
            <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
              AutoFX mirrors strategies into Exness trading accounts. If you don&apos;t
              have one yet, open one through our partner link — it takes under 10 minutes.
            </p>
          </div>

          {/* Main CTA card */}
          <div className="glass rounded-2xl p-10 border border-amethyst/20 text-center mb-10"
               style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,58,237,0.06) 0%, transparent 70%)' }}>
            <div className="w-20 h-20 rounded-2xl bg-amethyst/10 border border-amethyst/25
                           flex items-center justify-center mx-auto mb-6">
              <span className="font-display font-bold text-amethyst-light text-2xl">ex</span>
            </div>
            <h2 className="font-display font-bold text-2xl text-white mb-3">Exness</h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
              Create your Exness trading account with a minimum deposit of $500 USD
              to qualify for AutoFX mirroring.
            </p>
            <a
              href={EXNESS_LINK}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              <Button variant="primary" size="lg" className="mx-auto shadow-xl shadow-amethyst/20">
                Open Exness Account <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
            <p className="text-xs text-slate-600 mt-4">
              Opens in a new window. AutoFX may receive an affiliate commission.
            </p>
          </div>

          {/* Why Exness */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            {WHY_EXNESS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="glass rounded-xl p-5 border border-glass-border text-center">
                <div className="w-10 h-10 rounded-lg bg-amethyst/10 border border-amethyst/20
                               flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-5 w-5 text-amethyst-light" strokeWidth={1.5} />
                </div>
                <h3 className="font-display font-semibold text-white text-sm mb-2">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          {/* Steps */}
          <div className="glass rounded-2xl p-8 border border-glass-border mb-8">
            <h3 className="font-display font-semibold text-white mb-6">
              How to get started
            </h3>
            <ol className="space-y-5">
              {[
                'Click "Open Exness Account" above to register through our partner link.',
                'Complete identity verification (KYC) in your Exness Personal Area.',
                'Deposit a minimum of $500 USD into your Exness trading account.',
                'Note your Exness UID and account number from the Personal Area.',
                'Return to AutoFX and submit your application.',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="font-mono text-xs text-champagne bg-champagne/10 border border-champagne/25
                                  rounded px-2 py-0.5 shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-sm text-slate-400 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Back to apply */}
          <div className="text-center">
            <p className="text-sm text-slate-500 mb-4">
              Already have an Exness account?
            </p>
            <Link href={user ? '/apply' : '/signup'}>
              <Button variant="secondary" size="md">
                {user ? 'Submit Your Application' : 'Create AutoFX Account'} →
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
