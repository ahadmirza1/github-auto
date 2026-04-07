'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLogout } from '@/hooks/useAuth'
import { useIntegrations } from '@/hooks/useIntegrations'

const nav = [
  { href: '/dashboard', label: 'Dashboard', exact: true },
  { href: '/dashboard/repositories', label: 'Repositories', exact: false },
  { href: '/dashboard/integrations', label: 'Integrations', exact: false },
  { href: '/dashboard/guide', label: 'Guide', exact: false },
]

export default function Sidebar() {
  const pathname = usePathname()
  const logout = useLogout()
  const { data: integrations } = useIntegrations()

  const githubConnected = integrations?.some((i) => i.provider === 'github')

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <aside className="w-56 bg-white border-r border-black/10 flex flex-col shrink-0">
      <div className="px-5 py-6">
        <span className="font-bold text-lg text-black tracking-tight">GitHub Auto</span>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {nav.map(({ href, label, exact }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive(href, exact)
                ? 'bg-black text-white'
                : 'text-black hover:bg-black/5'
            }`}
          >
            {label}
            {label === 'Integrations' && !githubConnected && (
              <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" title="Action needed" />
            )}
          </Link>
        ))}
      </nav>

      {/* Connect GitHub nudge */}
      {!githubConnected && (
        <div className="mx-3 mb-3 bg-black text-white rounded-xl p-3">
          <p className="text-xs font-semibold mb-0.5">Connect GitHub</p>
          <p className="text-xs opacity-75 leading-relaxed">
            Link your account to start tracking commits.
          </p>
          <Link
            href="/dashboard/integrations"
            className="mt-2 block text-center text-xs bg-white text-black px-3 py-1.5 rounded-lg hover:bg-gray-100 font-semibold"
          >
            Connect →
          </Link>
        </div>
      )}

      <div className="p-4 border-t border-black/10">
        <button
          onClick={() => logout.mutate()}
          className="w-full text-sm text-black hover:text-red-600 text-left px-3 py-2 font-medium"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
