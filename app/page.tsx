import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      <nav className="flex justify-between items-center px-8 py-5 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-orange-600">Idle2Income</h1>
        <div className="flex gap-4">
          <Link href="/login" className="text-gray-600 hover:text-orange-600 font-medium">Login</Link>
          <Link href="/signup" className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 font-medium">Join Community</Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <span className="bg-orange-100 text-orange-700 text-sm font-semibold px-4 py-1 rounded-full">GreenPark Apartments — Pilot Community</span>
        <h2 className="mt-6 text-5xl font-extrabold text-gray-900 leading-tight">
          Turn Idle into Income.<br />
          <span className="text-orange-500">Borrow Instead of Buy.</span>
        </h2>
        <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto">
          Every flat has ₹10,000–₹50,000 worth of items used less than 5 times a year. Idle2Income lets you rent them to verified neighbours — safely, within walking distance.
        </p>
        <div className="mt-10 flex gap-4 justify-center">
          <Link href="/signup" className="bg-orange-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-orange-600 shadow-lg">
            Start Borrowing →
          </Link>
          <Link href="/browse" className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50">
            Browse Items
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {[
          { icon: '🔒', title: 'Verified Neighbours', desc: 'Only people in your apartment community can access listings.' },
          { icon: '📍', title: 'Zero Logistics', desc: 'Everything within walking distance. No delivery, no warehouse.' },
          { icon: '💸', title: 'Earn from Idle Items', desc: 'List your drill, projector, or party kit and earn when not in use.' },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className="font-bold text-lg text-gray-800">{f.title}</h3>
            <p className="text-gray-500 mt-2 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  )
}