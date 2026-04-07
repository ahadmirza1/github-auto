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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold mb-1">Create account</h1>
        <p className="text-sm text-gray-400 mb-6">Start automating your git workflow</p>

        {register.error && (
          <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
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
              <label className="block text-sm font-medium mb-1">{label}</label>
              <input
                type={type}
                required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form[field as keyof typeof form]}
                onChange={set(field)}
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={register.isPending}
            className="w-full bg-gray-900 text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
          >
            {register.isPending ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
