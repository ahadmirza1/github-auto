'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  activateWebhook,
  deactivateWebhook,
  getRepositories,
  syncRepositories,
} from '@/lib/api/repositories'

export function useRepositories() {
  return useQuery({
    queryKey: ['repositories'],
    queryFn: getRepositories,
  })
}

export function useSyncRepositories() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: syncRepositories,
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries({ queryKey: ['repositories'] }), 3000)
    },
  })
}

export function useActivateWebhook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: activateWebhook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] })
    },
  })
}

export function useDeactivateWebhook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deactivateWebhook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] })
    },
  })
}
