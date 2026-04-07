'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { disconnectGitHub, getGitHubRedirectUrl, getIntegrations } from '@/lib/api/integrations'

export function useIntegrations() {
  return useQuery({
    queryKey: ['integrations'],
    queryFn: getIntegrations,
  })
}

export function useGitHubConnect() {
  return useMutation({
    mutationFn: async () => {
      const { url } = await getGitHubRedirectUrl()
      window.location.href = url
    },
  })
}

export function useGitHubDisconnect() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: disconnectGitHub,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] })
      queryClient.invalidateQueries({ queryKey: ['repositories'] })
    },
  })
}
