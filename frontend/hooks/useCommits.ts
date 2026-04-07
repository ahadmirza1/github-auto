'use client'

import { useQuery } from '@tanstack/react-query'
import { getCommit, getCommits } from '@/lib/api/commits'

export function useCommits(repositoryId: number, branch?: string) {
  return useQuery({
    queryKey: ['commits', repositoryId, branch],
    queryFn: () => getCommits(repositoryId, { branch }),
    enabled: !!repositoryId,
  })
}

export function useCommit(sha: string) {
  return useQuery({
    queryKey: ['commit', sha],
    queryFn: () => getCommit(sha),
    enabled: !!sha,
    // Poll while summary is pending/processing
    refetchInterval: (query) => {
      const status = query.state.data?.summary?.status
      return status === 'pending' || status === 'processing' ? 3000 : false
    },
  })
}
