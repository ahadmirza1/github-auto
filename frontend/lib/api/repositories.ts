import client from './client'

export interface Repository {
  id: number
  github_id: number
  name: string
  full_name: string
  default_branch: string
  html_url: string
  private: boolean
  webhook_active: boolean
  synced_at: string | null
}

interface Paginated<T> {
  data: T[]
  current_page: number
  last_page: number
  total: number
}

export async function getRepositories(): Promise<Paginated<Repository>> {
  const res = await client.get<Paginated<Repository>>('/repositories')
  return res.data
}

export async function syncRepositories(): Promise<void> {
  await client.post('/repositories/sync')
}

export async function activateWebhook(repositoryId: number): Promise<Repository> {
  const res = await client.post<Repository>(`/repositories/${repositoryId}/webhook`)
  return res.data
}
