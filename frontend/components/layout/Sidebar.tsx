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
    <aside className="w-56 bg-white border-r flex flex-col shrink-0">
      <div className="px-5 py-6">
        <span className="font-bold text-lg tracking-tight">GitHub Auto</span>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {nav.map(({ href, label, exact }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive(href, exact)
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-800 hover:bg-gray-100'
            }`}
          >
            {label}
            {label === 'Integrations' && !githubConnected && (
              <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0" title="Action needed" />
            )}
          </Link>
        ))}
      </nav>

      {/* Connect GitHub nudge */}
      {!githubConnected && (
        <div className="mx-3 mb-3 bg-blue-50 border border-blue-200 rounded-xl p-3">
          <p className="text-xs font-semibold text-blue-800 mb-0.5">Connect GitHub</p>
          <p className="text-xs text-blue-600 leading-relaxed">
            Link your account to start tracking commits.
          </p>
          <Link
            href="/dashboard/integrations"
            className="mt-2 block text-center text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
          >
            Connect →
          </Link>
        </div>
      )}

      <div className="p-4 border-t">
        <button
          onClick={() => logout.mutate()}
          className="w-full text-sm text-gray-700 hover:text-red-600 text-left px-3 py-2"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
