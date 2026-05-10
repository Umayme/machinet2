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
  'Industrie': 'bg-[#f9f9f8] text-[#e46a33] border-[#e9e9e9]',
}

export default function MachinePage() {
  const params = useParams()
  const [machine, setMachine] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showContact, setShowContact] = useState(false)
  const [form, setForm] = useState({ nom: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(0)

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
          setMachine({ ...m, specsObj: specs, photosList: photos.slice(0, 10) })
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
        <div className="text-[#8c8b8b]">Chargement...</div>
      </div>
    )
  }

  if (!machine) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-bold text-[#141313] text-2xl mb-2">Machine introuvable</h2>
          <p className="text-[#8c8b8b] mb-6">Cette annonce n'existe pas ou a été supprimée.</p>
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
        <div className="flex items-center gap-2 text-[#434042] text-sm mb-8">
          <Link href="/" className="hover:text-[#e46a33] transition-colors">Accueil</Link>
          <span>›</span>
          <Link href="/catalogue" className="hover:text-[#e46a33] transition-colors">Catalogue</Link>
          <span>›</span>
          <span className="text-[#8c8b8b] line-clamp-1">{machine.name}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* LEFT — MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-8">

            {/* Images */}
            {machine.photosList?.length > 0 ? (
              <div className="card overflow-hidden">
                <div className="relative">
                  <img src={machine.photosList[selectedPhoto]} alt={machine.name} className="w-full h-80 object-cover" onError={e => e.target.style.display='none'} />
                  {machine.photosList.length > 1 && (
                    <>
                      <button onClick={() => setSelectedPhoto(i => (i - 1 + machine.photosList.length) % machine.photosList.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#141313]/60 hover:bg-white rounded-full flex items-center justify-center text-white transition-all">‹</button>
                      <button onClick={() => setSelectedPhoto(i => (i + 1) % machine.photosList.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#141313]/60 hover:bg-white rounded-full flex items-center justify-center text-white transition-all">›</button>
                      <span className="absolute bottom-3 right-3 bg-[#141313]/60 text-white text-xs px-2 py-1 rounded-md">{selectedPhoto + 1} / {machine.photosList.length}</span>
                    </>
                  )}
                </div>
                {machine.photosList.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto">
                    {machine.photosList.map((url, i) => (
                      <img key={i} src={url} alt="" onClick={() => setSelectedPhoto(i)}
                        className={`h-16 w-24 object-cover rounded-lg flex-shrink-0 cursor-pointer transition-all ${i === selectedPhoto ? 'ring-2 ring-[#e46a33] opacity-100' : 'opacity-50 hover:opacity-80'}`} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="card h-80 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-white"></div>
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 rounded-full bg-[#f9f9f8] border border-[#e9e9e9] flex items-center justify-center opacity-40 mb-4 mx-auto">
                    <svg className="w-10 h-10 text-[#e46a33]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
                  </div>
                  <p className="text-[#434042] text-sm">Photos disponibles sur demande</p>
                </div>
                <div className="absolute top-4 left-4 flex gap-2">
                  {verifie && <span className="badge-verified">Vérifié</span>}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${secteurColors[secteur] || 'bg-[#f9f9f8] text-[#e46a33] border-[#e9e9e9]'}`}>{secteur}</span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-[#141313]/60 text-[#434042] text-xs px-2 py-1 rounded-md">{machine.condition}</span>
                </div>
              </div>
            )}

            {/* Info */}
            <div>
              <div className="flex gap-2 mb-3">
                {verifie && <span className="badge-verified">Vérifié</span>}
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${secteurColors[secteur] || 'bg-[#f9f9f8] text-[#e46a33] border-[#e9e9e9]'}`}>{secteur}</span>
                <span className="bg-[#141313]/60 text-[#434042] text-xs px-2 py-1 rounded-md border border-[#e9e9e9]">{machine.condition}</span>
              </div>
              <h1 className="text-3xl font-black text-[#141313] mb-2">{machine.name}</h1>
              <div className="flex items-center gap-4 text-sm text-[#8c8b8b]">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-[#e46a33]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  {machine.wilaya}
                </span>
                {machine.seller?.company && <span>· {machine.seller.company}</span>}
              </div>
            </div>

            {/* Description */}
            {machine.description && (
              <div className="card p-6">
                <h2 className="font-bold text-[#141313] mb-4">Description</h2>
                <p className="text-[#8c8b8b] leading-relaxed text-sm whitespace-pre-line">{machine.description}</p>
              </div>
            )}


            {/* MACHINE DETAILS GRID */}
            <div className="card p-6">
              <h2 className="font-bold text-[#141313] mb-4">Détails de l'annonce</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Secteur', value: secteur, icon: '🏭' },
                  { label: 'État', value: machine.condition || 'Vente neuf', icon: '✅' },
                  { label: 'Wilaya', value: machine.wilaya || '—', icon: '📍' },
                  { label: 'Disponibilité', value: machine.active ? 'Disponible' : 'Vendu', icon: '🟢' },
                  { label: 'Vérifié', value: verifie ? 'Oui — MachiNet' : 'En attente', icon: verifie ? '🛡️' : '⏳' },
                  { label: 'Annonce publiée', value: machine.createdAt ? new Date(machine.createdAt).toLocaleDateString('fr-DZ', { dateStyle: 'medium' }) : '—', icon: '📅' },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="bg-[#f9f9f8] rounded-xl p-3 border border-[#e9e9e9]">
                    <p className="text-[#8c8b8b] text-xs mb-1">{icon} {label}</p>
                    <p className="text-[#141313] text-sm font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* PHOTO PLACEHOLDER for additional images */}
            <div className="card p-6">
              <h2 className="font-bold text-[#141313] mb-3">Photos supplémentaires</h2>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map(n => (
                  <div key={n} className="h-20 rounded-lg border-2 border-dashed border-[#e9e9e9] flex flex-col items-center justify-center bg-[#f9f9f8]">
                    <svg className="w-5 h-5 text-[#8c8b8b]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="text-[#8c8b8b] text-xs mt-1">Photo {n}</span>
                  </div>
                ))}
              </div>
              <p className="text-[#8c8b8b] text-xs mt-3">Demandez des photos au vendeur via le formulaire de contact.</p>
            </div>

            {/* WHY BUY TIPS */}
            <div className="rounded-xl p-5 border border-[#e46a33]/20 bg-[#fff5f0]">
              <h2 className="font-bold text-[#141313] mb-3 text-sm">Conseils avant d'acheter</h2>
              <ul className="space-y-2 text-xs text-[#434042]">
                {['Vérifiez les documents de la machine (facture, carnet d\'entretien)', "Demandez une inspection par un expert MachiNet avant l'achat", 'Négociez les conditions de livraison et de garantie', 'Comparez avec d\'autres offres similaires dans le catalogue'].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#e46a33] font-bold mt-0.5">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT — SELLER + CONTACT */}
          <div className="space-y-5">

            {/* PRICE CARD */}
            <div className="rounded-2xl bg-[#141313] p-6 text-white">
              <p className="text-white/50 text-xs mb-1 uppercase tracking-wide">Prix indicatif</p>
              <p className="text-4xl font-black text-[#e46a33] mb-1">{machine.price?.toLocaleString('fr-DZ')} <span className="text-lg">DZD</span></p>
              <p className="text-white/40 text-xs mb-5">Hors frais de livraison · TVA incluse selon conditions</p>
              {!sent ? (
                <button onClick={() => setShowContact(!showContact)} className="w-full bg-[#e46a33] hover:bg-orange-600 text-white py-3 rounded-xl font-bold text-sm transition-colors">
                  {showContact ? '✕ Fermer' : '📩 Contacter le vendeur'}
                </button>
              ) : (
                <div className="bg-green-800/30 border border-green-700/40 rounded-xl p-4 text-center">
                  <p className="text-green-400 font-semibold text-sm">✓ Message envoyé !</p>
                  <p className="text-white/50 text-xs mt-1">Réponse attendue sous 24h.</p>
                </div>
              )}
              <div className="flex items-center gap-2 mt-4 justify-center text-white/30 text-xs">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Vos données sont protégées
              </div>
            </div>

            {/* Formulaire contact */}
            {showContact && !sent && (
              <div className="card p-5">
                <h3 className="font-bold text-[#141313] mb-4">Demande de devis</h3>
                <form onSubmit={handleContact} className="space-y-3">
                  <input required placeholder="Votre nom *" className="input-dark h-10 text-sm" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
                  <input required type="email" placeholder="Email *" className="input-dark h-10 text-sm" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  <input required type="tel" placeholder="Téléphone *" className="input-dark h-10 text-sm" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  <textarea rows={4} className="input-dark text-sm resize-none" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                  <button type="submit" disabled={sending} className="btn-primary w-full justify-center h-10 text-sm disabled:opacity-50">
                    {sending ? 'Envoi...' : 'Envoyer la demande →'}
                  </button>
                </form>
              </div>
            )}

            {/* Vendeur */}
            <div className="card p-5">
              <h3 className="font-bold text-[#141313] mb-4 text-sm uppercase tracking-wide">À propos du vendeur</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[#f9f9f8] border-2 border-[#e9e9e9] flex items-center justify-center text-[#e46a33] font-black text-lg flex-shrink-0">
                  {machine.seller?.avatar
                    ? <img src={machine.seller.avatar} alt="" className="w-full h-full object-cover" />
                    : (machine.seller?.name || 'V')[0]}
                </div>
                <div>
                  <p className="font-semibold text-[#141313] text-sm">{machine.seller?.name || 'Vendeur'}</p>
                  {machine.seller?.company && <p className="text-[#8c8b8b] text-xs">{machine.seller.company}</p>}
                  {verifie && <span className="badge-verified text-xs mt-1 inline-block">Vérifié MachiNet</span>}
                </div>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center gap-2 text-[#8c8b8b]">
                  <svg className="w-4 h-4 text-[#e46a33]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {machine.seller?.wilaya || machine.wilaya}
                </div>
              </div>
            </div>

            {/* IA Advisor */}
            <div className="rounded-xl p-5 text-center bg-gradient-to-br from-[#141313] to-[#2a1a3e]">
              <div className="w-10 h-10 rounded-xl bg-[#e46a33]/20 border border-[#e46a33]/30 mx-auto mb-2 flex items-center justify-center">
                <span className="text-[#e46a33] font-black text-sm">AI</span>
              </div>
              <h3 className="font-semibold text-white mb-1 text-sm">Pas sûr de votre choix ?</h3>
              <p className="text-white/50 text-xs mb-3">MachiBot compare et conseille en temps réel.</p>
              <Link href="/ia-bots" className="block bg-white/10 hover:bg-white/20 text-white border border-white/20 py-2 rounded-lg text-xs font-medium transition-colors">Parler à MachiBot →</Link>
            </div>

            {/* Expert */}
            <div className="card p-5 border-l-4 border-[#e46a33]">
              <h3 className="font-bold text-[#141313] mb-1 text-sm">Besoin d'un expert {secteur} ?</h3>
              <p className="text-[#8c8b8b] text-xs mb-3 leading-relaxed">
                Inspection, sourcing, négociation — nos consultants vous accompagnent de A à Z.
              </p>
              <Link href="/consulting" className="btn-primary w-full justify-center text-xs py-2">
                Consulter un expert →
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          