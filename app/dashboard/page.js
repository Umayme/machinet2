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

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('Image trop grande (max 5 Mo)'); return }
    setAvatarUploading(true)
    const reader = new FileReader()
    reader.onload = (ev) => {
      setProfileForm(f => ({ ...f, avatar: ev.target.result }))
      setAvatarUploading(false)
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
    } else {
      setProfileMsg(data.error || 'Erreur lors de la mise à jour.')
    }
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black text-[#141313]">Mon Dashboard</h1>
              <span className="text-xs px-2 py-1 rounded-full bg-green-900/30 text-green-400 border border-green-800/30">Vendeur approuvé</span>
            </div>
            <p className="text-[#8c8b8b] text-sm">Bienvenue, <span className="text-[#e46a33]">{user.name}</span> — Gérez vos annonces de machines</p>
          </div>
          <Link href="/dashboard/new-listing" className="btn-primary">+ Nouvelle annonce</Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { v: machines.length, l: 'Annonces totales' },
            { v: activeMachines, l: 'Annonces actives' },
            { v: verifiedMachines, l: 'Annonces vérifiées' },
            { v: totalContacts, l: 'Contacts reçus' },
          ].map((s, i) => (
            <div key={i} className="card p-5 text-center">
              <p className="stat-value">{s.v}</p>
              <p className="text-[#8c8b8b] text-xs mt-1">{s.l}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[#e9e9e9] pb-0">
          <button
            onClick={() => setTab('listings')}
            className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-all ${tab === 'listings' ? 'bg-[#141313] text-white border border-b-0 border-[#141313] rounded-t-lg' : 'text-[#8c8b8b] hover:text-[#141313]'}`}
          >
            Mes annonces ({machines.length})
          </button>
          <button
            onClick={() => setTab('contacts')}
            className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-all ${tab === 'contacts' ? 'bg-[#141313] text-white border border-b-0 border-[#141313] rounded-t-lg' : 'text-[#8c8b8b] hover:text-[#141313]'}`}
          >
            Contacts reçus {totalContacts > 0 && <span className="ml-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">{totalContacts}</span>}
          </button>
          <button
            onClick={() => setTab('profile')}
            className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-all ${tab === 'profile' ? 'bg-[#141313] text-white border border-b-0 border-[#141313] rounded-t-lg' : 'text-[#8c8b8b] hover:text-[#141313]'}`}
          >
            Mon Profil
          </button>
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
        {/* PROFILE TAB */}
        {tab === 'profile' && profileForm && (
          <form onSubmit={handleProfileSave} className="max-w-xl">
            <div className="card p-8 space-y-5">
              <h2 className="font-bold text-[#141313] text-xl mb-2">Mon Profil</h2>

              {/* Avatar */}
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-[#f9f9f8] border-2 border-[#e9e9e9] overflow-hidden flex items-center justify-center flex-shrink-0">
                  {profileForm.avatar ? (
                    <img src={profileForm.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[#e46a33] font-black text-3xl">{(profileForm.name || user.name || 'U')[0]}</span>
                  )}
                </div>
                <div>
                  <label className="btn-outline text-xs py-2 px-4 cursor-pointer">
                    {avatarUploading ? 'Chargement...' : 'Changer la photo'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={avatarUploading} />
                  </label>
                  <p className="text-[#434042] text-xs mt-1">JPG, PNG ou WebP · max 5 Mo</p>
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
              {profileMsg && <p className={`text-sm ${profileMsg.includes('succès') ? 'text-green-400' : 'text-red-400'}`}>{profileMsg}</p>}
              <button type="submit" disabled={profileSaving} className="btn-primary w-full justify-center disabled:opacity-50">
                {profileSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
