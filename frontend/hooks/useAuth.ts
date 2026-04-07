'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMe, login, logout, register } from '@/lib/api/auth'
import { useRouter } from 'next/navigation'

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('token'),
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      queryClient.setQueryData(['me'], data.user)
      router.push('/dashboard')
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      queryClient.setQueryData(['me'], data.user)
      router.push('/dashboard')
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem('token')
      queryClient.clear()
      router.push('/login')
    },
  })
}
