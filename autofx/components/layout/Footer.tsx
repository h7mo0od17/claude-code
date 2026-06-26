import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-glass-border bg-nebula/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amethyst flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">A</span>
              </div>
              <span className="font-display font-bold text-white text-lg">AutoFX</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              A premium trade mirroring platform. Your funds remain in your
              own Exness account at all times. AutoFX does not hold or manage
              client funds.
            </p>
            <p className="text-xs text-slate-600 mt-4 font-mono">autofx.ae</p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-display font-semibold text-slate-300 mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/#how-it-works', label: 'How It Works' },
                { href: '/#packages', label: 'Packages' },
                { href: '/exness', label: 'Open Exness Account' },
                { href: '/signup', label: 'Apply for Access' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-display font-semibold text-slate-300 mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/terms', label: 'Terms of Service' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/risk-disclosure', label: 'Risk Disclosure' },
                { href: '/refund-policy', label: 'Refund Policy' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-glass-border pt-8">
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            <strong className="text-slate-500">Risk Warning:</strong> Trading
            foreign exchange and contracts for difference (CFDs) carries a high
            level of risk and may not be suitable for all investors. The high
            degree of leverage can work against you as well as for you. Past
            performance is not indicative of future results. AutoFX does not
            provide investment advice. Subscription fees do not guarantee
            profits or protect against losses.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs text-slate-600">
              © {year} AutoFX. All rights reserved.
            </p>
            <p className="text-xs text-slate-600">
              AutoFX is not a regulated financial advisor.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
