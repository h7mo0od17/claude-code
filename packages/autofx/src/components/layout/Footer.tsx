import Link from "next/link"

const footerLinks = {
  Platform: [
    { href: "/pricing", label: "Pricing" },
    { href: "/faq", label: "FAQ" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ],
  Legal: [
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/risk-disclosure", label: "Risk Disclosure" },
  ],
  Account: [
    { href: "/register", label: "Register" },
    { href: "/login", label: "Login" },
    { href: "/dashboard", label: "Client Portal" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-autofx-dark-border bg-autofx-dark mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-purple-blue flex items-center justify-center">
                <span className="text-white font-black text-sm">FX</span>
              </div>
              <span className="text-xl font-black gradient-text">AutoFX</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Professional copy trading platform. Automatically copy expert forex trades with confidence.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-autofx-dark-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} AutoFX. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 text-center">
            Trading forex involves significant risk. Past performance is not indicative of future results.
          </p>
        </div>
      </div>
    </footer>
  )
}
