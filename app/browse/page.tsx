'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const categoryColors: Record<string, string> = {
  Tools: 'bg-blue-100 text-blue-700',
  Electronics: 'bg-purple-100 text-purple-700',
  Cleaning: 'bg-green-100 text-green-700',
  Decor: 'bg-pink-100 text-pink-700',
  Sports: 'bg-yellow-100 text-yellow-700',
  Kitchen: 'bg-red-100 text-red-700',
}

export default function Browse() {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [requesting, setRequesting] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUser(data.user)
      supabase.from('profiles').select('*').eq('id', data.user.id).single().then(({ data: p }) => setProfile(p))
    })
    supabase.from('items').select('*').eq('available', true).then(({ data }) => setItems(data || []))
  }, [])

  const handleRequest = async (item: any) => {
    if (!user || !profile) return
    setRequesting(item.id)
    await supabase.from('requests').insert({
      item_id: item.id,
      item_name: item.name,
      borrower_id: user.id,
      borrower_name: profile.name,
      owner_id: item.owner_id,
      status: 'requested',
    })
    setRequesting(null)
    setToast(`Request sent for "${item.name}"! Coordinate with ${item.owner_name}.`)
    setTimeout(() => setToast(''), 4000)
  }

  const categories = ['All', ...Array.from(new Set(items.map((i: any) => i.category)))]
  const filtered = filter === 'All' ? items : items.filter((i: any) => i.category === filter)

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-orange-600">Idle2Income</h1>
        <div className="flex items-center gap-4">
          {profile && <span className="text-sm text-gray-500">Hi, {profile.name} · {profile.flat_no}</span>}
          <Link href="/list" className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600">+ List Item</Link>
          <Link href="/dashboard" className="text-gray-600 text-sm font-medium hover:text-orange-600">My Items</Link>
          <button onClick={async () => { await supabase.auth.signOut(); router.push('/') }} className="text-gray-400 text-sm hover:text-red-500">Logout</button>
        </div>
      </nav>

      {toast && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 text-sm max-w-sm">
          {toast}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Available in Your Community</h2>
        <p className="text-gray-500 text-sm mb-6">GreenPark Apartments — {items.length} items listed</p>

        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${filter === cat ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-400'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item: any) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryColors[item.category] || 'bg-gray-100 text-gray-600'}`}>
                  {item.category}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>📍 Flat {item.flat_no}</span>
                <span>·</span>
                <span>{item.owner_name}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-orange-600 font-bold text-xl">₹{item.price_per_day}<span className="text-sm font-normal text-gray-400">/day</span></span>
                <button
                  onClick={() => handleRequest(item)}
                  disabled={requesting === item.id}
                  className="bg-orange-500 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 transition-colors">
                  {requesting === item.id ? 'Sending...' : 'Request'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}