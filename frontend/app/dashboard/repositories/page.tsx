'use client'

import { useRepositories, useSyncRepositories, useActivateWebhook, useDeactivateWebhook } from '@/hooks/useRepositories'
import Link from 'next/link'

export default function RepositoriesPage() {
  const { data, isLoading } = useRepositories()
  const sync = useSyncRepositories()
  const activateWebhook = useActivateWebhook()
  const deactivateWebhook = useDeactivateWebhook()

  if (isLoading) return <p className="text-sm text-black">Loading repositories…</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-black">Repositories</h1>
        <button
          onClick={() => sync.mutate()}
          disabled={sync.isPending}
          className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {sync.isPending ? 'Syncing…' : 'Sync'}
        </button>
      </div>

      {!data?.data.length && (
        <p className="text-sm text-black">No repositories found. Connect GitHub and sync.</p>
      )}

      <ul className="space-y-3">
        {data?.data.map((repo) => (
          <li
            key={repo.id}
            className="bg-white border border-black/10 rounded-xl px-5 py-4 flex items-center justify-between"
          >
            <div>
              <Link
                href={`/dashboard/repositories/${repo.id}/commits`}
                className="font-semibold text-black hover:underline"
              >
                {repo.full_name}
              </Link>
              <p className="text-xs text-black opacity-50 mt-0.5">
                {repo.private ? 'Private' : 'Public'} · {repo.default_branch}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {repo.webhook_active ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white font-medium bg-black px-2 py-0.5 rounded-full">
                    Webhook active
                  </span>
                  <button
                    onClick={() => deactivateWebhook.mutate(repo.id)}
                    disabled={deactivateWebhook.isPending}
                    className="text-xs border border-black/30 text-black px-3 py-1 rounded-lg hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                  >
                    Disable
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => activateWebhook.mutate(repo.id)}
                  disabled={activateWebhook.isPending}
                  className="text-xs border border-black text-black px-3 py-1 rounded-lg hover:bg-black hover:text-white transition-colors"
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
