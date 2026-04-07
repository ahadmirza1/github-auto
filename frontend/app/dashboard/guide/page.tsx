export default function GuidePage() {
  return (
    <div className="max-w-2xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold mb-1">Getting started</h1>
        <p className="text-sm text-gray-500">Follow these steps to see GitHub Auto in action.</p>
      </div>

      {steps.map((step, i) => (
        <div key={i} className="flex gap-5">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </div>
            {i < steps.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-2" />}
          </div>
          <div className="pb-10 flex-1">
            <h2 className="font-semibold text-sm text-gray-900 mb-1">{step.title}</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-3">{step.description}</p>

            {step.code && (
              <pre className="bg-gray-950 text-green-400 text-xs rounded-xl px-4 py-3 overflow-x-auto font-mono leading-relaxed">
                {step.code}
              </pre>
            )}

            {step.tips && (
              <ul className="mt-3 space-y-1">
                {step.tips.map((tip, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs text-gray-500">
                    <span className="text-blue-500 mt-0.5">→</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}

      {/* FAQ */}
      <div>
        <h2 className="text-lg font-bold mb-4">FAQ</h2>
        <div className="space-y-4">
          {faq.map((item, i) => (
            <div key={i} className="border rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-900 mb-1">{item.q}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const steps = [
  {
    title: 'Connect your GitHub account',
    description: 'Go to Integrations and click "Connect" next to GitHub. You\'ll be redirected to GitHub to authorize the app. This grants read access to your repositories.',
    tips: [
      'The app only requests repo and user:email scopes',
      'You can disconnect at any time from the Integrations page',
    ],
  },
  {
    title: 'Sync your repositories',
    description: 'After connecting, go to Repositories and click "Sync". All your GitHub repos will be imported. This happens automatically on first connect.',
    tips: [
      'Re-sync anytime after creating new repos on GitHub',
      'Public and private repos are both supported',
    ],
  },
  {
    title: 'Enable webhook on a repository',
    description: 'Click "Enable webhook" on any repository. This registers a GitHub webhook that fires on every push, branch creation, and pull request event.',
    tips: [
      'A unique secret is generated per repo — GitHub signs every payload with it',
      'Only repos with active webhooks will show commit summaries',
    ],
  },
  {
    title: 'Push a commit and watch the AI summary appear',
    description: 'Push any commit to a webhook-enabled repo. Within seconds, GitHub fires the webhook, the commit is stored, and an AI summary job is queued.',
    code: `git add .
git commit -m "feat: add user authentication flow"
git push origin feature/auth`,
    tips: [
      'Summaries appear in Repositories → [repo] → Commits',
      'Risky files (migrations, auth, config) are highlighted in orange',
      'Breaking changes get a red warning block',
      'Large diffs are automatically truncated to keep costs low',
    ],
  },
  {
    title: 'Use branch naming conventions for task linking (Phase 2)',
    description: 'Name your branches with a Jira or ClickUp task key and GitHub Auto will auto-link them when you connect those integrations.',
    code: `# Jira
git checkout -b feature/PROJ-123-add-login-page

# ClickUp
git checkout -b feature/CU-abc123-user-auth`,
    tips: [
      'Jira + ClickUp integrations are coming in Phase 2',
      'Branch naming is already tracked — you\'ll see it work once connected',
    ],
  },
]

const faq = [
  {
    q: 'Why is my commit summary showing "pending" for a long time?',
    a: 'The AI summary job is queued via Horizon. Make sure the queue worker is running (php artisan horizon). If you see "failed", it usually means an invalid API key or insufficient credits.',
  },
  {
    q: 'The webhook isn\'t firing — commits aren\'t appearing.',
    a: 'Check that your tunnel (ngrok/localtunnel) is still running. Tunnels expire after a few hours. Restart the tunnel and update the webhook URL in GitHub repo Settings → Webhooks.',
  },
  {
    q: 'Can I connect multiple GitHub accounts?',
    a: 'Currently one GitHub integration per user account. Multi-account support is planned for a future release.',
  },
  {
    q: 'How much does the AI cost per commit?',
    a: 'Using claude-haiku it\'s roughly $0.0003 per commit summary. A team of 10 pushing 20 commits/day would spend ~$1.80/month on AI costs.',
  },
  {
    q: 'Is my code sent to Claude?',
    a: 'Only the git diff is sent — the changed lines, not your entire codebase. Diffs larger than 12,000 characters are truncated automatically.',
  },
]
