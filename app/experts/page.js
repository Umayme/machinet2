'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const secteurOptions = ['Tous', 'IAA · Agroalimentaire', 'Bâtiment & TP', 'Agriculture', 'Industrie générale', 'Énergie', 'Import & Douanes']
const serviceTypes = ['Audit & Sourcing', 'Accompagnement Achat', 'Inspection technique', 'Étude de faisabilité', 'Import / Dédouanement', 'Formation opérateurs', 'Maintenance préventive', 'Autre']

const staticExperts = [
  {
    id: 'e1',
    nom: 'Mehdi Tounsi',
    titre: 'Expert IAA & Process industriel',
    exp: '15 ans',
    wilaya: 'Alger',
    secteurs: ['IAA · Agroalimentaire', 'Industrie générale'],
    services: [
      { nom: 'Audit ligne de production', prix: '25 000 DZD', duree: '2-3 jours' },
      { nom: 'Accompagnement achat machine', prix: '45 000 DZD', duree: '1 semaine' },
      { nom: 'Formation opérateurs', prix: '15 000 DZD', duree: '1 jour' },
    ],
    note: 4.9,
    missions: 47,
  },
  {
    id: 'e2',
    nom: 'Amina Khelil',
    titre: 'Ingénieure BTP & Infrastructure',
    exp: '12 ans',
    wilaya: 'Oran',
    secteurs: ['Bâtiment & TP'],
    services: [
      { nom: 'Inspection engin de chantier', prix: '18 000 DZD', duree: '1 jour' },
      { nom: 'Étude de faisabilité', prix: '60 000 DZD', duree: '5 jours' },
    ],
    note: 4.8,
    missions: 31,
  },
  {
    id: 'e3',
    nom: 'Salim Benali',
    titre: 'Expert Agri & Import DZ',
    exp: '10 ans',
    wilaya: 'Sétif',
    secteurs: ['Agriculture', 'Import & Douanes'],
    services: [
      { nom: 'Sourcing équipement agricole', prix: '20 000 DZD', duree: '3 jours' },
      { nom: 'Accompagnement import', prix: '35 000 DZD', duree: '1-2 semaines' },
      { nom: 'Audit besoins agricoles', prix: '12 000 DZD', duree: '2 jours' },
    ],
    note: 4.7,
    missions: 58,
  },
  {
    id: 'e4',
    nom: 'Farid Mekki',
    titre: 'Spécialiste Énergie & Utilities',
    exp: '8 ans',
    wilaya: 'Constantine',
    secteurs: ['Énergie', 'Industrie générale'],
    services: [
      { nom: 'Audit énergétique', prix: '30 000 DZD', duree: '2 jours' },
      { nom: 'Sourcing groupes électrogènes', prix: '22 000 DZD', duree: '3 jours' },
    ],
    note: 4.6,
    missions: 24,
  },
]

