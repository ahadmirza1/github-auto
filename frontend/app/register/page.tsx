'use client'

import { useRegister } from '@/hooks/useAuth'
import { useState } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const register = useRegister()
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    register.mutate(form)
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-black/10 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-black mb-1">Create account</h1>
        <p className="text-sm text-black mb-6 opacity-60">Start automating your git workflow</p>

        {register.error && (
          <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-300 rounded-lg px-3 py-2">
            Registration failed. Please check your details.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Name', field: 'name', type: 'text' },
            { label: 'Email', field: 'email', type: 'email' },
            { label: 'Password', field: 'password', type: 'password' },
            { label: 'Confirm password', field: 'password_confirmation', type: 'password' },
          ].map(({ label, field, type }) => (
            <div key={field}>
              <label className="block text-sm font-semibold text-black mb-1">{label}</label>
              <input
                type={type}
                required
                className="w-full border border-black/20 rounded-lg px-3 py-2 text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
                value={form[field as keyof typeof form]}
                onChange={set(field)}
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={register.isPending}
            className="w-full bg-black text-white rounded-lg py-2 text-sm font-semibold hover:bg-gray-800 disabled:opacity-50"
          >
            {register.isPending ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-black mt-4 text-center">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
