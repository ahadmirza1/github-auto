'use client'

import { useRepositories, useSyncRepositories, useActivateWebhook } from '@/hooks/useRepositories'
import Link from 'next/link'

export default function RepositoriesPage() {
  const { data, isLoading } = useRepositories()
  const sync = useSyncRepositories()
  const activateWebhook = useActivateWebhook()

  if (isLoading) return <p className="text-sm text-gray-700">Loading repositories…</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Repositories</h1>
        <button
          onClick={() => sync.mutate()}
          disabled={sync.isPending}
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {sync.isPending ? 'Syncing…' : 'Sync'}
        </button>
      </div>

      {!data?.data.length && (
        <p className="text-sm text-gray-700">
          No repositories found. Connect GitHub and sync.
        </p>
      )}

      <ul className="space-y-3">
        {data?.data.map((repo) => (
          <li
            key={repo.id}
            className="bg-white border rounded-xl px-5 py-4 flex items-center justify-between"
          >
            <div>
              <Link
                href={`/dashboard/repositories/${repo.id}/commits`}
                className="font-medium text-blue-700 hover:underline"
              >
                {repo.full_name}
              </Link>
              <p className="text-xs text-gray-600 mt-0.5">
                {repo.private ? 'Private' : 'Public'} · {repo.default_branch}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {repo.webhook_active ? (
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                  Webhook active
                </span>
              ) : (
                <button
                  onClick={() => activateWebhook.mutate(repo.id)}
                  disabled={activateWebhook.isPending}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg"
                >
                  Enable webhook
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
