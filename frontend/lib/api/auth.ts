import client from './client'

export interface User {
  id: number
  name: string
  email: string
}

interface AuthResponse {
  user: User
  token: string
}

export async function register(data: {
  name: string
  email: string
  password: string
  password_confirmation: string
}): Promise<AuthResponse> {
  const res = await client.post<AuthResponse>('/auth/register', data)
  return res.data
}

export async function login(data: {
  email: string
  password: string
}): Promise<AuthResponse> {
  const res = await client.post<AuthResponse>('/auth/login', data)
  return res.data
}

export async function logout(): Promise<void> {
  await client.post('/auth/logout')
}

export async function getMe(): Promise<User> {
  const res = await client.get<User>('/auth/me')
  return res.data
}

export async function getGitHubRedirectUrl(): Promise<string> {
  const res = await client.get<{ url: string }>('/integrations/github/redirect')
  return res.data.url
}
