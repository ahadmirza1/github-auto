'use client'

import { useMe } from '@/hooks/useAuth'
import { useRepositories } from '@/hooks/useRepositories'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: user } = useMe()
  const { data: repos } = useRepositories()

  const activeRepos = repos?.data.filter((r) => r.webhook_active) ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back{user ? `, ${user.name}` : ''}</h1>
        <p className="text-sm text-gray-500 mt-1">Your git workflow, automated.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Repositories</p>
          <p className="text-3xl font-bold mt-1">{repos?.total ?? '—'}</p>
        </div>
        <div className="bg-white border rounded-xl p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Webhooks active</p>
          <p className="text-3xl font-bold mt-1">{activeRepos.length}</p>
        </div>
        <div className="bg-white border rounded-xl p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide">AI summaries</p>
          <p className="text-3xl font-bold mt-1">—</p>
        </div>
      </div>

      {activeRepos.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Active repositories</h2>
          <ul className="space-y-2">
            {activeRepos.map((repo) => (
              <li key={repo.id}>
                <Link
                  href={`/dashboard/repositories/${repo.id}/commits`}
                  className="flex items-center justify-between bg-white border rounded-xl px-5 py-3 hover:border-blue-300 transition-colors"
                >
                  <span className="font-medium text-sm">{repo.full_name}</span>
                  <span className="text-xs text-gray-400">View commits →</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeRepos.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-700">
          Connect a repository and enable its webhook to start tracking commits.{' '}
          <Link href="/dashboard/repositories" className="font-medium underline">
            Go to Repositories →
          </Link>
        </div>
      )}
    </div>
  )
}
