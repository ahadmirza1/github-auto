import type { Commit } from '@/lib/api/commits'

interface Props {
  commit: Commit
}

const statusStyles = {
  pending: 'bg-yellow-50 text-yellow-700',
  processing: 'bg-blue-50 text-blue-700',
  completed: 'bg-green-50 text-green-700',
  failed: 'bg-red-50 text-red-700',
}

export default function CommitSummaryCard({ commit }: Props) {
  const summary = commit.summary
  const shortSha = commit.sha.slice(0, 7)
  const firstLine = commit.message.split('\n')[0]

  return (
    <div className="bg-white border rounded-xl p-5 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium text-sm">{firstLine}</p>
          <p className="text-xs text-gray-800 mt-0.5">
            <code className="font-mono">{shortSha}</code> ·{' '}
            {commit.author_login ?? commit.author_name} ·{' '}
            {new Date(commit.committed_at).toLocaleString()}
          </p>
        </div>
        {summary && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${statusStyles[summary.status]}`}
          >
            {summary.status}
          </span>
        )}
      </div>

      {/* AI Summary */}
      {summary?.status === 'completed' && (
        <div className="space-y-2">
          <p className="text-sm text-gray-900">{summary.summary}</p>

          {(summary.highlights?.key_changes?.length ?? 0) > 0 && (
            <ul className="text-xs text-gray-800 space-y-0.5 pl-3 border-l-2 border-blue-200">
              {summary.highlights!.key_changes.map((change, i) => (
                <li key={i}>{change}</li>
              ))}
            </ul>
          )}

          {(summary.highlights?.risky_files?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {summary.highlights!.risky_files.map((file) => (
                <span
                  key={file}
                  className="text-xs bg-orange-50 text-orange-700 border border-orange-200 rounded px-1.5 py-0.5 font-mono"
                >
                  {file}
                </span>
              ))}
            </div>
          )}

          {(summary.highlights?.breaking_changes?.length ?? 0) > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <p className="text-xs font-semibold text-red-700 mb-1">Breaking changes</p>
              <ul className="text-xs text-red-600 space-y-0.5">
                {summary.highlights!.breaking_changes.map((bc, i) => (
                  <li key={i}>{bc}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {summary?.status === 'processing' && (
        <p className="text-xs text-blue-600 animate-pulse">Generating AI summary…</p>
      )}

      {summary?.status === 'failed' && (
        <p className="text-xs text-red-500">Summary failed: {summary.error}</p>
      )}
    </div>
  )
}
