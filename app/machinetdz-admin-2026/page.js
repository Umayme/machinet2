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
  const [loading, setLoading] = useState(false)

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
      const [m, u, c, p, co, fb, nl] = await Promise.all([
        fetch('/api/admin/machines').then(r => r.json()),
        fetch('/api/admin/users').then(r => r.json()),
        fetch('/api/contact').then(r => r.json()),
        fetch('/api/admin/pending').then(r => r.json()),
        fetch('/api/admin/consultations').then(r => r.json()),
        fetch('/api/feedback?admin=1').then(r => r.json()),
        fetch('/api/newsletter/admin').then(r => r.json()).catch(() => ({ subscribers: [] })),
      ])
      setMachines(m.machines || [])
      setUsers(u.users || [])
      setContacts(c.contacts || [])
      setPending(p.users || [])
      setConsultations(co.consultations || [])
      setFeedbacks(fb.feedbacks || [])
      setNewsletter(nl.subscribers || [])
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
    setMachines([]); setUsers([]); setContacts([]); setPending([]); setConsultations([]); setFeedbacks([]); setNewsletter([])
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
      <div className="min-h-screen flex items-center justify-center bg-black px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-purple-900/30 border border-purple-700/40 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-white">Espace Administrateur</h1>
            <p className="text-gray-600 text-sm mt-1">MachiNet — Accès restreint</p>
          </div>
          <form onSubmit={handleLogin} className="card p-8 space-y-5">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Email admin</label>
              <input
                required type="email" className="input-dark h-12"
                placeholder="admin@machinetdz.com"
                value={loginForm.email}
                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Mot de passe</label>
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
  ]

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
    <div className="min-h-screen bg-black">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 border-b border-purple-900/40 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <span className="text-white font-bold text-sm">MachiNet Admin</span>
          <span className="text-xs text-purple-500 bg-purple-900/20 border border-purple-800/30 px-2 py-0.5 rounded-full">Panneau secret</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={loadData} className="text-xs text-gray-500 hover:text-white transition-colors border border-purple-900/30 px-3 py-1 rounded-lg">
            ↻ Actualiser
          </button>
          <button onClick={handleLogout} className="text-xs text-red-500 hover:text-red-400 transition-colors">
            Déconnexion
          </button>
        </div>
      </div>

      <div className="pt-14 flex">
        {/* Sidebar */}
        <div className="fixed left-0 top-14 bottom-0 w-56 bg-black/80 border-r border-purple-900/20 p-3 overflow-y-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm mb-1 transition-all ${tab === t.id ? 'bg-purple-900/40 text-white' : 'text-gray-500 hover:text-white hover:bg-purple-900/20'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="ml-56 flex-1 p-8">
          {loading ? (
            <div className="text-center py-20 text-gray-500">Chargement...</div>
          ) : (
            <>
              {/* OVERVIEW TAB */}
              {tab === 'overview' && (
                <div>
                  <h1 className="text-2xl font-black text-white mb-2">Vue d'ensemble</h1>
                  <p className="text-gray-500 text-sm mb-8">Tableau de bord MachiNet</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                      { v: machines.length, l: 'Annonces totales', c: 'text-purple-400' },
                      { v: machines.filter(m => m.verified).length, l: 'Annonces vérifiées', c: 'text-green-400' },
                      { v: users.length, l: 'Utilisateurs', c: 'text-blue-400' },
                      { v: pending.length, l: 'En attente d\'approbation', c: 'text-yellow-400' },
                      { v: approvedSellers.length, l: 'Vendeurs approuvés', c: 'text-purple-400' },
                      { v: approvedConsultants.length, l: 'Consultants approuvés', c: 'text-cyan-400' },
                      { v: consultations.length, l: 'Consultations', c: 'text-orange-400' },
                      { v: contacts.length, l: 'Contacts reçus', c: 'text-pink-400' },
                    ].map((s, i) => (
                      <div key={i} className="card p-5 text-center">
                        <p className={`text-2xl font-black ${s.c}`}>{s.v}</p>
                        <p className="text-gray-500 text-xs mt-1">{s.l}</p>
                      </div>
                    ))}
                  </div>

                  {pending.length > 0 && (
                    <div className="card p-6 border border-yellow-900/30 bg-yellow-900/5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                        <h3 className="text-white font-bold">{pending.length} demande{pending.length > 1 ? 's' : ''} en attente d'approbation</h3>
                      </div>
                      <p className="text-gray-500 text-sm mb-4">
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
                  <h1 className="text-2xl font-black text-white mb-2">Demandes en attente</h1>
                  <p className="text-gray-500 text-sm mb-8">Approuver ou rejeter les demandes de vendeurs et consultants</p>

                  {pending.length === 0 ? (
                    <div className="card p-16 text-center">
                      <h3 className="text-white font-bold text-lg mb-2">Aucune demande en attente</h3>
                      <p className="text-gray-500 text-sm">Toutes les demandes ont été traitées.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Sellers */}
                      {pendingSellers.length > 0 && (
                        <div>
                          <h2 className="text-purple-400 font-bold text-sm uppercase tracking-wider mb-3">
                            Vendeurs ({pendingSellers.length})
                          </h2>
                          {pendingSellers.map((u) => (
                            <div key={u.id} className="card p-5 flex items-center justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <p className="text-white font-bold">{u.name}</p>
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/30 text-purple-400">Vendeur</span>
                                </div>
                                <p className="text-gray-400 text-sm">{u.email}</p>
                                <div className="flex gap-4 mt-2 text-xs text-gray-600">
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
                                  ✓ Approuver
                                </button>
                                <button
                                  onClick={() => approveUser(u.id, 'reject')}
                                  className="px-4 py-2 bg-red-900/20 text-red-500 border border-red-900/30 rounded-lg text-sm hover:bg-red-900/40 transition-all"
                                >
                                  ✕ Rejeter
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
                                  <p className="text-white font-bold">{u.name}</p>
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-900/30 text-cyan-400">Consultant</span>
                                </div>
                                <p className="text-gray-400 text-sm">{u.email}</p>
                                <div className="flex gap-4 mt-2 text-xs text-gray-600">
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
                                  ✓ Approuver
                                </button>
                                <button
                                  onClick={() => approveUser(u.id, 'reject')}
                                  className="px-4 py-2 bg-red-900/20 text-red-500 border border-red-900/30 rounded-lg text-sm hover:bg-red-900/40 transition-all"
                                >
                                  ✕ Rejeter
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
                  <h1 className="text-2xl font-black text-white mb-2">Annonces</h1>
                  <p className="text-gray-500 text-sm mb-8">Gérer toutes les annonces de machines</p>
                  <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-purple-900/30">
                            <th className="text-left px-4 py-3 text-gray-500 text-xs uppercase">Machine</th>
                            <th className="text-left px-4 py-3 text-gray-500 text-xs uppercase">Vendeur</th>
                            <th className="text-right px-4 py-3 text-gray-500 text-xs uppercase">Prix</th>
                            <th className="text-center px-4 py-3 text-gray-500 text-xs uppercase">Actif</th>
                            <th className="text-center px-4 py-3 text-gray-500 text-xs uppercase">Vérifié</th>
                            <th className="text-center px-4 py-3 text-gray-500 text-xs uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {machines.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-10 text-gray-600">Aucune annonce</td></tr>
                          ) : machines.map((m, i) => (
                            <tr key={i} className="border-b border-purple-900/10 hover:bg-purple-900/5">
                              <td className="px-4 py-3 text-white text-sm">{m.name}</td>
                              <td className="px-4 py-3 text-gray-400 text-xs">{m.seller?.name}<br /><span className="text-gray-600">{m.seller?.email}</span></td>
                              <td className="px-4 py-3 text-right text-purple-400 text-sm">{m.price?.toLocaleString()} DZD</td>
                              <td className="px-4 py-3 text-center">
                                <button onClick={() => toggleActive(m.id, m.active)}
                                  className={`text-xs px-2 py-1 rounded-full transition-all ${m.active ? 'bg-green-900/30 text-green-400' : 'bg-gray-900/30 text-gray-500'}`}>
                                  {m.active ? 'Oui' : 'Non'}
                                </button>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button onClick={() => toggleVerify(m.id, m.verified)}
                                  className={`text-xs px-2 py-1 rounded-full transition-all ${m.verified ? 'bg-purple-900/30 text-purple-400' : 'bg-gray-900/30 text-gray-500'}`}>
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
                  <h1 className="text-2xl font-black text-white mb-2">Utilisateurs</h1>
                  <p className="text-gray-500 text-sm mb-8">Tous les comptes enregistrés</p>
                  <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-purple-900/30">
                            <th className="text-left px-4 py-3 text-gray-500 text-xs uppercase">Nom</th>
                            <th className="text-left px-4 py-3 text-gray-500 text-xs uppercase">Email</th>
                            <th className="text-left px-4 py-3 text-gray-500 text-xs uppercase">Rôle</th>
                            <th className="text-center px-4 py-3 text-gray-500 text-xs uppercase">Approuvé</th>
                            <th className="text-left px-4 py-3 text-gray-500 text-xs uppercase">Wilaya</th>
                            <th className="text-center px-4 py-3 text-gray-500 text-xs uppercase">Annonces</th>
                            <th className="text-right px-4 py-3 text-gray-500 text-xs uppercase">Inscrit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((u, i) => (
                            <tr key={i} className="border-b border-purple-900/10 hover:bg-purple-900/5">
                              <td className="px-4 py-3 text-white text-sm">{u.name}</td>
                              <td className="px-4 py-3 text-gray-400 text-xs">{u.email}</td>
                              <td className="px-4 py-3">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  u.role === 'admin' ? 'bg-red-900/30 text-red-400' :
                                  u.role === 'seller' ? 'bg-purple-900/30 text-purple-400' :
                                  u.role === 'consultant' ? 'bg-cyan-900/30 text-cyan-400' :
                                  'bg-blue-900/30 text-blue-400'
                                }`}>{u.role}</span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${u.approved ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-500'}`}>
                                  {u.approved ? 'Oui' : 'Non'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-400 text-xs">{u.wilaya || '—'}</td>
                              <td className="px-4 py-3 text-center text-purple-400 text-sm">{u._count?.machines || 0}</td>
                              <td className="px-4 py-3 text-right text-gray-600 text-xs">{new Date(u.createdAt).toLocaleDateString('fr-DZ')}</td>
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
                  <h1 className="text-2xl font-black text-white mb-2">Consultations</h1>
                  <p className="text-gray-500 text-sm mb-8">Demandes de conseil — assigner un consultant et mettre à jour le statut</p>
                  {consultations.length === 0 ? (
                    <div className="card p-16 text-center">
                      <h3 className="text-white font-bold text-lg mb-2">Aucune consultation</h3>
                      <p className="text-gray-500 text-sm">Les demandes de consultation apparaîtront ici.</p>
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
                                  <h3 className="text-white font-bold">{c.subject}</h3>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    c.status === 'confirmed' ? 'bg-green-900/30 text-green-400' :
                                    c.status === 'completed' ? 'bg-purple-900/30 text-purple-400' :
                                    c.status === 'cancelled' ? 'bg-red-900/30 text-red-400' :
                                    'bg-yellow-900/30 text-yellow-400'
                                  }`}>{c.status}</span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-1">
                                  <span>👤 {c.clientName}</span>
                                  <span>{c.clientEmail}</span>
                                  {c.clientPhone && <span>{c.clientPhone}</span>}
                                  <span>{new Date(c.createdAt).toLocaleDateString('fr-DZ')}</span>
                                </div>
                                {c.message && <p className="text-gray-600 text-xs bg-white/5 rounded px-3 py-1.5 mt-2">{c.message}</p>}
                                {c.notes && <p className="text-gray-500 text-xs italic mt-1">Note: {c.notes}</p>}
                              </div>
                              <div className="flex flex-col gap-2 min-w-52">
                                {/* Assign consultant */}
                                <div>
                                  <label className="text-gray-600 text-xs mb-1 block">Consultant assigné</label>
                                  <select
                                    className="w-full bg-black/60 border border-purple-900/30 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-purple-600"
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
                                  <label className="text-gray-600 text-xs mb-1 block">Statut</label>
                                  <select
                                    className="w-full bg-black/60 border border-purple-900/30 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-purple-600"
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
                  <h1 className="text-2xl font-black text-white mb-2">Avis & Témoignages</h1>
                  <p className="text-gray-500 text-sm mb-8">Modérer les avis soumis par les utilisateurs</p>
                  {feedbacks.length === 0 ? (
                    <div className="card p-16 text-center">
                      <h3 className="text-white font-bold text-lg mb-2">Aucun avis</h3>
                      <p className="text-gray-500 text-sm">Les témoignages soumis apparaîtront ici.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {feedbacks.map(f => (
                        <div key={f.id} className={`card p-5 ${!f.approved ? 'border-yellow-900/30' : ''}`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <p className="text-white font-bold">{f.nom}</p>
                                {f.poste && <span className="text-gray-500 text-xs">{f.poste}</span>}
                                {f.wilaya && <span className="text-gray-600 text-xs">{f.wilaya}</span>}
                                <span className="text-purple-400 font-bold">{f.note}/5</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${f.approved ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                                  {f.approved ? 'Publié' : 'En attente'}
                                </span>
                              </div>
                              <p className="text-gray-400 text-sm italic">"{f.texte}"</p>
                              <p className="text-gray-600 text-xs mt-1">{new Date(f.createdAt).toLocaleDateString('fr-DZ')}</p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <button onClick={() => approveFeedback(f.id, !f.approved)}
                                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${f.approved ? 'border-gray-700 text-gray-500 hover:text-white' : 'border-green-800/40 bg-green-900/20 text-green-400 hover:bg-green-900/40'}`}>
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
                  <h1 className="text-2xl font-black text-white mb-2">Newsletter</h1>
                  <p className="text-gray-500 text-sm mb-8">{newsletter.length} abonné{newsletter.length !== 1 ? 's' : ''}</p>
                  <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-purple-900/30">
                            <th className="text-left px-4 py-3 text-gray-500 text-xs uppercase">#</th>
                            <th className="text-left px-4 py-3 text-gray-500 text-xs uppercase">Email</th>
                            <th className="text-right px-4 py-3 text-gray-500 text-xs uppercase">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {newsletter.length === 0 ? (
                            <tr><td colSpan={3} className="text-center py-10 text-gray-600">Aucun abonné</td></tr>
                          ) : newsletter.map((s, i) => (
                            <tr key={i} className="border-b border-purple-900/10 hover:bg-purple-900/5">
                              <td className="px-4 py-3 text-gray-600 text-xs">{s.id}</td>
                              <td className="px-4 py-3 text-white text-sm">{s.email}</td>
                              <td className="px-4 py-3 text-right text-gray-600 text-xs">{new Date(s.createdAt).toLocaleDateString('fr-DZ')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* CONTACTS TAB */}
              {tab === 'contacts' && (
                <div>
                  <h1 className="text-2xl font-black text-white mb-2">Contacts</h1>
                  <p className="text-gray-500 text-sm mb-8">Messages reçus via le formulaire de contact</p>
                  <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-purple-900/30">
                            <th className="text-left px-4 py-3 text-gray-500 text-xs uppercase">Nom</th>
                            <th className="text-left px-4 py-3 text-gray-500 text-xs uppercase">Email</th>
                            <th className="text-left px-4 py-3 text-gray-500 text-xs uppercase">Machine</th>
                            <th className="text-left px-4 py-3 text-gray-500 text-xs uppercase">Message</th>
                            <th className="text-center px-4 py-3 text-gray-500 text-xs uppercase">Statut</th>
                            <th className="text-right px-4 py-3 text-gray-500 text-xs uppercase">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contacts.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-10 text-gray-600">Aucun contact</td></tr>
                          ) : contacts.map((c, i) => (
                            <tr key={i} className="border-b border-purple-900/10 hover:bg-purple-900/5">
                              <td className="px-4 py-3 text-white text-sm">{c.name}</td>
                              <td className="px-4 py-3 text-gray-400 text-xs">{c.email}</td>
                              <td className="px-4 py-3 text-gray-400 text-xs">{c.machine?.name || '—'}</td>
                              <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">{c.message}</td>
                              <td className="px-4 py-3 text-center">
                                <span className="bg-blue-900/30 text-blue-400 text-xs px-2 py-0.5 rounded-full">{c.status}</span>
                              </td>
                              <td className="px-4 py-3 text-right text-gray-600 text-xs">{new Date(c.createdAt).toLocaleDateString('fr-DZ')}</td>
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
