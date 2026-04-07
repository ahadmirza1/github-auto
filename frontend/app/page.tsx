import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="border-b px-8 py-4 flex items-center justify-between">
        <span className="font-bold text-lg tracking-tight">GitHub Auto</span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-24">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full mb-6 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />
          AI-powered git workflow automation
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-gray-900 max-w-2xl leading-tight">
          Every commit, explained by AI
        </h1>
        <p className="mt-5 text-lg text-gray-700 max-w-xl">
          Push code, get instant AI summaries. Link branches to Jira or ClickUp. Auto-create PRs with smart reviewer suggestions.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <Link
            href="/register"
            className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Start for free
          </Link>
          <Link
            href="/dashboard"
            className="border border-gray-200 text-gray-700 px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            View dashboard →
          </Link>
        </div>

        {/* Feature grid */}
        <div className="mt-20 grid grid-cols-3 gap-6 max-w-3xl w-full text-left">
          {features.map((f) => (
            <div key={f.title} className="border rounded-xl p-5 bg-gray-50">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-sm text-gray-900">{f.title}</h3>
              <p className="text-xs text-gray-700 mt-1 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

const features = [
  {
    icon: '🤖',
    title: 'AI Commit Summaries',
    description: 'Every push gets an instant Claude-powered summary: what changed, what\'s risky, and any breaking changes.',
  },
  {
    icon: '🔗',
    title: 'Task Linking',
    description: 'Branch names like feature/JIRA-123 auto-link to Jira or ClickUp and update task status as you work.',
  },
  {
    icon: '📬',
    title: 'Auto PRs',
    description: 'Pushing to a feature branch auto-creates a PR with an AI description and suggests reviewers from history.',
  },
]
