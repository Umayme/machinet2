'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function MonComptePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (!d.user) {
          router.push('/login')
          return
        }
        setUser(d.user)
        setLoading(false)
      })
      .catch(() => {
        router.push('/login')
      })
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-[#8c8b8b]">Chargement...</div>
      </div>
    )
  }

  if (!user) return null

  const roleLabel = {
    seller: 'Vendeur',
    consultant: 'Consultant',
    buyer: 'Acheteur',
    admin: 'Administrateur',
  }[user.role] || user.role

  const roleColor = {
    seller: 'bg-[#f9f9f8] text-[#e46a33] border-[#e9e9e9]',
    consultant: 'bg-cyan-900/30 text-cyan-400 border-cyan-800/40',
    buyer: 'bg-blue-900/30 text-blue-400 border-blue-800/40',
    admin: 'bg-red-900/30 text-red-400 border-red-800/40',
  }[user.role] || 'bg-gray-900/30 text-[#8c8b8b] border-gray-800/40'

  const dashboardHref =
    user.role === 'seller' ? '/dashboard' :
    user.role === 'consultant' ? '/consultant-dashboard' :
    user.role === 'admin' ? '/machinetdz-admin-2026' :
    '/catalogue'

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-[#141313] mb-2">Mon compte</h1>
          <p className="text-[#8c8b8b] text-sm">Gérez vos informations personnelles et votre accès</p>
        </div>

        {/* Profile card */}
        <div className="card p-8 mb-6">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#e46a33] flex items-center justify-center text-white font-black text-2xl shrink-0 overflow-hidden">
              {user.avatar
                ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                : (user.name || 'U')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-[#141313] truncate">{user.name}</h2>
              <p className="text-[#8c8b8b] text-sm truncate">{user.email}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`text-xs px-2.5 py-1 rounded-full border ${roleColor}`}>{roleLabel}</span>
                {(user.role === 'seller' || user.role === 'consultant') && (
                  user.approved ? (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-green-900/30 text-green-400 border border-green-800/40">
                      Approuvé
                    </span>
                  ) : (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-900/30 text-yellow-400 border border-yellow-800/40">
                      En attente d'approbation
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-[#e9e9e9]">
            <InfoField label="Nom complet" value={user.name} />
            <InfoField label="Email" value={user.email} />
            <InfoField label="Entreprise" value={user.company} />
            <InfoField label="Wilaya" value={user.wilaya} />
            <InfoField label="Téléphone" value={user.phone} />
            <InfoField label="Rôle" value={roleLabel} />
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {(user.role === 'seller' || user.role === 'consultant' || user.role === 'admin') && (
            <Link href={dashboardHref} className="card p-5 hover:border-[#e46a33] transition-all group">
              <p className="font-semibold text-[#141313] text-sm group-hover:text-[#e46a33] transition-colors">Mon dashboard</p>
              <p className="text-[#8c8b8b] text-xs mt-1">Accéder à votre espace</p>
            </Link>
          )}
          <Link href="/catalogue" className="card p-5 hover:border-[#e46a33] transition-all group">
            <p className="font-semibold text-[#141313] text-sm group-hover:text-[#e46a33] transition-colors">Catalogue</p>
            <p className="text-[#8c8b8b] text-xs mt-1">Parcourir les machines</p>
          </Link>
          <Link href="/contact" className="card p-5 hover:border-[#e46a33] transition-all group">
            <div className="w-8 h-8 rounded-lg bg-[#f9f9f8] border border-[#e46a33]/30 flex items-center justify-center mb-3">
              <svg className="w-4 h-4 text-[#e46a33]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="font-semibold text-[#141313] text-sm group-hover:text-[#e46a33] transition-colors">Support</p>
            <p className="text-[#8c8b8b] text-xs mt-1">Contacter l'équipe</p>
          </Link>
        </div>

        {/* Danger zone */}
        <div className="card p-6 border-red-900/30">
          <p className="text-xs uppercase tracking-wider text-red-500/80 font-semibold mb-3">Session</p>
          <div className="flex items-center justify-between gap-4">
            <p className="text-[#8c8b8b] text-sm">Se déconnecter de votre compte sur cet appareil.</p>
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-lg bg-red-900/20 border border-red-800/40 text-red-400 text-sm font-medium hover:bg-red-900/40 transition-colors shrink-0"
            >
              Déconnexion
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

function InfoField({ label, value }) {
  return (
    <div>
      <p className="text-[#434042] text-xs uppercase tracking-wider font-semibold mb-1">{label}</p>
      <p className="text-[#141313] text-sm">{value || <span className="text-[#8c8b8b]">Non renseigné</span>}</p>
    </div>
  )
}
