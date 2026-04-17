'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Dashboard() {
  const router = useRouter()
  const [myItems, setMyItems] = useState<any[]>([])
  const [myRequests, setMyRequests] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [tab, setTab] = useState<'items' | 'requests'>('items')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      const uid = data.user.id
      supabase.from('profiles').select('*').eq('id', uid).single().then(({ data: p }) => setProfile(p))
      supabase.from('items').select('*').eq('owner_id', uid).then(({ data: d }) => setMyItems(d || []))
      supabase.from('requests').select('*').eq('borrower_id', uid).order('created_at', { ascending: false }).then(({ data: d }) => setMyRequests(d || []))
    })
  }, [])

  const toggleAvailability = async (item: any) => {
    await supabase.from('items').update({ available: !item.available }).eq('id', item.id)
    setMyItems(prev => prev.map(i => i.id === item.id ? { ...i, available: !i.available } : i))
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-orange-600">Idle2Income</h1>
        <div className="flex items-center gap-4">
          {profile && <span className="text-sm text-gray-500">{profile.name} · {profile.flat_no}</span>}
          <Link href="/browse" className="text-gray-600 text-sm font-medium hover:text-orange-600">Browse</Link>
          <Link href="/list" className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600">+ List Item</Link>
          <button onClick={async () => { await supabase.auth.signOut(); router.push('/') }} className="text-gray-400 text-sm hover:text-red-500">Logout</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Dashboard</h2>

        <div className="flex gap-2 mb-8">
          <button onClick={() => setTab('items')} className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${tab === 'items' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border'}`}>
            My Listed Items ({myItems.length})
          </button>
          <button onClick={() => setTab('requests')} className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${tab === 'requests' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border'}`}>
            My Requests ({myRequests.length})
          </button>
        </div>

        {tab === 'items' && (
          <div className="space-y-4">
            {myItems.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl">
                <p className="text-4xl mb-4">📦</p>
                <p className="text-gray-500">You haven't listed any items yet.</p>
                <Link href="/list" className="mt-4 inline-block bg-orange-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-orange-600">+ List your first item</Link>
              </div>
            ) : myItems.map((item: any) => (
              <div key={item.id} className="bg-white rounded-2xl p-6 flex justify-between items-center shadow-sm">
                <div>
                  <h3 className="font-bold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.category} · ₹{item.price_per_day}/day · Flat {item.flat_no}</p>
                </div>
                <button
                  onClick={() => toggleAvailability(item)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${item.available ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                  {item.available ? '✓ Available' : '✗ Unavailable'}
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'requests' && (
          <div className="space-y-4">
            {myRequests.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl">
                <p className="text-4xl mb-4">🔍</p>
                <p className="text-gray-500">You haven't requested any items yet.</p>
                <Link href="/browse" className="mt-4 inline-block bg-orange-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-orange-600">Browse items</Link>
              </div>
            ) : myRequests.map((req: any) => (
              <div key={req.id} className="bg-white rounded-2xl p-6 flex justify-between items-center shadow-sm">
                <div>
                  <h3 className="font-bold text-gray-800">{req.item_name}</h3>
                  <p className="text-sm text-gray-500 mt-1">Requested on {new Date(req.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${req.status === 'requested' ? 'bg-yellow-100 text-yellow-700' : req.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}