import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-autofx-dark flex flex-col">
      {/* Header */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 rounded-lg bg-gradient-purple-blue flex items-center justify-center">
            <span className="text-white font-black text-sm">FX</span>
          </div>
          <span className="text-xl font-black gradient-text">AutoFX</span>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className="text-xs text-gray-600">
          © {new Date().getFullYear()} AutoFX. All rights reserved.{" "}
          <Link href="/terms" className="hover:text-primary-400">Terms</Link>
          {" · "}
          <Link href="/privacy" className="hover:text-primary-400">Privacy</Link>
        </p>
      </div>
    </div>
  )
}
