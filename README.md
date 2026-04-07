
## Architecture

- **Backend**: Laravel 11 + Redis + Horizon
- **Frontend**: Next.js 16 + Tailwind CSS
- **AI**: OpenAI GPT-4o-mini for commit summaries
- **Queues**: webhooks → ai → github → default

### How it works
1. Push a commit → GitHub fires webhook
2. Backend receives, verifies signature, queues ProcessPushEventJob
3. Job extracts commits, queues GenerateCommitSummaryJob per commit
4. AI summarizer fetches diff, sends to OpenAI, stores structured summary
5. Frontend polls and displays the summary card
