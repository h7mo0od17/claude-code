export function AdminTopbar({ email, role }: { email: string; role: string }) {
  return (
    <header className="h-16 bg-autofx-dark-card border-b border-autofx-dark-border flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-white">{email}</p>
          <p className="text-xs text-gray-500">{role.replace("_", " ")}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-purple-blue flex items-center justify-center text-white font-bold text-sm">
          {email.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  )
}
