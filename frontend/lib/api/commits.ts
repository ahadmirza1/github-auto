import client from './client'

export interface CommitHighlights {
  key_changes: string[]
  risky_files: string[]
  breaking_changes: string[]
  diff_truncated: boolean
}

export interface CommitSummary {
  id: number
  commit_id: number
  summary: string
  highlights: CommitHighlights | null
  model: string
  tokens_used: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error: string | null
  created_at: string
}

export interface Commit {
  id: number
  sha: string
  branch: string
  author_name: string
  author_email: string
  author_login: string | null
  message: string
  url: string
  committed_at: string
  summary: CommitSummary | null
}

interface Paginated<T> {
  data: T[]
  current_page: number
  last_page: number
  total: number
}

export async function getCommits(
  repositoryId: number,
  params?: { branch?: string; page?: number }
): Promise<Paginated<Commit>> {
  const res = await client.get<Paginated<Commit>>(
    `/repositories/${repositoryId}/commits`,
    { params }
  )
  return res.data
}

export async function getCommit(sha: string): Promise<Commit> {
  const res = await client.get<Commit>(`/commits/${sha}`)
  return res.data
}
