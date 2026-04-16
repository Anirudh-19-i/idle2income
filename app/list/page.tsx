'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const categories = ['Tools', 'Electronics', 'Cleaning', 'Decor', 'Sports', 'Kitchen', 'Other']

export default function ListItem() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [form, setForm] = useState({ name: '', category: 'Tools', price_per_day: '', })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUser(data.user)
      supabase.from('profiles').select('*').eq('id', data.user.id).single().then(({ data: p }) => setProfile(p))
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !profile) return
    setLoading(true)
    await supabase.from('items').insert({
      owner_id: user.id,
      owner_name: `${profile.name} • ${profile.flat_no}`,
      name: form.name,
      category: form.category,
      price_per_day: parseInt(form.price_per_day),
      flat_no: profile.flat_no,
      available: true,
    })
    setLoading(false)
    setSuccess(true)
    setTimeout(() => router.push('/browse'), 1500)
  }

  return (
    <main className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
        <Link href="/browse" className="text-orange-500 text-sm font-medium">← Back to Browse</Link>
        <h1 className="text-2xl font-bold text-gray-800 mt-4 mb-1">List an Item</h1>
        <p className="text-gray-500 text-sm mb-8">Make your idle items earn for you</p>

        {success ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-green-600 font-semibold text-lg">Item listed successfully!</p>
            <p className="text-gray-500 text-sm mt-2">Redirecting to browse...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Item name (e.g. Power Drill, Projector)"
              required value={form.name}
              onChange={e => setForm({...form, name: e.target.value})} />
            <select
              className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
              value={form.category}
              onChange={e => setForm({...form, category: e.target.value})}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-400 text-sm">₹</span>
              <input
                type="number" min="1"
                className="w-full border rounded-lg pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Price per day"
                required value={form.price_per_day}
                onChange={e => setForm({...form, price_per_day: e.target.value})} />
            </div>
            {profile && (
              <p className="text-xs text-gray-400 bg-gray-50 px-4 py-2 rounded-lg">
                Listed as: {profile.name} · Flat {profile.flat_no}
              </p>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50">
              {loading ? 'Listing...' : 'List Item'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}