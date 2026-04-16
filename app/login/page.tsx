'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword(form)
    if (err) { setError(err.message); setLoading(false); return }
    router.push('/browse')
  }

  return (
    <main className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
        <Link href="/" className="text-orange-500 text-sm font-medium">← Back</Link>
        <h1 className="text-2xl font-bold text-orange-600 mt-4 mb-1">Welcome back</h1>
        <p className="text-gray-500 text-sm mb-8">Login to your Idle2Income account</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <input type="password" className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">New here? <Link href="/signup" className="text-orange-500 font-medium">Join Community</Link></p>
      </div>
    </main>
  )
}