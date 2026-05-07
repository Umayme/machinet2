'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const statusLabels = {
  pending: { label: 'En attente', color: 'bg-yellow-900/30 text-yellow-400' },
  confirmed: { label: 'Confirmé', color: 'bg-green-900/30 text-green-400' },
  completed: { label: 'Terminé', color: 'bg-[#f9f9f8] text-[#e46a33]' },
  cancelled: { label: 'Annulé', color: 'bg-red-900/30 text-red-400' },
}

export default function ConsultantDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [profileForm, setProfileForm] = useState(null)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')
  const [avatarUploading, setAvatarUploading] = useState(false)

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setAvatarUploading(true)
    const fd = new FormData(); fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    setAvatarUploading(false)
    if (data.url) setProfileForm(f => ({ ...f, avatar: data.url }))
  }
  const handleProfileSave = async (e) => {
    e.preventDefault(); setProfileSaving(true); setProfileMsg('')
    const res = await fetch('/api/auth/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profileForm) })
    const data = await res.json()
    setProfileSaving(false)
    if (res.ok) { setUser(data.user); setProfileMsg('Profil mis à jour.') } else { setProfileMsg(data.error || 'Erreur.') }
  }

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        setAuthChecked(true)
        if (!d.user) { router.push('/login'); return }
        if (d.user.role !== 'consultant') { router.push('/'); return }
        setUser(d.user)
        setProfileForm({ name: d.user.name || '', phone: d.user.phone || '', company: d.user.company || '', wilaya: d.user.wilaya || '', avatar: d.user.avatar || '' })
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
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="skeleton h-9 rounded w-56 mb-3"></div>
          <div className="skeleton h-4 rounded w-44 mb-10"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => <div key={i} className="card p-5"><div className="skeleton h-8 rounded w-10 mx-auto mb-2"></div><div className="skeleton h-3 rounded w-20 mx-auto"></div></div>)}
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="card p-5"><div className="skeleton h-4 rounded w-1/2 mb-3"></div><div className="skeleton h-3 rounded w-1/3"></div></div>)}
          </div>
        </div>
      </div>
    )
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
            <h1 className="text-2xl font-black text-[#141313] mb-3">Demande en cours d'examen</h1>
            <p className="text-[#8c8b8b] mb-2">Bonjour <span className="text-cyan-300 font-semibold">{user.name}</span>,</p>
            <p className="text-[#8c8b8b] text-sm leading-relaxed mb-6">
              Votre demande d'accès en tant que <strong>Expert</strong> est en cours de traitement.
              Une fois approuvé, vous aurez accès à vos demandes de consultation.
            </p>
            <div className="bg-cyan-900/10 border border-cyan-900/20 rounded-xl p-4 mb-6 text-left">
              <p className="text-[#8c8b8b] text-xs uppercase tracking-wider mb-2 font-semibold">Votre compte</p>
              <p className="text-[#141313] text-sm">{user.name}</p>
              <p className="text-[#8c8b8b] text-sm">{user.email}</p>
              {user.company && <p className="text-[#8c8b8b] text-xs mt-1">{user.company}</p>}
            </div>
            <div className="flex gap-3 justify-center">
              <Link href="/experts" className="btn-outline text-sm py-2.5 px-5">En savoir plus</Link>
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
              <h1 className="text-3xl font-black text-[#141313]">Espace Expert</h1>
              <span className="text-xs px-2 py-1 rounded-full bg-cyan-900/30 text-cyan-400 border border-cyan-800/30">Consultant approuvé</span>
            </div>
            <p className="text-[#8c8b8b] text-sm">Bienvenue, <span className="text-cyan-300">{user.name}</span> — Vos demandes de consultation</p>
          </div>
          <button onClick={() => setShowProfile(p => !p)} className="btn-outline text-sm py-2 px-4">
            {showProfile ? 'Fermer profil' : 'Mon Profil'}
          </button>
        </div>

        {/* PROFILE SECTION */}
        {showProfile && profileForm && (
          <form onSubmit={handleProfileSave} className="max-w-xl mb-10">
            <div className="card p-6 space-y-4">
              <h2 className="font-bold text-[#141313] text-lg">Mon Profil</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-cyan-900/30 border-2 border-cyan-700/40 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {profileForm.avatar ? <img src={profileForm.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <span className="text-cyan-300 font-black text-2xl">{(profileForm.name || 'C')[0]}</span>}
                </div>
                <label className="btn-outline text-xs py-1.5 px-3 cursor-pointer">
                  {avatarUploading ? 'Chargement...' : 'Changer la photo'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={avatarUploading} />
                </label>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="text-[#8c8b8b] text-sm mb-1 block">Nom *</label><input required className="input-dark" value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} /></div>
                <div><label className="text-[#8c8b8b] text-sm mb-1 block">Téléphone</label><input className="input-dark" value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} /></div>
              </div>
              <div><label className="text-[#8c8b8b] text-sm mb-1 block">Entreprise</label><input className="input-dark" value={profileForm.company} onChange={e => setProfileForm(f => ({ ...f, company: e.target.value }))} /></div>
              <div><label className="text-[#8c8b8b] text-sm mb-1 block">Wilaya</label><input className="input-dark" value={profileForm.wilaya} onChange={e => setProfileForm(f => ({ ...f, wilaya: e.target.value }))} /></div>
              {profileMsg && <p className={`text-sm ${profileMsg.includes('jour') ? 'text-green-400' : 'text-red-400'}`}>{profileMsg}</p>}
              <button type="submit" disabled={profileSaving} className="btn-primary w-full justify-center disabled:opacity-50">{profileSaving ? 'Enregistrement...' : 'Enregistrer'}</button>
            </div>
          </form>
        )}


        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { v: bookings.length, l: 'Total consultations' },
            { v: pendingBookings.length, l: 'En attente' },
            { v: confirmedBookings.length, l: 'Confirmées' },
            { v: completedBookings.length, l: 'Terminées' },
          ].map((s, i) => (
            <div key={i} className="card p-5 text-center">
              <p className="stat-value">{s.v}</p>
              <p className="text-[#8c8b8b] text-xs mt-1">{s.l}</p>
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
            <h3 className="font-bold text-[#141313] text-xl mb-2">Aucune consultation assignée</h3>
            <p className="text-[#8c8b8b]">Les demandes de consultation vous seront assignées par l'administrateur.</p>
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
                <h2 className="text-[#e46a33] font-bold text-sm uppercase tracking-wider mb-3">Terminées ({completedBookings.length})</h2>
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
  const s = statusLabels[booking.status] || { label: booking.status, color: 'bg-gray-900/30 text-[#8c8b8b]' }

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
            <h3 className="font-bold text-[#141313]">{booking.subject}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-[#8c8b8b] mb-2">
            <span>{booking.clientName}</span>
            <span>{booking.clientEmail}</span>
            {booking.clientPhone && <span>{booking.clientPhone}</span>}
          </div>
          {booking.message && (
            <p className="text-[#434042] text-sm bg-white/5 rounded-lg px-3 py-2 mt-2">{booking.message}</p>
          )}
          {booking.scheduledAt && (
            <p className="text-cyan-400 text-xs mt-2">Planifié le {new Date(booking.scheduledAt).toLocaleDateString('fr-DZ', { dateStyle: 'long' })}</p>
          )}
          {booking.notes && (
            <p className="text-[#8c8b8b] text-xs mt-2 italic">Note: {booking.notes}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 min-w-fit">
          <p className="text-[#434042] text-xs">{new Date(booking.createdAt).toLocaleDateString('fr-DZ')}</p>
          {/* Action buttons based on current status */}
          {!updating && (
            <div className="flex flex-col gap-1.5 mt-1">
              {booking.status === 'pending' && (
                <>
                  <button onClick={() => handleUpdate('confirmed')} className="text-xs px-3 py-1.5 bg-green-900/30 text-green-400 border border-green-800/40 rounded-lg hover:bg-green-900/50 transition-all whitespace-nowrap">
                    Confirmer
                  </button>
                  <button onClick={() => handleUpdate('cancelled')} className="text-xs px-3 py-1.5 bg-red-900/20 text-red-500 border border-red-900/30 rounded-lg hover:bg-red-900/40 transition-all whitespace-nowrap">
                    Annuler
                  </button>
                </>
              )}
              {booking.status === 'confirmed' && (
                <>
                  <button onClick={() => handleUpdate('completed')} className="text-xs px-3 py-1.5 bg-[#f9f9f8] text-[#e46a33] border border-[#e9e9e9] rounded-lg hover:bg-[#f9f9f8]/500 transition-all whitespace-nowrap">
                    Marquer terminé
                  </button>
                  <button onClick={() => handleUpdate('cancelled')} className="text-xs px-3 py-1.5 bg-red-900/20 text-red-500 border border-red-900/30 rounded-lg hover:bg-red-900/40 transition-all whitespace-nowrap">
                    Annuler
                  </button>
                </>
              )}
            </div>
          )}
          {updating && <span className="text-xs text-[#8c8b8b]">Mise à jour...</span>}
        </div>
      </div>
    </div>
  )
}
