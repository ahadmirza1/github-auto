'use client'

import { useIntegrations, useGitHubConnect, useGitHubDisconnect } from '@/hooks/useIntegrations'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { useQueryClient } from '@tanstack/react-query'

function IntegrationsContent() {
  const { data: integrations, isLoading } = useIntegrations()
  const connect = useGitHubConnect()
  const disconnect = useGitHubDisconnect()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const github = integrations?.find((i) => i.provider === 'github')

  useEffect(() => {
    const connected = searchParams.get('connected')
    const error = searchParams.get('error')
    if (connected === 'github') {
      setBanner({ type: 'success', message: 'GitHub connected successfully!' })
      queryClient.invalidateQueries({ queryKey: ['integrations'] })
      queryClient.invalidateQueries({ queryKey: ['repositories'] })
    }
    if (error === 'invalid_state') {
      setBanner({ type: 'error', message: 'OAuth state mismatch. Please try again.' })
    }
  }, [searchParams, queryClient])

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-1">Integrations</h1>
      <p className="text-sm text-gray-500 mb-6">Connect your tools to unlock the full workflow.</p>

      {banner && (
        <div
          className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium border ${
            banner.type === 'success'
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          {banner.message}
        </div>
      )}

      <div className="space-y-4">
        {/* GitHub */}
        <IntegrationCard
          name="GitHub"
          icon={<GitHubIcon />}
          description="Connect your GitHub account to sync repositories, receive webhooks, and auto-create pull requests."
          connected={!!github}
          connectedAs={github?.meta?.login}
          onConnect={() => connect.mutate()}
          onDisconnect={() => disconnect.mutate()}
          connecting={connect.isPending}
          disconnecting={disconnect.isPending}
          isLoading={isLoading}
        />

        {/* Jira — coming soon */}
        <IntegrationCard
          name="Jira"
          icon={<JiraIcon />}
          description="Link branches to Jira issues and auto-transition task status as you push, open PRs, and merge."
          connected={false}
          comingSoon
          isLoading={false}
        />

        {/* ClickUp — coming soon */}
        <IntegrationCard
          name="ClickUp"
          icon={<ClickUpIcon />}
          description="Sync ClickUp tasks with your branches. Status updates automatically as your code moves through review."
          connected={false}
          comingSoon
          isLoading={false}
        />
      </div>
    </div>
  )
}

export default function IntegrationsPage() {
  return (
    <Suspense fallback={<div className="text-sm text-gray-400">Loading…</div>}>
      <IntegrationsContent />
    </Suspense>
  )
}

interface IntegrationCardProps {
  name: string
  icon: React.ReactNode
  description: string
  connected: boolean
  connectedAs?: string
  comingSoon?: boolean
  onConnect?: () => void
  onDisconnect?: () => void
  connecting?: boolean
  disconnecting?: boolean
  isLoading: boolean
}

function IntegrationCard({
  name, icon, description, connected, connectedAs, comingSoon,
  onConnect, onDisconnect, connecting, disconnecting, isLoading,
}: IntegrationCardProps) {
  return (
    <div className="bg-white border rounded-xl p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold text-sm">{name}</span>
          {connected && (
            <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
              Connected
            </span>
          )}
          {comingSoon && (
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
              Coming soon
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
        {connected && connectedAs && (
          <p className="text-xs text-gray-400 mt-1">Connected as <span className="font-medium text-gray-600">@{connectedAs}</span></p>
        )}
      </div>

      {!comingSoon && (
        <div className="shrink-0">
          {isLoading ? (
            <div className="w-20 h-8 bg-gray-100 rounded-lg animate-pulse" />
          ) : connected ? (
            <button
              onClick={onDisconnect}
              disabled={disconnecting}
              className="text-xs text-red-500 hover:text-red-700 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 disabled:opacity-50"
            >
              {disconnecting ? 'Disconnecting…' : 'Disconnect'}
            </button>
          ) : (
            <button
              onClick={onConnect}
              disabled={connecting}
              className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 disabled:opacity-50"
            >
              {connecting ? 'Redirecting…' : 'Connect'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-gray-800">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function JiraIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path d="M11.975 0L5.988 5.988l2.994 2.994L11.975 0z" fill="#2684FF" />
      <path d="M11.975 0l5.987 5.988-2.993 2.994L11.975 0z" fill="#2684FF" />
      <path d="M11.975 24l-5.987-5.988 2.993-2.994L11.975 24z" fill="#2684FF" />
      <path d="M11.975 24l5.987-5.988-2.993-2.994L11.975 24z" fill="#2684FF" />
      <circle cx="12" cy="12" r="4" fill="#2684FF" />
    </svg>
  )
}

function ClickUpIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path d="M2 14.5L7 9.5L12 14.5L17 9.5L22 14.5" stroke="#7B68EE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
