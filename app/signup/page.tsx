'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Signup() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', flat_no: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })
    if (authError) { setError(authError.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        name: form.name,
        flat_no: form.flat_no,
      })
    }
    router.push('/browse')
  }

  return (
    <main className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
        <Link href="/" className="text-orange-500 text-sm font-medium">← Back</Link>
        <h1 className="text-2xl font-bold text-orange-600 mt-4 mb-1">Join Idle2Income</h1>
        <p className="text-gray-500 text-sm mb-8">GreenPark Apartments Community</p>
        <form onSubmit={handleSignup} className="space-y-4">
          <input className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Full Name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Flat No (e.g. A101)" required value={form.flat_no} onChange={e => setForm({...form, flat_no: e.target.value})} />
          <input type="email" className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <input type="password" className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Password (min 6 chars)" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50">
            {loading ? 'Creating account...' : 'Join Community'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">Already have an account? <Link href="/login" className="text-orange-500 font-medium">Login</Link></p>
      </div>
    </main>
  )
}