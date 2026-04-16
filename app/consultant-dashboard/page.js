'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const statusLabels = {
  pending: { label: 'En attente', color: 'bg-yellow-900/30 text-yellow-400' },
  confirmed: { label: 'Confirmé', color: 'bg-green-900/30 text-green-400' },
  completed: { label: 'Terminé', color: 'bg-purple-900/30 text-purple-400' },
  cancelled: { label: 'Annulé', color: 'bg-red-900/30 text-red-400' },
}

export default function ConsultantDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        setAuthChecked(true)
        if (!d.user) { router.push('/login'); return }
        if (d.user.role !== 'consultant') { router.push('/'); return }
        setUser(d.user)
        if (d.user.approved) {
          fetch('/api/consultant/bookings')
            .then(r => r.json())
            .then(data => { setBookings(data.bookings || []); setLoading(false) })
            .catch(() => setLoading(false))
        } else {
          setLoading(false)
        }
      })
      .catch(() => { setAuthChecked(true); router.push('/login') })
  }, [])

  const updateBooking = async (id, status) => {
    const res = await fetch('/api/consultant/bookings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    if (res.ok) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    }
  }

  if (!authChecked || loading) {
    return <div className="min-h-screen pt-20 flex items-center justify-center"><div className="text-gray-500">Chargement...</div></div>
  }
  if (!user) return null

  if (!user.approved) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-6">
        <div className="w-full max-w-lg text-center">
          <div className="card p-12">
            <div className="w-20 h-20 rounded-2xl bg-cyan-900/20 border border-cyan-700/30 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-white mb-3">Demande en cours d'examen</h1>
            <p className="text-gray-400 mb-2">Bonjour <span className="text-cyan-300 font-semibold">{user.name}</span>,</p>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Votre demande d'accès en tant que <strong className="text-white">consultant</strong> est en cours de traitement.
              Une fois approuvé, vous aurez accès à vos demandes de consultation.
            </p>
            <div className="bg-cyan-900/10 border border-cyan-900/20 rounded-xl p-4 mb-6 text-left">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-semibold">Votre compte</p>
              <p className="text-white text-sm">{user.name}</p>
              <p className="text-gray-400 text-sm">{user.email}</p>
              {user.company && <p className="text-gray-500 text-xs mt-1">{user.company}</p>}
            </div>
            <div className="flex gap-3 justify-center">
              <Link href="/consulting" className="btn-outline text-sm py-2.5 px-5">En savoir plus</Link>
              <Link href="/contact" className="btn-outline text-sm py-2.5 px-5">Contacter le support</Link>
            </div>
          </div>
          <p className="text-gray-700 text-xs mt-4">Délai d'approbation habituel : 24-48h</p>
        </div>
      </div>
    )
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending')
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed')
  const completedBookings = bookings.filter(b => b.status === 'completed')
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled')

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black text-white">Espace Consultant</h1>
              <span className="text-xs px-2 py-1 rounded-full bg-cyan-900/30 text-cyan-400 border border-cyan-800/30">✓ Consultant approuvé</span>
            </div>
            <p className="text-gray-500 text-sm">Bienvenue, <span className="text-cyan-300">{user.name}</span> — Vos demandes de consultation</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { v: bookings.length, l: 'Total consultations', c: 'text-cyan-400' },
            { v: pendingBookings.length, l: 'En attente', c: 'text-yellow-400' },
            { v: confirmedBookings.length, l: 'Confirmées', c: 'text-green-400' },
            { v: completedBookings.length, l: 'Terminées', c: 'text-purple-400' },
          ].map((s, i) => (
            <div key={i} className="card p-5 text-center">
              <p className={`text-2xl font-black ${s.c}`}>{s.v}</p>
              <p className="text-gray-500 text-xs mt-1">{s.l}</p>
            </div>
          ))}
        </div>

        {bookings.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="w-14 h-14 rounded-xl bg-cyan-900/20 border border-cyan-800/30 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-7 h-7 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-xl mb-2">Aucune consultation assignée</h3>
            <p className="text-gray-500">Les demandes de consultation vous seront assignées par l'administrateur.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingBookings.length > 0 && (
              <section>
                <h2 className="text-yellow-400 font-bold text-sm uppercase tracking-wider mb-3">En attente ({pendingBookings.length})</h2>
                {pendingBookings.map(b => <BookingCard key={b.id} booking={b} onUpdate={updateBooking} />)}
              </section>
            )}
            {confirmedBookings.length > 0 && (
              <section>
                <h2 className="text-green-400 font-bold text-sm uppercase tracking-wider mb-3">Confirmées ({confirmedBookings.length})</h2>
                {confirmedBookings.map(b => <BookingCard key={b.id} booking={b} onUpdate={updateBooking} />)}
              </section>
            )}
            {completedBookings.length > 0 && (
              <section>
                <h2 className="text-purple-400 font-bold text-sm uppercase tracking-wider mb-3">Terminées ({completedBookings.length})</h2>
                {completedBookings.map(b => <BookingCard key={b.id} booking={b} onUpdate={updateBooking} />)}
              </section>
            )}
            {cancelledBookings.length > 0 && (
              <section>
                <h2 className="text-red-400 font-bold text-sm uppercase tracking-wider mb-3">Annulées ({cancelledBookings.length})</h2>
                {cancelledBookings.map(b => <BookingCard key={b.id} booking={b} onUpdate={updateBooking} />)}
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function BookingCard({ booking, onUpdate }) {
  const [updating, setUpdating] = useState(false)
  const s = statusLabels[booking.status] || { label: booking.status, color: 'bg-gray-900/30 text-gray-400' }

  const handleUpdate = async (status) => {
    setUpdating(true)
    await onUpdate(booking.id, status)
    setUpdating(false)
  }

  return (
    <div className="card p-5 mb-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-white font-bold">{booking.subject}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-2">
            <span>👤 {booking.clientName}</span>
            <span>✉️ {booking.clientEmail}</span>
            {booking.clientPhone && <span>📞 {booking.clientPhone}</span>}
          </div>
          {booking.message && (
            <p className="text-gray-600 text-sm bg-white/5 rounded-lg px-3 py-2 mt-2">{booking.message}</p>
          )}
          {booking.scheduledAt && (
            <p className="text-cyan-400 text-xs mt-2">📅 Planifié le {new Date(booking.scheduledAt).toLocaleDateString('fr-DZ', { dateStyle: 'long' })}</p>
          )}
          {booking.notes && (
            <p className="text-gray-500 text-xs mt-2 italic">Note: {booking.notes}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 min-w-fit">
          <p className="text-gray-600 text-xs">{new Date(booking.createdAt).toLocaleDateString('fr-DZ')}</p>
          {/* Action buttons based on current status */}
          {!updating && (
            <div className="flex flex-col gap-1.5 mt-1">
              {booking.status === 'pending' && (
                <>
                  <button onClick={() => handleUpdate('confirmed')} className="text-xs px-3 py-1.5 bg-green-900/30 text-green-400 border border-green-800/40 rounded-lg hover:bg-green-900/50 transition-all whitespace-nowrap">
                    ✓ Confirmer
                  </button>
                  <button onClick={() => handleUpdate('cancelled')} className="text-xs px-3 py-1.5 bg-red-900/20 text-red-500 border border-red-900/30 rounded-lg hover:bg-red-900/40 transition-all whitespace-nowrap">
                    ✕ Annuler
                  </button>
                </>
              )}
              {booking.status === 'confirmed' && (
                <>
                  <button onClick={() => handleUpdate('completed')} className="text-xs px-3 py-1.5 bg-purple-900/30 text-purple-400 border border-purple-800/40 rounded-lg hover:bg-purple-900/50 transition-all whitespace-nowrap">
                    ✓ Marquer terminé
                  </button>
                  <button onClick={() => handleUpdate('cancelled')} className="text-xs px-3 py-1.5 bg-red-900/20 text-red-500 border border-red-900/30 rounded-lg hover:bg-red-900/40 transition-all whitespace-nowrap">
                    ✕ Annuler
                  </button>
                </>
              )}
            </div>
          )}
          {updating && <span className="text-xs text-gray-500">Mise à jour...</span>}
        </div>
      </div>
    </div>
  )
}
