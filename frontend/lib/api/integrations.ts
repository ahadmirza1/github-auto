import client from './client'

export interface Integration {
  id: number
  provider: 'github' | 'jira' | 'clickup'
  meta: {
    login?: string
    avatar_url?: string
    name?: string
  } | null
  created_at: string
}

export async function getIntegrations(): Promise<Integration[]> {
  const res = await client.get<Integration[]>('/integrations')
  return res.data
}

export async function getGitHubRedirectUrl(): Promise<{ url: string; state: string }> {
  const res = await client.get<{ url: string; state: string }>('/integrations/github/redirect')
  return res.data
}

export async function disconnectGitHub(): Promise<void> {
  await client.delete('/integrations/github')
}
