'use client'

import { useMe } from '@/hooks/useAuth'
import { useRepositories } from '@/hooks/useRepositories'
import { useIntegrations } from '@/hooks/useIntegrations'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: user } = useMe()
  const { data: repos } = useRepositories()
  const { data: integrations } = useIntegrations()

  const githubConnected = integrations?.some((i) => i.provider === 'github')
  const activeRepos = repos?.data.filter((r) => r.webhook_active) ?? []
  const totalRepos = repos?.total ?? 0

  const checklist = [
    { done: !!githubConnected, label: 'Connect GitHub', href: '/dashboard/integrations' },
    { done: totalRepos > 0, label: 'Sync repositories', href: '/dashboard/repositories' },
    { done: activeRepos.length > 0, label: 'Enable webhook on a repo', href: '/dashboard/repositories' },
    { done: false, label: 'Push a commit and see the AI summary', href: '/dashboard/guide' },
  ]

  const allDone = checklist.every((c) => c.done)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">
          {user ? `Welcome, ${user.name}` : 'Dashboard'}
        </h1>
        <p className="text-sm text-black opacity-60 mt-0.5">Your git workflow, automated.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Repositories" value={totalRepos} />
        <StatCard label="Webhooks active" value={activeRepos.length} />
        <StatCard label="AI ready" value={githubConnected ? 'Yes' : 'No'} />
      </div>

      {/* Setup checklist */}
      {!allDone && (
        <div className="bg-white border border-black/10 rounded-xl p-5">
          <h2 className="text-sm font-bold text-black mb-3">Setup checklist</h2>
          <ul className="space-y-2">
            {checklist.map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    item.done ? 'border-black bg-black' : 'border-black/30'
                  }`}
                >
                  {item.done && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                {item.done ? (
                  <span className="text-sm text-black opacity-40 line-through">{item.label}</span>
                ) : (
                  <Link href={item.href} className="text-sm text-black font-semibold hover:underline">
                    {item.label} →
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <Link href="/dashboard/guide" className="mt-4 inline-block text-xs text-black opacity-50 hover:opacity-100">
            Read the full guide →
          </Link>
        </div>
      )}

      {/* Active repos */}
      {activeRepos.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-black mb-3">Active repositories</h2>
          <ul className="space-y-2">
            {activeRepos.map((repo) => (
              <li key={repo.id}>
                <Link
                  href={`/dashboard/repositories/${repo.id}/commits`}
                  className="flex items-center justify-between bg-white border border-black/10 rounded-xl px-5 py-3 hover:border-black transition-colors"
                >
                  <span className="font-medium text-sm text-black">{repo.full_name}</span>
                  <span className="text-xs text-black opacity-50">View commits →</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white border border-black/10 rounded-xl p-5">
      <p className="text-xs text-black uppercase tracking-wide font-semibold opacity-60">{label}</p>
      <p className="text-3xl font-bold text-black mt-1">{value}</p>
    </div>
  )
}
