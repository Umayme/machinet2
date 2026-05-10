'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SellerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [machines, setMachines] = useState([])
  const [contacts, setContacts] = useState([])
  const [tab, setTab] = useState('listings')
  const [profileForm, setProfileForm] = useState(null)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        setAuthChecked(true)
        if (!d.user) { router.push('/login'); return }
        if (d.user.role !== 'seller') { router.push('/'); return }
        setUser(d.user)
        setProfileForm({ name: d.user.name || '', phone: d.user.phone || '', company: d.user.company || '', wilaya: d.user.wilaya || '', avatar: d.user.avatar || '' })
        if (d.user.approved) {
          Promise.all([
            fetch('/api/seller/machines').then(r => r.json()),
            fetch('/api/seller/contacts').then(r => r.json()),
          ]).then(([md, cd]) => {
            setMachines(md.machines || [])
            setContacts(cd.contacts || [])
            setLoading(false)
          }).catch(() => setLoading(false))
        } else {
          setLoading(false)
        }
      })
      .catch(() => { setAuthChecked(true); router.push('/login') })
  }, [])

  const toggleActive = async (id, current) => {
    await fetch(`/api/machines/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !current }),
    })
    setMachines(prev => prev.map(m => m.id === id ? { ...m, active: !current } : m))
  }

  const deleteMachine = async (id) => {
    if (!confirm('Supprimer cette annonce ?')) return
    const res = await fetch(`/api/machines/${id}`, { method: 'DELETE' })
    if (res.ok) setMachines(prev => prev.filter(m => m.id !== id))
  }

  if (!authChecked || loading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="skeleton h-9 rounded w-64 mb-3"></div>
          <div className="skeleton h-4 rounded w-48 mb-10"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => <div key={i} className="card p-5"><div className="skeleton h-8 rounded w-12 mx-auto mb-2"></div><div className="skeleton h-3 rounded w-24 mx-auto"></div></div>)}
          </div>
          <div className="skeleton h-10 rounded-lg w-full mb-6"></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <div key={i} className="card p-5"><div className="skeleton h-5 rounded w-3/4 mb-3"></div><div className="skeleton h-3 rounded w-1/2 mb-2"></div><div className="skeleton h-3 rounded w-1/3"></div></div>)}
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
            <div className="w-20 h-20 rounded-2xl bg-yellow-900/20 border border-yellow-700/30 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-[#141313] mb-3">Demande en cours d'examen</h1>
            <p className="text-[#8c8b8b] mb-2">Bonjour <span className="text-[#e46a33] font-semibold">{user.name}</span>,</p>
            <p className="text-[#8c8b8b] text-sm leading-relaxed mb-6">
              Votre demande d'accès en tant que <strong className="text-[#141313]">vendeur</strong> est en cours de traitement.
              Vous recevrez une confirmation par email dès que votre compte sera approuvé.
            </p>
            <div className="bg-[#f9f9f8] border border-[#e9e9e9] rounded-xl p-4 mb-6 text-left">
              <p className="text-[#8c8b8b] text-xs uppercase tracking-wider mb-2 font-semibold">Votre compte</p>
              <p className="text-[#141313] text-sm">{user.name}</p>
              <p className="text-[#8c8b8b] text-sm">{user.email}</p>
              {user.company && <p className="text-[#8c8b8b] text-xs mt-1">{user.company}</p>}
            </div>
            <div className="flex gap-3 justify-center">
              <Link href="/catalogue" className="btn-outline text-sm py-2.5 px-5">Parcourir le catalogue</Link>
              <Link href="/contact" className="btn-outline text-sm py-2.5 px-5">Contacter le support</Link>
            </div>
          </div>
          <p className="text-gray-700 text-xs mt-4">Délai d'approbation habituel : 24-48h</p>
        </div>
      </div>
    )
  }

  const totalContacts = contacts.length
  const activeMachines = machines.filter(m => m.active).length
  const verifiedMachines = machines.filter(m => m.verified).length
  const totalViews = machines.reduce((s, m) => s + (m.views || 0), 0)
  const credits = user.credits || 0

  // Simulated monthly contacts for chart (last 6 months)
  const monthlyData = [
    { month: 'Nov', val: 2 }, { month: 'Dec', val: 4 }, { month: 'Jan', val: 3 },
    { month: 'Fév', val: 7 }, { month: 'Mar', val: 5 }, { month: 'Avr', val: totalContacts > 0 ? totalContacts : 6 },
  ]
  const maxVal = Math.max(...monthlyData.map(d => d.val), 1)

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('Image trop grande (max 5 Mo)'); return }
    setAvatarUploading(true)
    const reader = new FileReader()
    reader.onload = (ev) => {
      // Compress to max 300x300 before saving
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX = 300
        let w = img.width, h = img.height
        if (w > h) { if (w > MAX) { h = h * MAX / w; w = MAX } }
        else { if (h > MAX) { w = w * MAX / h; h = MAX } }
        canvas.width = w; canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        const compressed = canvas.toDataURL('image/jpeg', 0.8)
        setProfileForm(f => ({ ...f, avatar: compressed }))
        setAvatarUploading(false)
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  }

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setProfileSaving(true)
    setProfileMsg('')
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileForm),
    })
    const data = await res.json()
    setProfileSaving(false)
    if (res.ok) {
      setUser(data.user)
      setProfileMsg('Profil mis à jour avec succès.')
      // Reload after short delay so navbar picks up new avatar
      setTimeout(() => window.location.reload(), 800)
    } else {
      setProfileMsg(data.error || 'Erreur lors de la mise à jour.')
    }
  }

  return (
    <div className="min-h-screen pt-20 bg-[#f9f9f8]">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl font-black text-[#141313]">Mon Dashboard</h1>
              <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 font-semibold">Vendeur approuvé</span>
              {credits > 0 && (
                <span className="text-xs px-3 py-1 rounded-full bg-[#e46a33] text-white font-bold shadow-sm">
                  {credits} crédits
                </span>
              )}
            </div>
            <p className="text-[#8c8b8b] text-sm">Bienvenue, <span className="text-[#e46a33] font-semibold">{user.name}</span> — Gérez vos annonces</p>
          </div>
          <Link href="/dashboard/new-listing" className="btn-primary flex items-center gap-2 px-6 py-3 text-base flex-shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Publier une annonce
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { v: machines.length, l: 'Annonces', icon: null, color: 'bg-white' },
            { v: activeMachines, l: 'Actives', icon: null, color: 'bg-white' },
            { v: verifiedMachines, l: 'Vérifiées', icon: null, color: 'bg-white' },
            { v: totalContacts, l: 'Contacts', icon: null, color: 'bg-white' },
            { v: totalViews > 0 ? totalViews : '—', l: 'Vues totales', icon: null, color: 'bg-white' },
            { v: `${credits} cr.`, l: 'Crédits', icon: null, color: 'bg-[#e46a33]/10 border-[#e46a33]/30' },
          ].map((s, i) => (
            <div key={i} className={`rounded-xl p-4 border border-[#e9e9e9] text-center ${s.color}`}>
              <p className="text-xl font-black text-[#141313]">{s.v}</p>
              <p className="text-[#8c8b8b] text-xs mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>

        {/* Chart + Quick info */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <div className="md:col-span-2 bg-white rounded-2xl border border-[#e9e9e9] p-6">
            <h3 className="font-bold text-[#141313] mb-5 text-sm">Contacts reçus — 6 derniers mois</h3>
            <div className="flex items-end gap-3 h-28">
              {monthlyData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[#8c8b8b] text-xs">{d.val}</span>
                  <div
                    className="w-full rounded-t-lg transition-all"
                    style={{ height: `${Math.round((d.val / maxVal) * 80)}px`, background: i === monthlyData.length - 1 ? '#e46a33' : '#e9e9e9', minHeight: '4px' }}
                  ></div>
                  <span className="text-[#8c8b8b] text-xs">{d.month}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#e9e9e9] p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-[#141313] mb-3 text-sm">Crédits disponibles</h3>
              <p className="text-4xl font-black text-[#e46a33] mb-1">{credits}</p>
              <p className="text-[#8c8b8b] text-xs mb-4">crédits MachiNet</p>
            </div>
            <Link href="/tarifs" className="btn-outline text-sm py-2 text-center">Acheter des crédits →</Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white border border-[#e9e9e9] rounded-xl p-1.5 w-fit">
          {[
            { id: 'listings', label: 'Mes annonces', count: machines.length, icon: null },
            { id: 'contacts', label: 'Contacts', count: totalContacts, icon: null },
            { id: 'boost', label: 'Boost', count: null, icon: null },
            { id: 'profile', label: 'Profil', count: null, icon: null },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? 'bg-[#141313] text-white shadow-sm' : 'text-[#8c8b8b] hover:text-[#141313]'}`}>
              {t.label}
              {t.count !== null && t.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === t.id ? 'bg-[#e46a33] text-white' : 'bg-[#e9e9e9] text-[#8c8b8b]'}`}>{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* LISTINGS TAB */}
        {tab === 'listings' && (
          machines.length === 0 ? (
            <div className="card p-16 text-center">
              <div className="w-14 h-14 rounded-xl bg-[#f9f9f8] border border-[#e9e9e9] mx-auto mb-4 flex items-center justify-center">
                <svg className="w-7 h-7 text-[#e46a33]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-bold text-[#141313] text-xl mb-2">Aucune annonce publiée</h3>
              <p className="text-[#8c8b8b] mb-6">Commencez par ajouter votre première machine.</p>
              <Link href="/dashboard/new-listing" className="btn-primary">Publier ma première machine</Link>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e9e9e9]">
                    <th className="text-left px-6 py-4 text-[#8c8b8b] text-xs uppercase">Machine</th>
                    <th className="text-left px-6 py-4 text-[#8c8b8b] text-xs uppercase">Catégorie</th>
                    <th className="text-right px-6 py-4 text-[#8c8b8b] text-xs uppercase">Prix</th>
                    <th className="text-center px-6 py-4 text-[#8c8b8b] text-xs uppercase">Statut</th>
                    <th className="text-center px-6 py-4 text-[#8c8b8b] text-xs uppercase">Vérifié</th>
                    <th className="text-center px-6 py-4 text-[#8c8b8b] text-xs uppercase">Contacts</th>
                    <th className="text-right px-6 py-4 text-[#8c8b8b] text-xs uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {machines.map((m, i) => (
                    <tr key={i} className="border-b border-[#e9e9e9] hover:bg-[#f9f9f8]/50">
                      <td className="px-6 py-4 text-[#141313] text-sm font-medium">{m.name}</td>
                      <td className="px-6 py-4 text-[#8c8b8b] text-sm">{m.category}</td>
                      <td className="px-6 py-4 text-right text-[#e46a33] text-sm font-bold">{m.price?.toLocaleString()} DZD</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => toggleActive(m.id, m.active)}
                          className={`text-xs px-2 py-1 rounded-full transition-all ${m.active ? 'bg-green-900/30 text-green-400 hover:bg-red-900/20 hover:text-red-400' : 'bg-gray-900/30 text-[#8c8b8b] hover:bg-green-900/20 hover:text-green-400'}`}
                          title={m.active ? 'Cliquer pour désactiver' : 'Cliquer pour activer'}
                        >
                          {m.active ? '● Active' : '○ Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${m.verified ? 'bg-[#f9f9f8] text-[#e46a33]' : 'bg-yellow-900/20 text-yellow-600'}`}>
                          {m.verified ? 'Vérifiée' : 'En attente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-[#8c8b8b] text-sm">{m.contacts?.length || 0}</td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                        <Link href={`/machines/${m.id}`} className="text-[#e46a33] hover:text-[#e46a33] text-xs">Voir →</Link>
                        <button onClick={() => deleteMachine(m.id)} className="text-red-600 hover:text-red-400 text-xs">Suppr.</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* CONTACTS TAB */}
        {tab === 'contacts' && (
          contacts.length === 0 ? (
            <div className="card p-16 text-center">
              <div className="w-14 h-14 rounded-xl bg-orange-900/20 border border-orange-800/30 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-[#141313] text-xl mb-2">Aucun message reçu</h3>
              <p className="text-[#8c8b8b]">Les acheteurs intéressés vous contacteront ici.</p>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e9e9e9]">
                    <th className="text-left px-6 py-4 text-[#8c8b8b] text-xs uppercase">Contact</th>
                    <th className="text-left px-6 py-4 text-[#8c8b8b] text-xs uppercase">Machine</th>
                    <th className="text-left px-6 py-4 text-[#8c8b8b] text-xs uppercase">Message</th>
                    <th className="text-center px-6 py-4 text-[#8c8b8b] text-xs uppercase">Statut</th>
                    <th className="text-right px-6 py-4 text-[#8c8b8b] text-xs uppercase">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c, i) => (
                    <tr key={i} className="border-b border-[#e9e9e9] hover:bg-[#f9f9f8]/50">
                      <td className="px-6 py-4">
                        <p className="text-[#141313] text-sm font-medium">{c.name}</p>
                        <p className="text-[#8c8b8b] text-xs">{c.email}</p>
                        {c.phone && <p className="text-[#434042] text-xs">{c.phone}</p>}
                      </td>
                      <td className="px-6 py-4 text-[#8c8b8b] text-sm">{c.machineName || '—'}</td>
                      <td className="px-6 py-4 text-[#8c8b8b] text-sm max-w-xs">
                        <p className="truncate">{c.message}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${c.status === 'new' ? 'bg-blue-900/30 text-blue-400' : 'bg-gray-900/30 text-[#8c8b8b]'}`}>
                          {c.status === 'new' ? 'Nouveau' : c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-[#434042] text-xs">
                        {new Date(c.createdAt).toLocaleDateString('fr-DZ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
        {/* BOOST TAB */}
        {tab === 'boost' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#e9e9e9] p-6">
              <h2 className="font-bold text-[#141313] text-lg mb-1">Boostez vos annonces</h2>
              <p className="text-[#8c8b8b] text-sm mb-6">Utilisez vos crédits pour mettre en avant vos machines et obtenir plus de leads qualifiés.</p>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { titre: 'Mise en avant 7 jours', desc: 'Votre annonce apparaît en tête des résultats de recherche', credits: 10, icon: '⭐' },
                  { titre: 'Badge Urgence', desc: 'Affiche un badge "Disponible immédiatement" sur votre annonce', credits: 5, icon: '⚡' },
                  { titre: 'Email aux acheteurs', desc: 'Envoi de votre annonce par email à 500+ acheteurs ciblés', credits: 20, icon: 'email' },
                ].map((boost, i) => (
                  <div key={i} className="border border-[#e9e9e9] rounded-xl p-5 hover:border-[#e46a33] transition-colors">
                    <div className="text-3xl mb-3">{boost.icon}</div>
                    <h3 className="font-semibold text-[#141313] mb-1">{boost.titre}</h3>
                    <p className="text-[#8c8b8b] text-xs mb-4">{boost.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#e46a33] font-black text-lg">{boost.credits} cr.</span>
                      <button className="btn-primary text-xs py-2 px-4" onClick={() => alert('Sélectionnez d\'abord une annonce à booster.')}>
                        Activer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-[#f9f9f8] rounded-xl border border-[#e9e9e9] flex items-center justify-between">
                <div>
                  <p className="text-[#141313] font-semibold text-sm">Vos crédits actuels</p>
                  <p className="text-[#8c8b8b] text-xs">Utilisez-les pour booster vos annonces</p>
                </div>
                <div className="text-right">
                  <p className="text-[#e46a33] font-black text-2xl">{credits}</p>
                  <Link href="/tarifs" className="text-[#8c8b8b] text-xs hover:text-[#e46a33]">Acheter plus →</Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {tab === 'profile' && profileForm && (
          <form onSubmit={handleProfileSave} className="max-w-xl">
            <div className="bg-white rounded-2xl border border-[#e9e9e9] p-8 space-y-5">
              <h2 className="font-bold text-[#141313] text-xl mb-2">Mon Profil</h2>

              {/* Avatar - prominent upload area */}
              <div className="flex flex-col items-center gap-3 p-6 bg-[#f9f9f8] rounded-xl border-2 border-dashed border-[#e9e9e9] hover:border-[#e46a33] transition-colors">
                <div className="w-24 h-24 rounded-2xl bg-white border-2 border-[#e9e9e9] overflow-hidden flex items-center justify-center shadow-sm">
                  {profileForm.avatar ? (
                    <img src={profileForm.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[#e46a33] font-black text-4xl">{(profileForm.name || user.name || 'U')[0]}</span>
                  )}
                </div>
                <div className="text-center">
                  <label className="btn-primary text-sm py-2 px-6 cursor-pointer inline-flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {avatarUploading ? 'Chargement...' : 'Choisir une photo'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={avatarUploading} />
                  </label>
                  <p className="text-[#8c8b8b] text-xs mt-2">JPG, PNG ou WebP · max 5 Mo</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#8c8b8b] text-sm mb-1 block">Nom complet *</label>
                  <input required className="input-dark" value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label className="text-[#8c8b8b] text-sm mb-1 block">Téléphone</label>
                  <input className="input-dark" value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="text-[#8c8b8b] text-sm mb-1 block">Entreprise</label>
                <input className="input-dark" value={profileForm.company} onChange={e => setProfileForm(f => ({ ...f, company: e.target.value }))} />
              </div>
              <div>
                <label className="text-[#8c8b8b] text-sm mb-1 block">Wilaya</label>
                <input className="input-dark" value={profileForm.wilaya} onChange={e => setProfileForm(f => ({ ...f, wilaya: e.target.value }))} />
              </div>
              <div>
                <label className="text-[#8c8b8b] text-sm mb-1 block">Email</label>
                <input className="input-dark opacity-60 cursor-not-allowed" value={user.email} disabled />
                <p className="text-[#434042] text-xs mt-1">L'email ne peut pas être modifié.</p>
              </div>
              {profileMsg && <p className={`text-sm font-medium ${profileMsg.includes('succès') ? 'text-green-600 bg-green-50 px-4 py-2 rounded-lg' : 'text-red-500 bg-red-50 px-4 py-2 rounded-lg'}`}>{profileMsg}</p>}
              <button type="submit" disabled={profileSaving} className="btn-primary w-full justify-center py-3 text-base disabled:opacity-50">
                {profileSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