function StarRating({ note }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(s => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(note) ? 'text-[#e46a33]' : 'text-[#e9e9e9]'} fill-current`} viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      ))}
      <span className="text-[#8c8b8b] text-xs ml-1">{note} · {'{'}{'}'}</span>
    </div>
  )
}

function ExpertCard({ expert, onViewServices }) {
  return (
    <div className="card flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      {/* Photo area */}
      <div className="relative">
        {expert.avatar ? (
          <img src={expert.avatar} alt={expert.nom} className="w-full h-44 object-cover" />
        ) : (
          <div className="w-full h-44 bg-gradient-to-br from-[#141313] to-[#2a1520] flex flex-col items-center justify-center gap-2">
            <div className="w-16 h-16 rounded-full bg-[#e46a33]/20 border-2 border-[#e46a33]/40 flex items-center justify-center text-white font-black text-2xl">
              {expert.nom.split(' ').map(n => n[0]).join('').slice(0,2)}
            </div>
            <span className="text-white/30 text-xs flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Photo à venir
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
          <svg className="w-3 h-3 text-[#e46a33] fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
          <span className="text-white text-xs font-bold">{expert.note}</span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="font-bold text-[#141313] text-base leading-tight">{expert.nom}</h3>
          <p className="text-[#e46a33] text-xs font-medium mt-0.5">{expert.titre}</p>
          <p className="text-[#8c8b8b] text-xs mt-1 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
            {expert.wilaya}{expert.exp ? ` · ${expert.exp} d'exp.` : ''}
          </p>
        </div>
        <div className="flex items-center gap-1 mb-3">
          {[1,2,3,4,5].map(s => (
            <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(expert.note) ? 'text-[#e46a33]' : 'text-[#e9e9e9]'} fill-current`} viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
          ))}
          <span className="text-[#8c8b8b] text-xs ml-1">{expert.missions} missions</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {expert.secteurs.map((s, i) => (
            <span key={i} className="bg-[#f9f9f8] border border-[#e9e9e9] text-[#434042] text-xs px-2 py-0.5 rounded-full">{s}</span>
          ))}
        </div>
        <div className="mt-auto">
          <p className="text-[#8c8b8b] text-xs mb-3">À partir de <span className="font-bold text-[#141313] text-sm">{expert.services[0]?.prix}</span></p>
          <button onClick={() => onViewServices(expert)} className="btn-primary w-full justify-center text-sm py-2.5">
            Voir les services →
          </button>
        </div>
      </div>
    </div>
  )
}

function ServicesModal({ expert, onClose, onRequest }) {
  if (!expert) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(20,19,19,0.6)' }}>
      <div className="card max-w-lg w-full max-h-[90vh] overflow-y-auto p-0">
        <div className="flex items-center justify-between p-6 border-b border-[#e9e9e9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#141313] flex items-center justify-center text-white font-bold text-sm">
              {expert.nom.split(' ').map(n => n[0]).join('').slice(0,2)}
            </div>
            <div>
              <h3 className="font-bold text-[#141313]">{expert.nom}</h3>
              <p className="text-[#8c8b8b] text-xs">{expert.titre}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#8c8b8b] hover:text-[#141313] text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6">
          <h4 className="font-semibold text-[#141313] mb-4">Services proposés</h4>
          <div className="space-y-3 mb-6">
            {expert.services.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-[#f9f9f8] rounded-lg border border-[#e9e9e9]">
                <div>
                  <p className="font-medium text-[#141313] text-sm">{s.nom}</p>
                  <p className="text-[#8c8b8b] text-xs mt-0.5">{s.duree}</p>
                </div>
                <p className="font-bold text-[#e46a33] text-sm whitespace-nowrap ml-4">{s.prix}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => onRequest(expert)}
            className="btn-primary w-full justify-center"
          >
            Demander un service →
          </button>
        </div>
      </div>
    </div>
  )
}

function RequestModal({ expert, onClose }) {
  const [form, setForm] = useState({ nom: '', email: '', phone: '', serviceType: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: form.nom,
          clientEmail: form.email,
          clientPhone: form.phone,
          subject: `Demande de service — ${form.serviceType}${expert ? ` (${expert.nom})` : ''}`,
          message: form.message,
        }),
      })
      if (res.ok) setSent(true)
      else { const d = await res.json(); setError(d.error || 'Erreur lors de l\'envoi') }
    } catch { setError('Erreur réseau, veuillez réessayer') }
    setLoading(false)
  }

  if (!onClose) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(20,19,19,0.6)' }}>
      <div className="card max-w-md w-full p-0 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#e9e9e9]">
          <h3 className="font-bold text-[#141313]">{expert ? `Contacter ${expert.nom}` : 'Demander un service'}</h3>
          <button onClick={onClose} className="text-[#8c8b8b] hover:text-[#141313] text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6">
          {sent ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-[#e46a33]/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[#e46a33]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-bold text-[#141313] mb-2">Demande envoyée !</p>
              <p className="text-[#8c8b8b] text-sm">L'expert vous contactera sous 24h.</p>
              <button onClick={onClose} className="btn-primary mt-6 mx-auto">Fermer</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[#434042] text-sm font-medium block mb-1">Votre nom</label>
                <input required className="input-dark w-full" value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} />
              </div>
              <div>
                <label className="text-[#434042] text-sm font-medium block mb-1">Email</label>
                <input required type="email" className="input-dark w-full" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div>
                <label className="text-[#434042] text-sm font-medium block mb-1">Téléphone</label>
                <input className="input-dark w-full" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
              <div>
                <label className="text-[#434042] text-sm font-medium block mb-1">Type de service</label>
                <select required className="input-dark w-full" value={form.serviceType} onChange={e => setForm({...form, serviceType: e.target.value})}>
                  <option value="">Sélectionner...</option>
                  {serviceTypes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[#434042] text-sm font-medium block mb-1">Décrivez votre besoin</label>
                <textarea required rows={4} className="input-dark w-full resize-none" value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Secteur d'activité, type de machine, budget indicatif..." />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? 'Envoi...' : 'Envoyer la demande →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ExpertsPage() {
  const [experts, setExperts] = useState(staticExperts)
  const [secteur, setSecteur] = useState('Tous')
  const [search, setSearch] = useState('')
  const [selectedExpert, setSelectedExpert] = useState(null)
  const [requestExpert, setRequestExpert] = useState(null)
  const [showServicesModal, setShowServicesModal] = useState(false)
  const [showRequest, setShowRequest] = useState(false)

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(d => {
        const approved = (d.users || []).filter(u => u.role === 'consultant' && u.approved)
        if (approved.length > 0) {
          setExperts(approved.map(u => ({
            id: u.id, nom: u.name, titre: u.sector || 'Expert industriel',
            exp: '', wilaya: u.wilaya || 'Algérie',
            secteurs: [u.sector || 'Industrie générale'],
            services: [{ nom: 'Consultation', prix: 'Sur devis', duree: 'Variable' }],
            note: 5.0, missions: 0,
          })))
        }
      })
      .catch(() => {})
  }, [])

  const filtered = experts.filter(e => {
    const matchSecteur = secteur === 'Tous' || e.secteurs.some(s => s.includes(secteur.split(' ')[0]))
    const matchSearch = !search || e.nom.toLowerCase().includes(search.toLowerCase()) || e.titre.toLowerCase().includes(search.toLowerCase())
    return matchSecteur && matchSearch
  })

  const handleViewServices = (expert) => {
    setSelectedExpert(expert)
    setShowServicesModal(true)
  }
  const handleRequest = (expert) => {
    setRequestExpert(expert)
    setShowServicesModal(false)
    setShowRequest(true)
  }

  return (
    <div className="min-h-screen">

      {/* HERO DARK */}
      <div className="bg-[#141313] pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#e46a33] animate-pulse"></span>
                <span className="text-white/80 text-sm font-medium">Services Experts</span>
              </div>
              <h1 className="hero-title text-white mb-5">
                L'expert industriel<br/><span style={{color:'#e46a33'}}>qu'il vous faut</span>
              </h1>
              <p className="text-white/60 text-base mb-8 leading-relaxed">
                Des experts vérifiés pour vous accompagner dans vos projets : sourcing, achat, audit technique, import et bien plus.
              </p>
              <button onClick={() => setShowRequest(true)} className="bg-[#e46a33] hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold text-sm transition-colors">
                Demander un service →
              </button>
            </div>
            {/* Expert inscription card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-7">
              <p className="text-[#e46a33] text-xs font-semibold mb-3 uppercase tracking-widest">Vous êtes expert ?</p>
              <h3 className="text-white font-black text-2xl mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                Inscription 100% gratuite
              </h3>
              <p className="text-white/50 text-sm mb-5 leading-relaxed">Accédez à des centaines de clients industriels algériens. Gérez vos services et tarifs librement.</p>
              <div className="space-y-2 mb-6">
                {['Profil public visible sur MachiNet', 'Définissez vos propres prix', 'Tableau de bord complet', 'Upload photo de profil'].map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#e46a33] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span className="text-white/60 text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/register?role=consultant" className="block w-full text-center bg-[#e46a33] hover:bg-orange-600 text-white py-3 rounded-xl font-semibold text-sm transition-colors">
                Rejoindre en tant qu'expert →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* EXPERTS MARKETPLACE */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="Rechercher un expert, un secteur..."
              className="input-dark h-12 flex-1"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {secteurOptions.map(s => (
              <button key={s} onClick={() => setSecteur(s)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${secteur === s ? 'bg-[#e46a33] text-white' : 'bg-white border border-[#e9e9e9] text-[#434042] hover:border-[#141313]'}`}>
                {s}
              </button>
            ))}
          </div>
          <p className="text-[#8c8b8b] text-sm mb-6">{filtered.length} expert{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map(e => (
              <ExpertCard key={e.id} expert={e} onViewServices={handleViewServices} />
            ))}
          </div>
        </div>
      </section>

      {/* EXPERTISES */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-1