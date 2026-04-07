'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLogout } from '@/hooks/useAuth'

const nav = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/repositories', label: 'Repositories' },
  { href: '/dashboard/integrations', label: 'Integrations' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const logout = useLogout()

  return (
    <aside className="w-56 bg-white border-r flex flex-col shrink-0">
      <div className="px-5 py-6">
        <span className="font-bold text-lg tracking-tight">GitHub Auto</span>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {nav.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === href
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={() => logout.mutate()}
          className="w-full text-sm text-gray-500 hover:text-red-600 text-left px-3 py-2"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
