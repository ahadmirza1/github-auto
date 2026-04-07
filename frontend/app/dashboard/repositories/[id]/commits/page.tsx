'use client'

import { useCommits } from '@/hooks/useCommits'
import CommitSummaryCard from '@/components/commits/CommitSummaryCard'
import { useParams, useSearchParams, useRouter } from 'next/navigation'

export default function CommitsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const repositoryId = Number(params.id)
  const branch = searchParams.get('branch') ?? undefined

  const { data, isLoading, error } = useCommits(repositoryId, branch)

  if (isLoading) return <p className="text-sm text-gray-500">Loading commits…</p>
  if (error) return <p className="text-sm text-red-500">Failed to load commits.</p>

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold">Commits</h1>
        {branch && (
          <span className="text-sm bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
            {branch}
          </span>
        )}
      </div>

      {!data?.data.length && (
        <p className="text-sm text-gray-500">
          No commits yet. Push to a connected repo to see them here.
        </p>
      )}

      <div className="space-y-4">
        {data?.data.map((commit) => (
          <CommitSummaryCard key={commit.sha} commit={commit} />
        ))}
      </div>

      {data && data.last_page > 1 && (
        <div className="mt-6 text-sm text-gray-500 text-center">
          Page {data.current_page} of {data.last_page}
        </div>
      )}
    </div>
  )
}
