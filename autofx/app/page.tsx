import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/landing/Hero'
import HowItWorks from '@/components/landing/HowItWorks'
import Packages from '@/components/landing/Packages'
import Features from '@/components/landing/Features'
import CTA from '@/components/landing/CTA'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    isAdmin = profile?.role === 'admin'
  }

  return (
    <>
      <Navbar user={user} isAdmin={isAdmin} />
      <main>
        <Hero />
        <HowItWorks />
        <Packages />
        <Features />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
