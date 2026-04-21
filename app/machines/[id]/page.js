'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const secteurColors = {
  'IAA': 'bg-green-900/30 text-green-400 border-green-800/40',
  'BTP': 'bg-orange-900/30 text-orange-400 border-orange-800/40',
  'Agricole': 'bg-lime-900/30 text-lime-400 border-lime-800/40',
  'Pharma': 'bg-blue-900/30 text-blue-400 border-blue-800/40',
  'Textile': 'bg-pink-900/30 text-pink-400 border-pink-800/40',
  'Mining': 'bg-yellow-900/30 text-yellow-400 border-yellow-800/40',
  'Industrie': 'bg-purple-900/30 text-purple-400 border-purple-800/40',
}

export default function MachinePage() {
  const params = useParams()
  const [machine, setMachine] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showContact, setShowContact] = useState(false)
  const [form, setForm] = useState({ nom: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetch(`/api/machines/${params.id}`)
      .then(r => r.json())
      .then(d => {
        if (d.machine) {
          const m = d.machine
          // Normalize specs from JSON string
          let specs = {}
          if (m.specs) {
            try { specs = JSON.parse(m.specs) } catch { specs = { 'Specs': m.specs } }
          }
          // Get photos
          let photos = []
          if (m.photos) {
            try { photos = JSON.parse(m.photos) } catch { if (m.photos) photos = [m.photos] }
          }
          setMachine({ ...m, specsObj: specs, photosList: photos })
          setForm(f => ({ ...f, message: `Bonjour, je suis intéressé par "${m.name}". Pouvez-vous me donner plus d'informations et votre meilleur prix ?` }))
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.id])

  const handleContact = async (e) => {
    e.preventDefault()
    setSending(true)
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.nom, email: form.email, phone: form.phone, message: form.message, machineId: params.id }),
    })
    setSending(false)
    setSent(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    )
  }

  if (!machine) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white font-bold text-2xl mb-2">Machine introuvable</h2>
          <p className="text-gray-500 mb-6">Cette annonce n'existe pas ou a été supprimée.</p>
          <Link href="/catalogue" className="btn-primary">Retour au catalogue</Link>
        </div>
      </div>
    )
  }

  const secteur = machine.category || 'Industrie'
  const verifie = machine.verified

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-gray-600 text-sm mb-8">
          <Link href="/" className="hover:text-purple-400 transition-colors">Accueil</Link>
          <span>›</span>
          <Link href="/catalogue" className="hover:text-purple-400 transition-colors">Catalogue</Link>
          <span>›</span>
          <span className="text-gray-400 line-clamp-1">{machine.name}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* LEFT — MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-8">

            {/* Images */}
            {machine.photosList?.length > 0 ? (
              <div className="card overflow-hidden">
                <img src={machine.photosList[0]} alt={machine.name} className="w-full h-80 object-cover" onError={e => e.target.style.display='none'} />
                {machine.photosList.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto">
                    {machine.photosList.slice(1).map((url, i) => (
                      <img key={i} src={url} alt="" className="h-16 w-24 object-cover rounded-lg flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity cursor-pointer" />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="card h-80 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black"></div>
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 rounded-full bg-purple-900/20 border border-purple-800/30 flex items-center justify-center opacity-40 mb-4 mx-auto">
                    <svg className="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
                  </div>
                  <p className="text-gray-600 text-sm">Photos disponibles sur demande</p>
                </div>
                <div className="absolute top-4 left-4 flex gap-2">
                  {verifie && <span className="badge-verified">Vérifié</span>}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${secteurColors[secteur] || 'bg-purple-900/30 text-purple-400 border-purple-800/40'}`}>{secteur}</span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-black/60 text-gray-300 text-xs px-2 py-1 rounded-md">{machine.condition}</span>
                </div>
              </div>
            )}

            {/* Info */}
            <div>
              <div className="flex gap-2 mb-3">
                {verifie && <span className="badge-verified">Vérifié</span>}
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${secteurColors[secteur] || 'bg-purple-900/30 text-purple-400 border-purple-800/40'}`}>{secteur}</span>
                <span className="bg-black/60 text-gray-300 text-xs px-2 py-1 rounded-md border border-white/10">{machine.condition}</span>
              </div>
              <h1 className="text-3xl font-black text-white mb-2">{machine.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{machine.wilaya}</span>
                {machine.seller?.company && <span>{machine.seller.company}</span>}
              </div>
              <div className="mt-4">
                <p className="text-xs text-gray-600 mb-1">Prix indicatif</p>
                <p className="text-4xl font-black text-purple-400">
                  {machine.price?.toLocaleString('fr-DZ')} <span className="text-xl text-purple-600">DZD</span>
                </p>
              </div>
            </div>

            {/* Description */}
            {machine.description && (
              <div className="card p-6">
                <h2 className="text-white font-bold mb-4">Description</h2>
                <p className="text-gray-400 leading-relaxed text-sm whitespace-pre-line">{machine.description}</p>
              </div>
            )}

            {/* Specs */}
            {machine.specsObj && Object.keys(machine.specsObj).length > 0 && (
              <div className="card p-6">
                <h2 className="text-white font-bold mb-4">Spécifications techniques</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {Object.entries(machine.specsObj).map(([k, v], i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-purple-900/20">
                      <span className="text-gray-500 text-sm">{k}</span>
                      <span className="text-white text-sm font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Text specs fallback */}
            {machine.specs && !machine.specsObj && (
              <div className="card p-6">
                <h2 className="text-white font-bold mb-4">Spécifications techniques</h2>
                <p className="text-gray-400 text-sm whitespace-pre-line">{machine.specs}</p>
              </div>
            )}
          </div>

          {/* RIGHT — SELLER + CONTACT */}
          <div className="space-y-6">

            {/* Vendeur */}
            <div className="card p-6">
              <h3 className="text-white font-bold mb-4">Vendeur</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-900/30 border border-purple-700/40 flex items-center justify-center text-purple-400 font-black text-lg">
                  {(machine.seller?.name || 'V')[0]}
                </div>
                <div>
                  <p className="text-white font-semibold">{machine.seller?.name || 'Vendeur'}</p>
                  {machine.seller?.company && <p className="text-gray-500 text-xs">{machine.seller.company}</p>}
                  {verifie && <span className="badge-verified text-xs mt-1 inline-block">Vérifié</span>}
                </div>
              </div>
              <div className="space-y-2 mb-4 text-sm text-gray-400">
                <p>{machine.seller?.wilaya || machine.wilaya}</p>
              </div>
              {!sent ? (
                <button onClick={() => setShowContact(!showContact)} className="btn-primary w-full justify-center">
                  {showContact ? 'Fermer' : 'Contacter le vendeur'}
                </button>
              ) : (
                <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-4 text-center">
                  <p className="text-green-400 font-semibold text-sm">Message envoyé !</p>
                  <p className="text-gray-500 text-xs mt-1">Le vendeur vous répondra sous 24h.</p>
                </div>
              )}
            </div>

            {/* Formulaire contact */}
            {showContact && !sent && (
              <div className="card p-6">
                <h3 className="text-white font-bold mb-4">Demande de devis</h3>
                <form onSubmit={handleContact} className="space-y-3">
                  <input required placeholder="Votre nom *" className="input-dark h-10 text-sm" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
                  <input required type="email" placeholder="Email *" className="input-dark h-10 text-sm" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  <input required type="tel" placeholder="Téléphone *" className="input-dark h-10 text-sm" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  <textarea rows={4} className="input-dark text-sm resize-none" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                  <button type="submit" disabled={sending} className="btn-primary w-full justify-center h-10 text-sm disabled:opacity-50">
                    {sending ? 'Envoi...' : 'Envoyer →'}
                  </button>
                </form>
              </div>
            )}

            {/* IA Advisor */}
            <div className="card p-6 text-center" style={{ background: 'linear-gradient(135deg, #0f0a1a, #1a0a2e)' }}>
              <div className="w-10 h-10 rounded-xl bg-purple-700/30 border border-purple-600/40 mx-auto mb-2 flex items-center justify-center">
                <span className="text-purple-300 font-black text-sm">AI</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Pas sûr de votre choix ?</h3>
              <p className="text-gray-500 text-xs mb-4">MachiBot compare les machines et vous conseille.</p>
              <Link href="/ia-bots" className="btn-outline text-xs py-2 px-4 w-full justify-center">Parler à MachiBot</Link>
            </div>

            {/* Consultant suggestion */}
            <div className="card p-6">
              <h3 className="text-white font-bold mb-2">Besoin d'un expert {secteur} ?</h3>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                Nos consultants spécialisés vous accompagnent dans le sourcing, la négociation et la mise en service.
              </p>
              <Link href={`/consulting`} className="btn-primary w-full justify-center text-sm py-2">
                Consulter un expert →
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
