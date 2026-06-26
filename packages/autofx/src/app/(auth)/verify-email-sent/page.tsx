import Link from "next/link"
import { Mail } from "lucide-react"

export default function VerifyEmailSentPage() {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-purple-blue/20 border border-primary-600/30 mb-6">
        <Mail className="w-10 h-10 text-primary-400" />
      </div>
      <h1 className="text-3xl font-black text-white mb-3">Check your email</h1>
      <p className="text-gray-400 mb-6 leading-relaxed">
        We&apos;ve sent a verification link to your email address.
        Click the link to verify your account and get started.
      </p>
      <p className="text-sm text-gray-600">
        Already verified?{" "}
        <Link href="/login" className="text-primary-400 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
