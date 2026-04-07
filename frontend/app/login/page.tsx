'use client'

import { useLogin } from '@/hooks/useAuth'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const login = useLogin()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login.mutate(form)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-black/10 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-black mb-6">Sign in</h1>

        {login.error && (
          <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-300 rounded-lg px-3 py-2">
            Invalid email or password.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full border border-black/20 rounded-lg px-3 py-2 text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full border border-black/20 rounded-lg px-3 py-2 text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={login.isPending}
            className="w-full bg-black text-white rounded-lg py-2 text-sm font-semibold hover:bg-gray-800 disabled:opacity-50"
          >
            {login.isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-sm text-black mt-4 text-center">
          No account?{' '}
          <Link href="/register" className="font-semibold underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
