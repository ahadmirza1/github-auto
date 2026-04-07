import type { Commit } from '@/lib/api/commits'

interface Props {
  commit: Commit
}

const statusStyles = {
  pending:    'bg-black/5 text-black',
  processing: 'bg-blue-600 text-white',
  completed:  'bg-black text-white',
  failed:     'bg-red-600 text-white',
}

export default function CommitSummaryCard({ commit }: Props) {
  const summary = commit.summary
  const shortSha = commit.sha.slice(0, 7)
  const firstLine = commit.message.split('\n')[0]

  return (
    <div className="bg-white border border-black/10 rounded-xl p-5 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-sm text-black">{firstLine}</p>
          <p className="text-xs text-black opacity-50 mt-0.5">
            <code className="font-mono">{shortSha}</code> ·{' '}
            {commit.author_login ?? commit.author_name} ·{' '}
            {new Date(commit.committed_at).toLocaleString()}
          </p>
        </div>
        {summary && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${statusStyles[summary.status]}`}>
            {summary.status}
          </span>
        )}
      </div>

      {/* AI Summary */}
      {summary?.status === 'completed' && (
        <div className="space-y-2">
          <p className="text-sm text-black">{summary.summary}</p>

          {(summary.highlights?.key_changes?.length ?? 0) > 0 && (
            <ul className="text-xs text-black space-y-0.5 pl-3 border-l-2 border-black/20">
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
                  className="text-xs bg-orange-100 text-orange-900 border border-orange-300 rounded px-1.5 py-0.5 font-mono"
                >
                  {file}
                </span>
              ))}
            </div>
          )}

          {(summary.highlights?.breaking_changes?.length ?? 0) > 0 && (
            <div className="bg-red-50 border border-red-300 rounded-lg px-3 py-2">
              <p className="text-xs font-bold text-red-700 mb-1">Breaking changes</p>
              <ul className="text-xs text-red-700 space-y-0.5">
                {summary.highlights!.breaking_changes.map((bc, i) => (
                  <li key={i}>{bc}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {summary?.status === 'processing' && (
        <p className="text-xs text-black animate-pulse">Generating AI summary…</p>
      )}

      {summary?.status === 'pending' && (
        <p className="text-xs text-black opacity-50">Summary queued…</p>
      )}

      {summary?.status === 'failed' && (
        <p className="text-xs text-red-600">Summary failed: {summary.error}</p>
      )}
    </div>
  )
}
