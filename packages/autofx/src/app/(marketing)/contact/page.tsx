import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageSquare, Clock } from "lucide-react"

export const metadata: Metadata = { title: "Contact Us" }

export default function ContactPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="default" className="mb-4">Get in Touch</Badge>
          <h1 className="text-5xl font-black text-white mb-4">
            Contact <span className="gradient-text">Support</span>
          </h1>
          <p className="text-gray-400 text-lg">Our team is here to help you every step of the way.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: <Mail className="w-6 h-6" />, title: "Email Support", value: "support@autofx.io", desc: "General inquiries and support" },
            { icon: <MessageSquare className="w-6 h-6" />, title: "Live Chat", value: "Available in portal", desc: "Submit a ticket from your dashboard" },
            { icon: <Clock className="w-6 h-6" />, title: "Response Time", value: "< 24 hours", desc: "Priority support for Gold clients" },
          ].map((c) => (
            <div key={c.title} className="glass-card text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-purple-blue/20 border border-primary-600/30 flex items-center justify-center text-primary-400 mx-auto mb-4">
                {c.icon}
              </div>
              <h3 className="font-bold text-white mb-1">{c.title}</h3>
              <p className="text-primary-400 font-medium mb-1">{c.value}</p>
              <p className="text-sm text-gray-500">{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="glass-card">
            <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-300">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Smith"
                    className="flex h-10 w-full rounded-lg border border-autofx-dark-border bg-autofx-dark px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-300">Email</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="flex h-10 w-full rounded-lg border border-autofx-dark-border bg-autofx-dark px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">Subject</label>
                <input
                  type="text"
                  placeholder="How can we help?"
                  className="flex h-10 w-full rounded-lg border border-autofx-dark-border bg-autofx-dark px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">Message</label>
                <textarea
                  rows={5}
                  placeholder="Describe your question or issue..."
                  className="flex w-full rounded-lg border border-autofx-dark-border bg-autofx-dark px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full h-12 rounded-lg bg-gradient-purple-blue text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
