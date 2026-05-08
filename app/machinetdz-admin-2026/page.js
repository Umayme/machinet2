'use client'
import { useState, useEffect } from 'react'

export default function SecretAdminPanel() {
  const [authed, setAuthed] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [tab, setTab] = useState('overview')

  // Data states
  const [machines, setMachines] = useState([])
  const [users, setUsers] = useState([])
  const [contacts, setContacts] = useState([])
  const [pending, setPending] = useState([])
  const [consultations, setConsultations] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [newsletter, setNewsletter] = useState([])
  const [blogs, setBlogs] = useState([])
  const [faqs, setFaqs] = useState([])
  const [prixItems, setPrixItems] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(false)
  const [blogForm, setBlogForm] = useState(null)
  const [faqForm, setFaqForm] = useState(null)
  const [prixForm, setPrixForm] = useState(null)
  const [teamForm, setTeamForm] = useState(null)
  const [packageForm, setPackageForm] = useState(null)

  // Check if already logged in as admin
  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.user?.role === 'admin') {
          setAuthed(true)
          loadData()
        }
      })
      .catch(() => {})
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [m, u, c, p, co, fb, nl, bl, fq, pr, tm, pkg] = await Promise.all([
        fetch('/api/admin/machines').then(r => r.json()),
        fetch('/api/admin/users').then(r => r.json()),
        fetch('/api/contact').then(r => r.json()),
        fetch('/api/admin/pending').then(r => r.json()),
        fetch('/api/admin/consultations').then(r => r.json()),
        fetch('/api/feedback?admin=1').then(r => r.json()),
        fetch('/api/newsletter/admin').then(r => r.json()).catch(() => ({ subscribers: [] })),
        fetch('/api/blog?admin=1').then(r => r.json()).catch(() => ({ posts: [] })),
        fetch('/api/faq?admin=1').then(r => r.json()).catch(() => ({ faqs: [] })),
        fetch('/api/prix').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/team').then(r => r.json()).catch(() => ({ members: [] })),
        fetch('/api/consulting-packages').then(r => r.json()).catch(() => ({ packages: [] })),
      ])
      setMachines(m.machines || [])
      setUsers(u.users || [])
      setContacts(c.contacts || [])
      setPending(p.users || [])
      setConsultations(co.consultations || [])
      setFeedbacks(fb.feedbacks || [])
      setNewsletter(nl.subscribers || [])
      setBlogs(bl.posts || [])
      setFaqs(fq.faqs || [])
      const allPrix = []
      for (const s of (pr.data || [])) for (const m2 of s.machines) allPrix.push({ ...m2, secteur: s.secteur })
      setPrixItems(allPrix)
      setTeamMembers(tm.members || [])
      setPackages(pkg.packages || [])
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm),
    })
    const data = await res.json()
    setLoginLoading(false)
    if (res.ok && data.user?.role === 'admin') {
      setAuthed(true)
      loadData()
    } else if (res.ok && data.user?.role !== 'admin') {
      setLoginError('Accès refusé — compte admin requis')
    } else {
      setLoginError(data.error || 'Identifiants incorrects')
    }
  }

  const approveUser = async (userId, action) => {
    const label = action === 'approve' ? 'Approuver' : 'Rejeter'
    if (!confirm(`${label} cet utilisateur ?`)) return
    const res = await fetch('/api/admin/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, action }),
    })
    if (res.ok) {
      setPending(prev => prev.filter(u => u.id !== userId))
      if (action === 'approve') {
        await fetch('/api/admin/users').then(r => r.json()).then(d => setUsers(d.users || []))
      }
    }
  }

  const toggleVerify = async (id, current) => {
    await fetch(`/api/machines/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verified: !current }),
    })
    setMachines(prev => prev.map(m => m.id === id ? { ...m, verified: !current } : m))
  }

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
    await fetch(`/api/machines/${id}`, { method: 'DELETE' })
    setMachines(prev => prev.filter(m => m.id !== id))
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setAuthed(false)
    setMachines([]); setUsers([]); setContacts([]); setPending([]); setConsultations([]); setFeedbacks([]); setNewsletter([]); setBlogs([]); setFaqs([]); setPrixItems([]); setTeamMembers([]); setPackages([])
  }

  const updateConsultation = async (id, fields) => {
    const res = await fetch('/api/admin/consultations', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...fields }),
    })
    if (res.ok) {
      setConsultations(prev => prev.map(c => c.id === id ? { ...c, ...fields } : c))
    }
  }

  // ---------- LOGIN SCREEN ----------
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9f8] px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#f9f9f8] border border-[#e9e9e9] mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#e46a33]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-[#141313]">Espace Administrateur</h1>
            <p className="text-[#434042] text-sm mt-1">MachiNet — Accès restreint</p>
          </div>
          <form onSubmit={handleLogin} className="card p-8 space-y-5">
            <div>
              <label className="block text-[#8c8b8b] text-sm mb-2">Email admin</label>
              <input
                required type="email" className="input-dark h-12"
                placeholder="admin@machinetdz.com"
                value={loginForm.email}
                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[#8c8b8b] text-sm mb-2">Mot de passe</label>
              <input
                required type="password" className="input-dark h-12"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
              />
            </div>
            {loginError && <p className="text-red-400 text-sm bg-red-900/20 border border-red-900/30 rounded-lg px-4 py-2">{loginError}</p>}
            <button
              type="submit" disabled={loginLoading}
              className="btn-primary w-full justify-center h-12 text-base disabled:opacity-50"
            >
              {loginLoading ? 'Vérification...' : 'Accéder au panneau admin'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ---------- ADMIN PANEL ----------
  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble' },
    { id: 'pending', label: `Demandes${pending.length > 0 ? ` (${pending.length})` : ''}` },
    { id: 'machines', label: 'Annonces' },
    { id: 'users', label: 'Utilisateurs' },
    { id: 'consultations', label: 'Consultations' },
    { id: 'contacts', label: 'Contacts' },
    { id: 'feedbacks', label: `Avis${feedbacks.filter(f => !f.approved).length > 0 ? ` (${feedbacks.filter(f => !f.approved).length})` : ''}` },
    { id: 'newsletter', label: 'Newsletter' },
    { id: 'blog', label: 'Blog & Guides' },
    { id: 'faq', label: 'FAQ' },
    { id: 'prix', label: 'Prix Marché' },
    { id: 'team', label: 'Équipe' },
    { id: 'packages', label: 'Packages Consulting' },
  ]

  const saveBlog = async (data) => {
    const method = data.id ? 'PATCH' : 'POST'
    const res = await fetch('/api/blog', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    if (res.ok) {
      setBlogForm(null)
      const d = await fetch('/api/blog?admin=1').then(r => r.json())
      setBlogs(d.posts || [])
    }
  }
  const deleteBlog = async (id) => {
    if (!confirm('Supprimer cet article ?')) return
    await fetch('/api/blog', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setBlogs(prev => prev.filter(b => b.id !== id))
  }
  const toggleBlogPublished = async (id, current) => {
    await fetch('/api/blog', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, published: !current }) })
    setBlogs(prev => prev.map(b => b.id === id ? { ...b, published: !current ? 1 : 0 } : b))
  }
  const savePackage = async (data) => {
    const method = data.id ? 'PATCH' : 'POST'
    const payload = { ...data, inclus: (data.inclus || '').split('\n').map(s => s.trim()).filter(Boolean) }
    const res = await fetch('/api/consulting-packages', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      setPackageForm(null)
      const d = await fetch('/api/consulting-packages').then(r => r.json())
      setPackages(d.packages || [])
    }
  }
  const deletePackage = async (id) => {
    if (!confirm('Supprimer ce package ?')) return
    await fetch('/api/consulting-packages', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setPackages(prev => prev.filter(p => p.id !== id))
  }

  const saveTeam = async (data) => {
    const method = data.id ? 'PATCH' : 'POST'
    const res = await fetch('/api/team', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    if (res.ok) {
      setTeamForm(null)
      const d = await fetch('/api/team').then(r => r.json())
      setTeamMembers(d.members || [])
    }
  }
  const deleteTeam = async (id) => {
    if (!confirm('Supprimer ce membre ?')) return
    await fetch('/api/team', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setTeamMembers(prev => prev.filter(t => t.id !== id))
  }

  const savePrix = async (data) => {
    const method = data.id ? 'PATCH' : 'POST'
    const res = await fetch('/api/prix', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    if (res.ok) {
      setPrixForm(null)
      const d = await fetch('/api/prix').then(r => r.json())
      const flat = []
      for (const s of (d.data || [])) for (const m2 of s.machines) flat.push({ ...m2, secteur: s.secteur })
      setPrixItems(flat)
    }
  }
  const deletePrix = async (id) => {
    if (!confirm('Supprimer cette donnée ?')) return
    await fetch('/api/prix', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setPrixItems(prev => prev.filter(p => p.id !== id))
  }

  const saveFaq = async (data) => {
    const method = data.id ? 'PATCH' : 'POST'
    const res = await fetch('/api/faq', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    if (res.ok) {
      setFaqForm(null)
      const d = await fetch('/api/faq?admin=1').then(r => r.json())
      setFaqs(d.faqs || [])
    }
  }
  const deleteFaq = async (id) => {
    if (!confirm('Supprimer cette FAQ ?')) return
    await fetch('/api/faq', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setFaqs(prev => prev.filter(f => f.id !== id))
  }

  const approveFeedback = async (id, approved) => {
    await fetch('/api/feedback', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, approved }) })
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, approved: approved ? 1 : 0 } : f))
  }

  const deleteFeedback = async (id) => {
    if (!confirm('Supprimer cet avis ?')) return
    await fetch('/api/feedback', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setFeedbacks(prev => prev.filter(f => f.id !== id))
  }

  const approvedSellers = users.filter(u => u.role === 'seller' && u.approved)
  const approvedConsultants = users.filter(u => u.role === 'consultant' && u.approved)
  const pendingSellers = pending.filter(u => u.role === 'seller')
  const pendingConsultants = pending.filter(u => u.role === 'consultant')

  return (
    <div className="min-h-screen bg-[#f9f9f8]">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 border-b border-[#e9e9e9] px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#e46a33] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <span className="text-[#141313] font-bold text-sm">MachiNet Admin</span>
          <span className="text-xs text-[#e46a33] bg-[#f9f9f8] border border-[#e9e9e9] px-2 py-0.5 rounded-full">Panneau secret</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={loadData} className="text-xs text-[#8c8b8b] hover:text-white transition-colors border border-[#e9e9e9] px-3 py-1 rounded-lg">
            ↻ Actualiser
          </button>
          <button onClick={handleLogout} className="text-xs text-red-500 hover:text-red-400 transition-colors">
            Déconnexion
          </button>
        </div>
      </div>

      <div className="pt-14 flex">
        {/* Sidebar */}
        <div className="fixed left-0 top-14 bottom-0 w-56 bg-[#141313] p-3 overflow-y-auto">
          <div className="px-3 py-2 mb-2">
            <p className="text-white/30 text-xs uppercase tracking-wider font-semibold">Navigation</p>
          </div>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm mb-1 transition-all ${tab === t.id ? 'bg-[#e46a33] text-white font-semibold' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="ml-56 flex-1 p-8">
          {loading ? (
            <div className="text-center py-20 text-[#8c8b8b]">Chargement...</div>
          ) : (
            <>
              {/* OVERVIEW TAB */}
              {tab === 'overview' && (
                <div>
                  <h1 className="text-2xl font-black text-[#141313] mb-2">Vue d'ensemble</h1>
                  <p className="text-[#8c8b8b] text-sm mb-8">Tableau de bord MachiNet</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                      { v: machines.length, l: 'Annonces totales', c: 'text-[#e46a33]', bg: 'bg-orange-50 border-orange-200' },
                      { v: machines.filter(m => m.verified).length, l: 'Annonces vérifiées', c: 'text-green-700', bg: 'bg-green-50 border-green-200' },
                      { v: users.length, l: 'Utilisateurs', c: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
                      { v: pending.length, l: 'En attente', c: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' },
                      { v: approvedSellers.length, l: 'Vendeurs', c: 'text-[#e46a33]', bg: 'bg-white border-[#e9e9e9]' },
                      { v: approvedConsultants.length, l: 'Consultants', c: 'text-cyan-700', bg: 'bg-cyan-50 border-cyan-200' },
                      { v: consultations.length, l: 'Consultations', c: 'text-orange-700', bg: 'bg-white border-[#e9e9e9]' },
                      { v: contacts.length, l: 'Contacts', c: 'text-pink-700', bg: 'bg-pink-50 border-pink-200' },
                    ].map((s, i) => (
                      <div key={i} className={`rounded-2xl border p-5 text-center ${s.bg}`}>
                        <p className={`text-2xl font-black ${s.c}`}>{s.v}</p>
                        <p className="text-[#8c8b8b] text-xs mt-1">{s.l}</p>
                      </div>
                    ))}
                  </div>

                  {pending.length > 0 && (
                    <div className="card p-6 border border-yellow-900/30 bg-yellow-900/5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                        <h3 className="text-[#141313] font-bold">{pending.length} demande{pending.length > 1 ? 's' : ''} en attente d'approbation</h3>
                      </div>
                      <p className="text-[#8c8b8b] text-sm mb-4">
                        {pendingSellers.length > 0 && `${pendingSellers.length} vendeur${pendingSellers.length > 1 ? 's' : ''}`}
                        {pendingSellers.length > 0 && pendingConsultants.length > 0 && ' · '}
                        {pendingConsultants.length > 0 && `${pendingConsultants.length} consultant${pendingConsultants.length > 1 ? 's' : ''}`}
                      </p>
                      <button onClick={() => setTab('pending')} className="btn-primary text-sm py-2">
                        Voir les demandes →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* PENDING TAB */}
              {tab === 'pending' && (
                <div>
                  <h1 className="text-2xl font-black text-[#141313] mb-2">Demandes en attente</h1>
                  <p className="text-[#8c8b8b] text-sm mb-8">Approuver ou rejeter les demandes de vendeurs et consultants</p>

                  {pending.length === 0 ? (
                    <div className="card p-16 text-center">
                      <h3 className="text-[#141313] font-bold text-lg mb-2">Aucune demande en attente</h3>
                      <p className="text-[#8c8b8b] text-sm">Toutes les demandes ont été traitées.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Sellers */}
                      {pendingSellers.length > 0 && (
                        <div>
                          <h2 className="text-[#e46a33] font-bold text-sm uppercase tracking-wider mb-3">
                            Vendeurs ({pendingSellers.length})
                          </h2>
                          {pendingSellers.map((u) => (
                            <div key={u.id} className="card p-5 flex items-center justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <p className="text-[#141313] font-bold">{u.name}</p>
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#f9f9f8] text-[#e46a33]">Vendeur</span>
                                </div>
                                <p className="text-[#8c8b8b] text-sm">{u.email}</p>
                                <div className="flex gap-4 mt-2 text-xs text-[#434042]">
                                  {u.company && <span>{u.company}</span>}
                                  {u.wilaya && <span>{u.wilaya}</span>}
                                  {u.phone && <span>{u.phone}</span>}
                                  {u.sector && <span>{u.sector}</span>}
                                  <span>{new Date(u.createdAt).toLocaleDateString('fr-DZ')}</span>
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <button
                                  onClick={() => approveUser(u.id, 'approve')}
                                  className="px-4 py-2 bg-green-900/30 text-green-400 border border-green-800/40 rounded-lg text-sm hover:bg-green-900/50 transition-all"
                                >
                                  Approuver
                                </button>
                                <button
                                  onClick={() => approveUser(u.id, 'reject')}
                                  className="px-4 py-2 bg-red-900/20 text-red-500 border border-red-900/30 rounded-lg text-sm hover:bg-red-900/40 transition-all"
                                >
                                  Rejeter
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Consultants */}
                      {pendingConsultants.length > 0 && (
                        <div>
                          <h2 className="text-cyan-400 font-bold text-sm uppercase tracking-wider mb-3 mt-6">
                            Consultants ({pendingConsultants.length})
                          </h2>
                          {pendingConsultants.map((u) => (
                            <div key={u.id} className="card p-5 flex items-center justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <p className="text-[#141313] font-bold">{u.name}</p>
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-900/30 text-cyan-400">Consultant</span>
                                </div>
                                <p className="text-[#8c8b8b] text-sm">{u.email}</p>
                                <div className="flex gap-4 mt-2 text-xs text-[#434042]">
                                  {u.company && <span>{u.company}</span>}
                                  {u.wilaya && <span>{u.wilaya}</span>}
                                  {u.phone && <span>{u.phone}</span>}
                                  {u.sector && <span>{u.sector}</span>}
                                  <span>{new Date(u.createdAt).toLocaleDateString('fr-DZ')}</span>
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <button
                                  onClick={() => approveUser(u.id, 'approve')}
                                  className="px-4 py-2 bg-green-900/30 text-green-400 border border-green-800/40 rounded-lg text-sm hover:bg-green-900/50 transition-all"
                                >
                                  Approuver
                                </button>
                                <button
                                  onClick={() => approveUser(u.id, 'reject')}
                                  className="px-4 py-2 bg-red-900/20 text-red-500 border border-red-900/30 rounded-lg text-sm hover:bg-red-900/40 transition-all"
                                >
                                  Rejeter
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* MACHINES TAB */}
              {tab === 'machines' && (
                <div>
                  <h1 className="text-2xl font-black text-[#141313] mb-2">Annonces</h1>
                  <p className="text-[#8c8b8b] text-sm mb-8">Gérer toutes les annonces de machines</p>
                  <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[#e9e9e9]">
                            <th className="text-left px-4 py-3 text-[#8c8b8b] text-xs uppercase">Machine</th>
                            <th className="text-left px-4 py-3 text-[#8c8b8b] text-xs uppercase">Vendeur</th>
                            <th className="text-right px-4 py-3 text-[#8c8b8b] text-xs uppercase">Prix</th>
                            <th className="text-center px-4 py-3 text-[#8c8b8b] text-xs uppercase">Actif</th>
                            <th className="text-center px-4 py-3 text-[#8c8b8b] text-xs uppercase">Vérifié</th>
                            <th className="text-center px-4 py-3 text-[#8c8b8b] text-xs uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {machines.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-10 text-[#434042]">Aucune annonce</td></tr>
                          ) : machines.map((m, i) => (
                            <tr key={i} className="border-b border-[#e9e9e9] hover:bg-[#f9f9f8]/50">
                              <td className="px-4 py-3 text-[#141313] text-sm">{m.name}</td>
                              <td className="px-4 py-3 text-[#8c8b8b] text-xs">{m.seller?.name}<br /><span className="text-[#434042]">{m.seller?.email}</span></td>
                              <td className="px-4 py-3 text-right text-[#e46a33] text-sm">{m.price?.toLocaleString()} DZD</td>
                              <td className="px-4 py-3 text-center">
                                <button onClick={() => toggleActive(m.id, m.active)}
                                  className={`text-xs px-2 py-1 rounded-full transition-all ${m.active ? 'bg-green-900/30 text-green-400' : 'bg-gray-900/30 text-[#8c8b8b]'}`}>
                                  {m.active ? 'Oui' : 'Non'}
                                </button>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button onClick={() => toggleVerify(m.id, m.verified)}
                                  className={`text-xs px-2 py-1 rounded-full transition-all ${m.verified ? 'bg-[#f9f9f8] text-[#e46a33]' : 'bg-gray-900/30 text-[#8c8b8b]'}`}>
                                  {m.verified ? 'Oui' : 'Non'}
                                </button>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button onClick={() => deleteMachine(m.id)} className="text-red-500 hover:text-red-400 text-xs">Suppr.</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* USERS TAB */}
              {tab === 'users' && (
                <div>
                  <h1 className="text-2xl font-black text-[#141313] mb-2">Utilisateurs</h1>
                  <p className="text-[#8c8b8b] text-sm mb-8">Tous les comptes enregistrés</p>
                  <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[#e9e9e9]">
                            <th className="text-left px-4 py-3 text-[#8c8b8b] text-xs uppercase">Nom</th>
                            <th className="text-left px-4 py-3 text-[#8c8b8b] text-xs uppercase">Email</th>
                            <th className="text-left px-4 py-3 text-[#8c8b8b] text-xs uppercase">Rôle</th>
                            <th className="text-center px-4 py-3 text-[#8c8b8b] text-xs uppercase">Approuvé</th>
                            <th className="text-left px-4 py-3 text-[#8c8b8b] text-xs uppercase">Wilaya</th>
                            <th className="text-center px-4 py-3 text-[#8c8b8b] text-xs uppercase">Annonces</th>
                            <th className="text-right px-4 py-3 text-[#8c8b8b] text-xs uppercase">Inscrit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((u, i) => (
                            <tr key={i} className="border-b border-[#e9e9e9] hover:bg-[#f9f9f8]/50">
                              <td className="px-4 py-3 text-[#141313] text-sm">{u.name}</td>
                              <td className="px-4 py-3 text-[#8c8b8b] text-xs">{u.email}</td>
                              <td className="px-4 py-3">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  u.role === 'admin' ? 'bg-red-900/30 text-red-400' :
                                  u.role === 'seller' ? 'bg-[#f9f9f8] text-[#e46a33]' :
                                  u.role === 'consultant' ? 'bg-cyan-900/30 text-cyan-400' :
                                  'bg-blue-900/30 text-blue-400'
                                }`}>{u.role}</span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${u.approved ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-500'}`}>
                                  {u.approved ? 'Oui' : 'Non'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-[#8c8b8b] text-xs">{u.wilaya || '—'}</td>
                              <td className="px-4 py-3 text-center text-[#e46a33] text-sm">{u._count?.machines || 0}</td>
                              <td className="px-4 py-3 text-right text-[#434042] text-xs">{new Date(u.createdAt).toLocaleDateString('fr-DZ')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* CONSULTATIONS TAB */}
              {tab === 'consultations' && (
                <div>
                  <h1 className="text-2xl font-black text-[#141313] mb-2">Consultations</h1>
                  <p className="text-[#8c8b8b] text-sm mb-8">Demandes de conseil — assigner un consultant et mettre à jour le statut</p>
                  {consultations.length === 0 ? (
                    <div className="card p-16 text-center">
                      <h3 className="text-[#141313] font-bold text-lg mb-2">Aucune consultation</h3>
                      <p className="text-[#8c8b8b] text-sm">Les demandes de consultation apparaîtront ici.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {consultations.map((c) => {
                        const assignedConsultant = users.find(u => u.id === c.consultantId)
                        return (
                          <div key={c.id} className="card p-5">
                            <div className="flex items-start justify-between gap-6">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-[#141313] font-bold">{c.subject}</h3>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    c.status === 'confirmed' ? 'bg-green-900/30 text-green-400' :
                                    c.status === 'completed' ? 'bg-[#f9f9f8] text-[#e46a33]' :
                                    c.status === 'cancelled' ? 'bg-red-900/30 text-red-400' :
                                    'bg-yellow-900/30 text-yellow-400'
                                  }`}>{c.status}</span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-xs text-[#8c8b8b] mb-1">
                                  <span>{c.clientName}</span>
                                  <span>{c.clientEmail}</span>
                                  {c.clientPhone && <span>{c.clientPhone}</span>}
                                  <span>{new Date(c.createdAt).toLocaleDateString('fr-DZ')}</span>
                                </div>
                                {c.message && <p className="text-[#434042] text-xs bg-white/5 rounded px-3 py-1.5 mt-2">{c.message}</p>}
                                {c.notes && <p className="text-[#8c8b8b] text-xs italic mt-1">Note: {c.notes}</p>}
                              </div>
                              <div className="flex flex-col gap-2 min-w-52">
                                {/* Assign consultant */}
                                <div>
                                  <label className="text-[#434042] text-xs mb-1 block">Consultant assigné</label>
                                  <select
                                    className="w-full bg-white border border-[#e9e9e9] text-[#141313] text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#e46a33]"
                                    value={c.consultantId || ''}
                                    onChange={e => updateConsultation(c.id, { consultantId: e.target.value || null })}
                                  >
                                    <option value="">— Non assigné</option>
                                    {approvedConsultants.map(con => (
                                      <option key={con.id} value={con.id}>{con.name}</option>
                                    ))}
                                  </select>
                                </div>
                                {/* Status update */}
                                <div>
                                  <label className="text-[#434042] text-xs mb-1 block">Statut</label>
                                  <select
                                    className="w-full bg-white border border-[#e9e9e9] text-[#141313] text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#e46a33]"
                                    value={c.status}
                                    onChange={e => updateConsultation(c.id, { status: e.target.value })}
                                  >
                                    <option value="pending">En attente</option>
                                    <option value="confirmed">Confirmé</option>
                                    <option value="completed">Terminé</option>
                                    <option value="cancelled">Annulé</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* FEEDBACKS TAB */}
              {tab === 'feedbacks' && (
                <div>
                  <h1 className="text-2xl font-black text-[#141313] mb-2">Avis & Témoignages</h1>
                  <p className="text-[#8c8b8b] text-sm mb-8">Modérer les avis soumis par les utilisateurs</p>
                  {feedbacks.length === 0 ? (
                    <div className="card p-16 text-center">
                      <h3 className="text-[#141313] font-bold text-lg mb-2">Aucun avis</h3>
                      <p className="text-[#8c8b8b] text-sm">Les témoignages soumis apparaîtront ici.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {feedbacks.map(f => (
                        <div key={f.id} className={`card p-5 ${!f.approved ? 'border-yellow-900/30' : ''}`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <p className="text-[#141313] font-bold">{f.nom}</p>
                                {f.poste && <span className="text-[#8c8b8b] text-xs">{f.poste}</span>}
                                {f.wilaya && <span className="text-[#434042] text-xs">{f.wilaya}</span>}
                                <span className="text-[#e46a33] font-bold">{f.note}/5</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${f.approved ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                                  {f.approved ? 'Publié' : 'En attente'}
                                </span>
                              </div>
                              <p className="text-[#8c8b8b] text-sm italic">"{f.texte}"</p>
                              <p className="text-[#434042] text-xs mt-1">{new Date(f.createdAt).toLocaleDateString('fr-DZ')}</p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <button onClick={() => approveFeedback(f.id, !f.approved)}
                                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${f.approved ? 'border-gray-700 text-[#8c8b8b] hover:text-white' : 'border-green-800/40 bg-green-900/20 text-green-400 hover:bg-green-900/40'}`}>
                                {f.approved ? 'Dépublier' : 'Approuver'}
                              </button>
                              <button onClick={() => deleteFeedback(f.id)} className="text-red-500 hover:text-red-400 text-xs px-3 py-1.5">Suppr.</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* NEWSLETTER TAB */}
              {tab === 'newsletter' && (
                <div>
                  <h1 className="text-2xl font-black text-[#141313] mb-2">Newsletter</h1>
                  <p className="text-[#8c8b8b] text-sm mb-8">{newsletter.length} abonné{newsletter.length !== 1 ? 's' : ''}</p>
                  <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[#e9e9e9]">
                            <th className="text-left px-4 py-3 text-[#8c8b8b] text-xs uppercase">#</th>
                            <th className="text-left px-4 py-3 text-[#8c8b8b] text-xs uppercase">Email</th>
                            <th className="text-right px-4 py-3 text-[#8c8b8b] text-xs uppercase">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {newsletter.length === 0 ? (
                            <tr><td colSpan={3} className="text-center py-10 text-[#434042]">Aucun abonné</td></tr>
                          ) : newsletter.map((s, i) => (
                            <tr key={i} className="border-b border-[#e9e9e9] hover:bg-[#f9f9f8]/50">
                              <td className="px-4 py-3 text-[#434042] text-xs">{s.id}</td>
                              <td className="px-4 py-3 text-[#141313] text-sm">{s.email}</td>
                              <td className="px-4 py-3 text-right text-[#434042] text-xs">{new Date(s.createdAt).toLocaleDateString('fr-DZ')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* BLOG TAB */}
              {tab === 'blog' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="text-2xl font-black text-[#141313] mb-1">Blog & Guides</h1>
                      <p className="text-[#8c8b8b] text-sm">{blogs.length} article{blogs.length !== 1 ? 's' : ''}</p>
                    </div>
                    <button onClick={() => setBlogForm({ titre: '', categorie: 'BTP', desc: '', contenu: '', image: '', tags: '', temps: '5 min', published: false })}
                      className="btn-primary text-sm py-2 px-4">+ Nouvel article</button>
                  </div>
                  {blogForm ? (
                    <div className="card p-6 space-y-4">
                      <h2 className="text-[#141313] font-bold">{blogForm.id ? 'Modifier l\'article' : 'Nouvel article'}</h2>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div><label className="text-[#8c8b8b] text-xs mb-1 block">Titre *</label><input className="input-dark text-sm" value={blogForm.titre} onChange={e => setBlogForm(f => ({ ...f, titre: e.target.value }))} /></div>
                        <div><label className="text-[#8c8b8b] text-xs mb-1 block">Catégorie</label>
                          <select className="input-dark text-sm" value={blogForm.categorie} onChange={e => setBlogForm(f => ({ ...f, categorie: e.target.value }))}>
                            {['BTP','IAA','Agricole','Import','Finance','Conseil','Général'].map(c => <option key={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                      <div><label className="text-[#8c8b8b] text-xs mb-1 block">Résumé</label><input className="input-dark text-sm" value={blogForm.desc} onChange={e => setBlogForm(f => ({ ...f, desc: e.target.value }))} /></div>
                      <div><label className="text-[#8c8b8b] text-xs mb-1 block">Contenu (texte)</label><textarea rows={6} className="input-dark text-sm resize-none" value={blogForm.contenu} onChange={e => setBlogForm(f => ({ ...f, contenu: e.target.value }))} /></div>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div><label className="text-[#8c8b8b] text-xs mb-1 block">Image URL</label><input className="input-dark text-sm" placeholder="/uploads/..." value={blogForm.image} onChange={e => setBlogForm(f => ({ ...f, image: e.target.value }))} /></div>
                        <div><label className="text-[#8c8b8b] text-xs mb-1 block">Tags (séparés par ,)</label><input className="input-dark text-sm" value={blogForm.tags} onChange={e => setBlogForm(f => ({ ...f, tags: e.target.value }))} /></div>
                        <div><label className="text-[#8c8b8b] text-xs mb-1 block">Temps de lecture</label><input className="input-dark text-sm" placeholder="5 min" value={blogForm.temps} onChange={e => setBlogForm(f => ({ ...f, temps: e.target.value }))} /></div>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={blogForm.published} onChange={e => setBlogForm(f => ({ ...f, published: e.target.checked }))} className="w-4 h-4 accent-[#e46a33]" /><span className="text-[#434042] text-sm">Publié</span></label>
                      <div className="flex gap-3">
                        <button onClick={() => saveBlog({ ...blogForm, tags: (blogForm.tags || '').split(',').map(t => t.trim()).filter(Boolean) })} className="btn-primary text-sm py-2">Enregistrer</button>
                        <button onClick={() => setBlogForm(null)} className="btn-outline text-sm py-2">Annuler</button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {blogs.length === 0 && <div className="card p-12 text-center text-[#8c8b8b]">Aucun article. Créez le premier !</div>}
                      {blogs.map(b => (
                        <div key={b.id} className="card p-4 flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-[#141313] font-semibold text-sm truncate">{b.titre}</p>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-[#f9f9f8] text-[#e46a33] flex-shrink-0">{b.categorie}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${b.published ? 'bg-green-900/30 text-green-400' : 'bg-gray-900/30 text-[#8c8b8b]'}`}>{b.published ? 'Publié' : 'Brouillon'}</span>
                            </div>
                            <p className="text-[#8c8b8b] text-xs truncate">{b.desc}</p>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button onClick={() => toggleBlogPublished(b.id, b.published)} className="text-xs px-3 py-1.5 border border-[#e9e9e9] text-[#e46a33] rounded-lg hover:bg-[#f9f9f8]">
                              {b.published ? 'Dépublier' : 'Publier'}
                            </button>
                            <button onClick={() => setBlogForm({ ...b, tags: (b.tags || []).join(', ') })} className="text-xs px-3 py-1.5 border border-gray-700 text-[#8c8b8b] rounded-lg hover:text-white">Modifier</button>
                            <button onClick={() => deleteBlog(b.id)} className="text-red-500 hover:text-red-400 text-xs px-2">Suppr.</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* FAQ TAB */}
              {tab === 'faq' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="text-2xl font-black text-[#141313] mb-1">FAQ</h1>
                      <p className="text-[#8c8b8b] text-sm">{faqs.length} question{faqs.length !== 1 ? 's' : ''}</p>
                    </div>
                    <button onClick={() => setFaqForm({ question: '', reponse: '', page: 'fournisseurs', ordre: faqs.length, active: true })}
                      className="btn-primary text-sm py-2 px-4">+ Nouvelle FAQ</button>
                  </div>
                  {faqForm ? (
                    <div className="card p-6 space-y-4">
                      <h2 className="text-[#141313] font-bold">{faqForm.id ? 'Modifier la FAQ' : 'Nouvelle FAQ'}</h2>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div><label className="text-[#8c8b8b] text-xs mb-1 block">Page</label>
                          <select className="input-dark text-sm" value={faqForm.page} onChange={e => setFaqForm(f => ({ ...f, page: e.target.value }))}>
                            {['fournisseurs','acheteurs','tarifs','guides','general'].map(p => <option key={p}>{p}</option>)}
                          </select>
                        </div>
                        <div><label className="text-[#8c8b8b] text-xs mb-1 block">Ordre</label><input type="number" className="input-dark text-sm" value={faqForm.ordre} onChange={e => setFaqForm(f => ({ ...f, ordre: parseInt(e.target.value) || 0 })) } /></div>
                      </div>
                      <div><label className="text-[#8c8b8b] text-xs mb-1 block">Question *</label><input className="input-dark text-sm" value={faqForm.question} onChange={e => setFaqForm(f => ({ ...f, question: e.target.value }))} /></div>
                      <div><label className="text-[#8c8b8b] text-xs mb-1 block">Réponse *</label><textarea rows={4} className="input-dark text-sm resize-none" value={faqForm.reponse} onChange={e => setFaqForm(f => ({ ...f, reponse: e.target.value }))} /></div>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={faqForm.active} onChange={e => setFaqForm(f => ({ ...f, active: e.target.checked }))} className="w-4 h-4 accent-[#e46a33]" /><span className="text-[#434042] text-sm">Active</span></label>
                      <div className="flex gap-3">
                        <button onClick={() => saveFaq(faqForm)} className="btn-primary text-sm py-2">Enregistrer</button>
                        <button onClick={() => setFaqForm(null)} className="btn-outline text-sm py-2">Annuler</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {['fournisseurs','acheteurs','tarifs','guides','general'].map(pageName => {
                        const pageFaqs = faqs.filter(f => f.page === pageName)
                        if (pageFaqs.length === 0) return null
                        return (
                          <div key={pageName} className="mb-6">
                            <h2 className="text-[#e46a33] text-sm font-bold uppercase tracking-wider mb-3">{pageName} ({pageFaqs.length})</h2>
                            <div className="space-y-2">
                              {pageFaqs.sort((a,b) => a.ordre - b.ordre).map(f => (
                                <div key={f.id} className={`card p-4 flex items-start justify-between gap-4 ${!f.active ? 'opacity-50' : ''}`}>
                                  <div className="flex-1">
                                    <p className="text-[#141313] text-sm font-medium mb-1">{f.question}</p>
                                    <p className="text-[#8c8b8b] text-xs leading-relaxed">{f.reponse}</p>
                                  </div>
                                  <div className="flex gap-2 flex-shrink-0">
                                    <button onClick={() => setFaqForm({ ...f, active: f.active === 1 || f.active === true })} className="text-xs px-3 py-1.5 border border-gray-700 text-[#8c8b8b] rounded-lg hover:text-white">Modifier</button>
                                    <button onClick={() => deleteFaq(f.id)} className="text-red-500 hover:text-red-400 text-xs px-2">Suppr.</button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                      {faqs.length === 0 && <div className="card p-12 text-center text-[#8c8b8b]">Aucune FAQ. Créez la première !</div>}
                    </div>
                  )}
                </div>
              )}

              {/* PRIX TAB */}
              {tab === 'prix' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="text-2xl font-black text-[#141313] mb-1">Prix Marché</h1>
                      <p className="text-[#8c8b8b] text-sm">{prixItems.length} données · Affiché sur /prix</p>
                    </div>
                    <button onClick={() => setPrixForm({ secteur: 'BTP', nom: '', min: '', max: '', tendance: '→', pct: 'stable' })}
                      className="btn-primary text-sm py-2 px-4">+ Ajouter un prix</button>
                  </div>
                  {prixItems.length === 0 && !prixForm && (
                    <div className="card p-12 text-center">
                      <h3 className="text-[#141313] font-bold mb-2">Aucune donnée</h3>
                      <p className="text-[#8c8b8b] text-sm mb-4">Les données de prix du marché seront affichées sur la page /prix</p>
                      <p className="text-[#434042] text-xs">La page utilise des données statiques par défaut tant qu'aucune donnée n'est saisie ici.</p>
                    </div>
                  )}
                  {prixForm && (
                    <div className="card p-6 space-y-4 mb-6">
                      <h2 className="text-[#141313] font-bold">{prixForm.id ? 'Modifier' : 'Nouveau prix'}</h2>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div><label className="text-[#8c8b8b] text-xs mb-1 block">Secteur</label>
                          <select className="input-dark text-sm" value={prixForm.secteur} onChange={e => setPrixForm(f => ({ ...f, secteur: e.target.value }))}>
                            {['BTP','IAA','Agricole','Textile','Industrie','Pharma','Mining','Énergie'].map(s => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                        <div><label className="text-[#8c8b8b] text-xs mb-1 block">Nom machine *</label><input className="input-dark text-sm" value={prixForm.nom} onChange={e => setPrixForm(f => ({ ...f, nom: e.target.value }))} /></div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div><label className="text-[#8c8b8b] text-xs mb-1 block">Prix min (DZD)</label><input className="input-dark text-sm" placeholder="ex: 2 500 000" value={prixForm.min} onChange={e => setPrixForm(f => ({ ...f, min: e.target.value }))} /></div>
                        <div><label className="text-[#8c8b8b] text-xs mb-1 block">Prix max (DZD)</label><input className="input-dark text-sm" placeholder="ex: 5 000 000" value={prixForm.max} onChange={e => setPrixForm(f => ({ ...f, max: e.target.value }))} /></div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div><label className="text-[#8c8b8b] text-xs mb-1 block">Tendance</label>
                          <select className="input-dark text-sm" value={prixForm.tendance} onChange={e => setPrixForm(f => ({ ...f, tendance: e.target.value }))}>
                            <option value="↗">↗ Hausse</option><option value="→">→ Stable</option><option value="↘">↘ Baisse</option>
                          </select>
                        </div>
                        <div><label className="text-[#8c8b8b] text-xs mb-1 block">Variation</label><input className="input-dark text-sm" placeholder="ex: +5% ou stable" value={prixForm.pct} onChange={e => setPrixForm(f => ({ ...f, pct: e.target.value }))} /></div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => savePrix(prixForm)} className="btn-primary text-sm py-2">Enregistrer</button>
                        <button onClick={() => setPrixForm(null)} className="btn-outline text-sm py-2">Annuler</button>
                      </div>
                    </div>
                  )}
                  {prixItems.length > 0 && (
                    <div className="card overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead><tr className="border-b border-[#e9e9e9]">
                            <th className="text-left px-4 py-3 text-[#8c8b8b] text-xs uppercase">Secteur</th>
                            <th className="text-left px-4 py-3 text-[#8c8b8b] text-xs uppercase">Machine</th>
                            <th className="text-left px-4 py-3 text-[#8c8b8b] text-xs uppercase">Fourchette</th>
                            <th className="text-center px-4 py-3 text-[#8c8b8b] text-xs uppercase">Tendance</th>
                            <th className="text-center px-4 py-3 text-[#8c8b8b] text-xs uppercase">Actions</th>
                          </tr></thead>
                          <tbody>
                            {prixItems.map((p, i) => (
                              <tr key={i} className="border-b border-[#e9e9e9] hover:bg-[#f9f9f8]/50">
                                <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-[#f9f9f8] text-[#e46a33]">{p.secteur}</span></td>
                                <td className="px-4 py-3 text-[#141313] text-sm">{p.nom}</td>
                                <td className="px-4 py-3 text-[#8c8b8b] text-xs">{p.min} — {p.max} DZD</td>
                                <td className="px-4 py-3 text-center">
                                  <span className={`font-bold ${p.tendance === '↗' ? 'text-green-400' : p.tendance === '↘' ? 'text-red-400' : 'text-[#8c8b8b]'}`}>{p.tendance} {p.pct}</span>
                                </td>
                                <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                                  <button onClick={() => setPrixForm({ ...p })} className="text-[#8c8b8b] hover:text-white text-xs">Modifier</button>
                                  <button onClick={() => deletePrix(p.id)} className="text-red-500 hover:text-red-400 text-xs">Suppr.</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TEAM TAB */}
              {tab === 'team' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="text-2xl font-black text-[#141313] mb-1">Équipe</h1>
                      <p className="text-[#8c8b8b] text-sm">{teamMembers.length} membre{teamMembers.length !== 1 ? 's' : ''} · Affiché sur /catalogue/about</p>
                    </div>
                    <button onClick={() => setTeamForm({ nom: '', titre: '', bio: '', wilaya: 'Alger', avatar: '', ordre: teamMembers.length, active: true })}
                      className="btn-primary text-sm py-2 px-4">+ Ajouter un membre</button>
                  </div>
                  {teamForm && (
                    <div className="card p-6 space-y-4 mb-6">
                      <h2 className="text-[#141313] font-bold">{teamForm.id ? 'Modifier' : 'Nouveau membre'}</h2>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div><label className="text-[#8c8b8b] text-xs mb-1 block">Nom *</label><input className="input-dark text-sm" value={teamForm.nom} onChange={e => setTeamForm(f => ({ ...f, nom: e.target.value }))} /></div>
                        <div><label className="text-[#8c8b8b] text-xs mb-1 block">Titre/Poste *</label><input className="input-dark text-sm" value={teamForm.titre} onChange={e => setTeamForm(f => ({ ...f, titre: e.target.value }))} /></div>
                      </div>
                      <div><label className="text-[#8c8b8b] text-xs mb-1 block">Biographie</label><textarea rows={3} className="input-dark text-sm resize-none" value={teamForm.bio} onChange={e => setTeamForm(f => ({ ...f, bio: e.target.value }))} /></div>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div><label className="text-[#8c8b8b] text-xs mb-1 block">Wilaya</label><input className="input-dark text-sm" value={teamForm.wilaya} onChange={e => setTeamForm(f => ({ ...f, wilaya: e.target.value }))} /></div>
                        <div><label className="text-[#8c8b8b] text-xs mb-1 block">Photo URL</label><input className="input-dark text-sm" placeholder="/uploads/..." value={teamForm.avatar} onChange={e => setTeamForm(f => ({ ...f, avatar: e.target.value }))} /></div>
                        <div><label className="text-[#8c8b8b] text-xs mb-1 block">Ordre</label><input type="number" className="input-dark text-sm" value={teamForm.ordre} onChange={e => setTeamForm(f => ({ ...f, ordre: parseInt(e.target.value) || 0 }))} /></div>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={teamForm.active} onChange={e => setTeamForm(f => ({ ...f, active: e.target.checked }))} className="w-4 h-4 accent-[#e46a33]" /><span className="text-[#434042] text-sm">Actif</span></label>
                      <div className="flex gap-3">
                        <button onClick={() => saveTeam(teamForm)} className="btn-primary text-sm py-2">Enregistrer</button>
                        <button onClick={() => setTeamForm(null)} className="btn-outline text-sm py-2">Annuler</button>
                      </div>
                    </div>
                  )}
                  {teamMembers.length === 0 && !teamForm && (
                    <div className="card p-12 text-center text-[#8c8b8b]">Aucun membre. La page utilise les données statiques par défaut.</div>
                  )}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teamMembers.map(t => (
                      <div key={t.id} className="card p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-[#f9f9f8] border border-[#e9e9e9] overflow-hidden flex items-center justify-center flex-shrink-0">
                            {t.avatar ? <img src={t.avatar} alt={t.nom} className="w-full h-full object-cover" /> : <span className="text-[#e46a33] font-bold">{t.nom[0]}</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[#141313] text-sm font-semibold truncate">{t.nom}</p>
                            <p className="text-[#e46a33] text-xs truncate">{t.titre}</p>
                          </div>
                        </div>
                        {t.bio && <p className="text-[#8c8b8b] text-xs mb-3 leading-relaxed line-clamp-2">{t.bio}</p>}
                        <div className="flex gap-2">
                          <button onClick={() => setTeamForm({ ...t, active: t.active === 1 || t.active === true })} className="text-xs px-3 py-1 border border-gray-700 text-[#8c8b8b] rounded-lg hover:text-white">Modifier</button>
                          <button onClick={() => deleteTeam(t.id)} className="text-red-500 hover:text-red-400 text-xs px-2">Suppr.</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PACKAGES TAB */}
              {tab === 'packages' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="text-2xl font-black text-[#141313] mb-1">Packages Consulting</h1>
                      <p className="text-[#8c8b8b] text-sm">{packages.length} package{packages.length !== 1 ? 's' : ''} · Affichés sur /consulting et /tarifs</p>
                    </div>
                    <button onClick={() => setPackageForm({ titre: '', prix: '', duree: '', desc: '', inclus: '', badge: '', ordre: packages.length, active: true })}
                      className="btn-primary text-sm py-2 px-4">+ Nouveau package</button>
                  </div>
                  {packages.length === 0 && !packageForm && (
                    <div className="card p-12 text-center text-[#8c8b8b]">Aucun package. La page utilise des données statiques par défaut.</div>
                  )}
                  {packageForm && (
                    <div className="card p-6 space-y-4 mb-6">
                      <h2 className="text-[#141313] font-bold">{packageForm.id ? 'Modifier' : 'Nouveau package'}</h2>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div><label className="text-[#8c8b8b] text-xs mb-1 block">Titre *</label><input className="input-dark text-sm" value={packageForm.titre} onChange={e => setPackageForm(f => ({ ...f, titre: e.target.value }))} /></div>
                        <div><label className="text-[#8c8b8b] text-xs mb-1 block">Prix *</label><input className="input-dark text-sm" placeholder="ex: 45 000 DZD" value={packageForm.prix} onChange={e => setPackageForm(f => ({ ...f, prix: e.target.value }))} /></div>
                        <div><label className="text-[#8c8b8b] text-xs mb-1 block">Durée</label><input className="input-dark text-sm" placeholder="ex: 3-5 jours" value={packageForm.duree} onChange={e => setPackageForm(f => ({ ...f, duree: e.target.value }))} /></div>
                      </div>
                      <div><label className="text-[#8c8b8b] text-xs mb-1 block">Description</label><textarea rows={3} className="input-dark text-sm resize-none" value={packageForm.desc} onChange={e => setPackageForm(f => ({ ...f, desc: e.target.value }))} /></div>
                      <div><label className="text-[#8c8b8b] text-xs mb-1 block">Ce qui est inclus (une ligne par item)</label><textarea rows={4} className="input-dark text-sm resize-none" placeholder="Analyse des besoins&#10;Benchmark 3+ fournisseurs&#10;..." value={packageForm.inclus} onChange={e => setPackageForm(f => ({ ...f, inclus: e.target.value }))} /></div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div><label className="text-[#8c8b8b] text-xs mb-1 block">Badge (ex: Populaire)</label><input className="input-dark text-sm" value={packageForm.badge} onChange={e => setPackageForm(f => ({ ...f, badge: e.target.value }))} /></div>
                        <div><label className="text-[#8c8b8b] text-xs mb-1 block">Ordre</label><input type="number" className="input-dark text-sm" value={packageForm.ordre} onChange={e => setPackageForm(f => ({ ...f, ordre: parseInt(e.target.value) || 0 }))} /></div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => savePackage(packageForm)} className="btn-primary text-sm py-2">Enregistrer</button>
                        <button onClick={() => setPackageForm(null)} className="btn-outline text-sm py-2">Annuler</button>
                      </div>
                    </div>
                  )}
                  <div className="grid sm:grid-cols-3 gap-4">
                    {packages.map(pkg2 => (
                      <div key={pkg2.id} className="card p-5 relative">
                        {pkg2.badge && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#e46a33] text-white text-xs font-bold px-3 py-0.5 rounded-full">{pkg2.badge}</span>}
                        <h3 className="text-[#141313] font-bold mb-1">{pkg2.titre}</h3>
                        <p className="text-[#e46a33] font-black text-lg mb-1">{pkg2.prix}</p>
                        <p className="text-[#434042] text-xs mb-2">{pkg2.duree}</p>
                        <p className="text-[#8c8b8b] text-xs mb-3">{pkg2.desc}</p>
                        {(pkg2.inclus || []).length > 0 && (
                          <ul className="space-y-1 mb-3">
                            {pkg2.inclus.map((item, i) => <li key={i} className="text-[#434042] text-xs">• {item}</li>)}
                          </ul>
                        )}
                        <div className="flex gap-2">
                          <button onClick={() => setPackageForm({ ...pkg2, inclus: (pkg2.inclus || []).join('\n') })} className="text-xs px-3 py-1 border border-gray-700 text-[#8c8b8b] rounded-lg hover:text-white">Modifier</button>
                          <button onClick={() => deletePackage(pkg2.id)} className="text-red-500 hover:text-red-400 text-xs">Suppr.</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CONTACTS TAB */}
              {tab === 'contacts' && (
                <div>
                  <h1 className="text-2xl font-black text-[#141313] mb-2">Contacts</h1>
                  <p className="text-[#8c8b8b] text-sm mb-8">Messages reçus via le formulaire de contact</p>
                  <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[#e9e9e9]">
                            <th className="text-left px-4 py-3 text-[#8c8b8b] text-xs uppercase">Nom</th>
                            <th className="text-left px-4 py-3 text-[#8c8b8b] text-xs uppercase">Email</th>
                            <th className="text-left px-4 py-3 text-[#8c8b8b] text-xs uppercase">Machine</th>
                            <th className="text-left px-4 py-3 text-[#8c8b8b] text-xs uppercase">Message</th>
                            <th className="text-center px-4 py-3 text-[#8c8b8b] text-xs uppercase">Statut</th>
                            <th className="text-right px-4 py-3 text-[#8c8b8b] text-xs uppercase">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contacts.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-10 text-[#434042]">Aucun contact</td></tr>
                          ) : contacts.map((c, i) => (
                            <tr key={i} className="border-b border-[#e9e9e9] hover:bg-[#f9f9f8]/50">
                              <td className="px-4 py-3 text-[#141313] text-sm">{c.name}</td>
                              <td className="px-4 py-3 text-[#8c8b8b] text-xs">{c.email}</td>
                              <td className="px-4 py-3 text-[#8c8b8b] text-xs">{c.machine?.name || '—'}</td>
                              <td className="px-4 py-3 text-[#8c8b8b] text-xs max-w-xs truncate">{c.message}</td>
                              <td className="px-4 py-3 text-center">
                                <span className="bg-blue-900/30 text-blue-400 text-xs px-2 py-0.5 rounded-full">{c.status}</span>
                              </td>
                              <td className="px-4 py-3 text-right text-[#434042] text-xs">{new Date(c.createdAt).toLocaleDateString('fr-DZ')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
