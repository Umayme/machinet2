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
  const [sideTab, setSideTab] = useState('overview')
  const [services, setServices] = useState([
    { id: 1, nom: 'Audit technique', desc: 'Évaluation complète de vos équipements industriels', prix: '25 000 DZD' },
    { id: 2, nom: 'Conseil achat machine', desc: 'Recommandation personnalisée selon votre budget et secteur', prix: '15 000 DZD' },
  ])
  const [newService, setNewService] = useState({ nom: '', desc: '', prix: '' })
  const [addingService, setAddingService] = useState(false)

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
  const satisfactionPct = completedBookings.length > 0 ? Math.round((completedBookings.length / bookings.length) * 100) : 0
  const estimatedRevenue = completedBookings.length * 15000 // 15000 DZD per session estimate

  const sidebarItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
    { id: 'bookings', label: 'Consultations', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, count: pendingBookings.length },
    { id: 'services', label: 'Mes Services', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
    { id: 'profile', label: 'Mon Profil', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
  ]
  return (
    <div className="min-h-screen pt-20 bg-[#f9f9f8] flex">

      {/* Sidebar */}
      <div className="fixed top-20 left-0 bottom-0 w-60 bg-white border-r border-[#e9e9e9] flex flex-col z-30 hidden md:flex">
        {/* Profile summary */}
        <div className="p-5 border-b border-[#e9e9e9]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-50 border-2 border-cyan-200 overflow-hidden flex items-center justify-center flex-shrink-0">
              {profileForm?.avatar ? <img src={profileForm.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <span className="text-cyan-600 font-black text-lg">{(user.name || 'C')[0]}</span>}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-[#141313] text-sm truncate">{user.name}</p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700 font-semibold">Expert</span>
            </div>
          </div>
        </div>
        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map(item => (
            <button key={item.id} onClick={() => setSideTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${sideTab === item.id ? 'bg-cyan-600 text-white shadow-sm' : 'text-[#8c8b8b] hover:bg-[#f9f9f8] hover:text-[#141313]'}`}>
              {item.icon}
              {item.label}
              {item.count > 0 && <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-bold ${sideTab === item.id ? 'bg-white/30 text-white' : 'bg-cyan-100 text-cyan-700'}`}>{item.count}</span>}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-[#e9e9e9]">
          <Link href="/experts" className="block text-xs text-[#8c8b8b] hover:text-[#141313] px-3 py-2 text-center transition-colors">
            Voir ma page publique →
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-60 p-6 md:p-8">

        {/* Mobile tabs fallback */}
        <div className="md:hidden flex gap-1 mb-6 bg-white border border-[#e9e9e9] rounded-xl p-1.5 overflow-x-auto">
          {sidebarItems.map(item => (
            <button key={item.id} onClick={() => setSideTab(item.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${sideTab === item.id ? 'bg-cyan-600 text-white' : 'text-[#8c8b8b]'}`}>
              {item.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {sideTab === 'overview' && (
          <div>
            <h1 className="text-2xl font-black text-[#141313] mb-6">Vue d'ensemble</h1>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {[
                { v: bookings.length, l: 'Consultations totales', color: 'text-[#141313]', bg: 'bg-white' },
                { v: pendingBookings.length, l: 'En attente', color: 'text-yellow-600', bg: 'bg-yellow-50' },
                { v: confirmedBookings.length, l: 'Confirmées', color: 'text-green-600', bg: 'bg-green-50' },
                { v: completedBookings.length, l: 'Terminées', color: 'text-cyan-600', bg: 'bg-cyan-50' },
                { v: `${satisfactionPct}%`, l: 'Taux de complétion', color: 'text-[#e46a33]', bg: 'bg-orange-50' },
                { v: estimatedRevenue > 0 ? `${(estimatedRevenue/1000).toFixed(0)}K DZD` : '—', l: 'Revenus estimés', color: 'text-green-700', bg: 'bg-green-50' },
              ].map((s, i) => (
                <div key={i} className={`${s.bg} rounded-2xl border border-[#e9e9e9] p-5 text-center`}>
                  <p className={`text-2xl font-black mb-1 ${s.color}`}>{s.v}</p>
                  <p className="text-[#8c8b8b] text-xs">{s.l}</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl border border-[#e9e9e9] p-6 mb-6">
              <h3 className="font-bold text-[#141313] text-sm mb-5">Performance consultations (6 mois)</h3>
              <div className="flex items-end gap-3 h-28">
                {[
                  { month: 'Nov', val: 1 }, { month: 'Dec', val: 2 }, { month: 'Jan', val: 0 },
                  { month: 'Fév', val: 3 }, { month: 'Mar', val: 2 }, { month: 'Avr', val: completedBookings.length },
                ].map((d, i, arr) => {
                  const maxV = Math.max(...arr.map(x => x.val), 1)
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[#8c8b8b] text-xs">{d.val}</span>
                      <div className="w-full rounded-t-lg" style={{ height: `${Math.round((d.val / maxV) * 80)}px`, background: i === arr.length - 1 ? '#06b6d4' : '#e0f7fa', minHeight: '4px' }}></div>
                      <span className="text-[#8c8b8b] text-xs">{d.month}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick pending */}
            {pendingBookings.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                  <h3 className="font-bold text-yellow-800 text-sm">{pendingBookings.length} consultation{pendingBookings.length > 1 ? 's' : ''} en attente de réponse</h3>
                </div>
                <button onClick={() => setSideTab('bookings')} className="text-sm text-yellow-700 hover:text-yellow-900 font-semibold transition-colors">
                  Voir les demandes →
                </button>
              </div>
            )}
          </div>
        )}

        {/* BOOKINGS TAB */}
        {sideTab === 'bookings' && (
          <div>
            <h1 className="text-2xl font-black text-[#141313] mb-6">Mes Consultations</h1>
            {bookings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#e9e9e9] p-16 text-center">
                <div className="w-14 h-14 rounded-xl bg-cyan-50 border border-cyan-200 mx-auto mb-4 flex items-center justify-center">
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
                    <h2 className="text-yellow-600 font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse inline-block"></span>
                      En attente ({pendingBooking