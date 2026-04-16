'use client'
import { useState } from 'react'
import Link from 'next/link'

const services = [
  {
    titre: 'Audit & Sourcing',
    prix: '45 000 DZD',
    duree: '3-5 jours',
    desc: "Analyse de vos besoins, identification des meilleures machines sur le marché algérien et international, recommandations documentées.",
    inclus: ['Analyse des besoins', 'Benchmark 3+ fournisseurs', 'Rapport technique', 'Recommandation finale'],
  },
  {
    titre: 'Accompagnement Achat',
    prix: '75 000 DZD',
    duree: '1-2 semaines',
    desc: "De la sélection du fournisseur jusqu'à la signature du contrat. Négociation, vérification technique, gestion administrative.",
    inclus: ['Tout Audit & Sourcing', 'Négociation prix', 'Vérification technique', 'Assistance contrat'],
    badge: 'Populaire',
  },
  {
    titre: 'Projet Clé en Main',
    prix: 'Sur devis',
    duree: 'Variable',
    desc: "Pour les projets industriels complets. Étude de faisabilité, installation, formation des équipes, mise en route.",
    inclus: ['Tout Accompagnement', 'Gestion projet complète', 'Installation & démarrage', 'Formation opérateurs'],
  },
]

const expertises = [
  { secteur: 'IAA & Agroalimentaire', desc: 'Lignes de production, équipements laitiers, boulangerie, conserveries' },
  { secteur: 'BTP & Construction', desc: 'Engins de chantier, centrales à béton, équipements de terrassement' },
  { secteur: 'Agriculture', desc: 'Tracteurs, équipements d\'irrigation, serres, stockage frigorifique' },
  { secteur: 'Industrie générale', desc: 'Compresseurs, tours CNC, soudure, manutention' },
  { secteur: 'Énergie & Utilities', desc: 'Groupes électrogènes, panneaux solaires, stations de pompage' },
  { secteur: 'Import & Douanes', desc: 'Accompagnement import, classification douanière, domiciliation' },
]

const consultants = [
  { nom: 'Mehdi Tounsi', titre: 'Expert IAA & Process', exp: '15 ans', wilaya: 'Alger', specialite: 'IAA · Pharma' },
  { nom: 'Amina Khelil', titre: 'Ingénieure BTP', exp: '12 ans', wilaya: 'Oran', specialite: 'BTP · Infrastructure' },
  { nom: 'Salim Benali', titre: 'Expert Agri & Import', exp: '10 ans', wilaya: 'Sétif', specialite: 'Agricole · Import DZ' },
]

export default function ConsultingPage() {
  const [form, setForm] = useState({ nom: '', email: '', phone: '', secteur: '', message: '' })
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
          subject: `Consultation ${form.secteur}`,
          message: form.message,
        }),
      })
      if (res.ok) {
        setSent(true)
      } else {
        const d = await res.json()
        setError(d.error || 'Erreur lors de l\'envoi')
      }
    } catch {
      setError('Erreur réseau, veuillez réessayer')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen pt-20">

      {/* HERO */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-900/20 border border-purple-800/40 rounded-full px-4 py-2 mb-6">
            <span className="text-purple-300 text-sm font-medium">Conseil industriel expert</span>
          </div>
          <h1 className="section-title text-5xl mb-6">Consulting Industriel MachiNet</h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            Nos experts industriels vous accompagnent dans vos projets d'investissement en machines. De l'audit à la mise en route.
          </p>
        </div>

        {/* SERVICES */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {services.map((s, i) => (
            <div key={i} className={`card p-8 relative ${s.badge ? 'border-purple-600/50' : ''}`}>
              {s.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-700 text-white text-xs font-bold px-4 py-1 rounded-full">
                  {s.badge}
                </span>
              )}
              <h3 className="text-white font-black text-xl mb-2">{s.titre}</h3>
              <div className="flex items-center gap-3 mb-4">
                <p className="text-purple-400 font-bold text-lg">{s.prix}</p>
                <span className="text-gray-600 text-sm">· {s.duree}</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{s.desc}</p>
              <ul className="space-y-2 mb-6">
                {s.inclus.map((item, j) => (
                  <li key={j} className="flex items-center gap-2 text-gray-300 text-sm">
                    <span className="text-purple-400 text-xs">•</span>{item}
                  </li>
                ))}
              </ul>
              <a href="#contact-form" className="btn-primary w-full justify-center block text-center">Demander un devis</a>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERTISES */}
      <section className="py-20 bg-gradient-to-b from-black via-purple-950/5 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Nos domaines d'expertise</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {expertises.map((e, i) => (
              <div key={i} className="card p-5">
                <h3 className="text-white font-semibold text-sm mb-1">{e.secteur}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONSULTANTS */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">Notre équipe d'experts</h2>
          <p className="section-subtitle">Des ingénieurs et industriels algériens expérimentés</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {consultants.map((c, i) => (
            <div key={i} className="card p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white font-black text-2xl mx-auto mb-4">
                {c.nom[0]}
              </div>
              <h3 className="text-white font-bold mb-1">{c.nom}</h3>
              <p className="text-purple-400 text-sm mb-1">{c.titre}</p>
              <p className="text-gray-500 text-xs mb-3">{c.exp} d'expérience · {c.wilaya}</p>
              <span className="badge-verified text-xs">{c.specialite}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FORMULAIRE CONTACT */}
      <section id="contact-form" className="py-20 bg-gradient-to-b from-black via-purple-950/5 to-black">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="section-title mb-4">Demander une consultation</h2>
            <p className="section-subtitle">Réponse sous 24h</p>
          </div>
          {sent ? (
            <div className="card p-12 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-white font-bold text-xl mb-2">Demande envoyée !</h3>
              <p className="text-gray-400 mb-6">Un consultant vous contactera dans les 24 heures.</p>
              <button onClick={() => { setSent(false); setForm({ nom: '', email: '', phone: '', secteur: '', message: '' }) }}
                className="btn-outline text-sm py-2 px-6">Nouvelle demande</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Nom complet *</label>
                  <input required className="input-dark h-12" placeholder="Votre nom" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Email *</label>
                  <input required type="email" className="input-dark h-12" placeholder="votre@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Téléphone</label>
                <input className="input-dark h-12" placeholder="+213 XX XX XX XX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Secteur d'activité *</label>
                <select required className="input-dark h-12" value={form.secteur} onChange={e => setForm({ ...form, secteur: e.target.value })}>
                  <option value="">Sélectionner...</option>
                  <option>IAA & Agroalimentaire</option>
                  <option>BTP & Construction</option>
                  <option>Agriculture</option>
                  <option>Industrie générale</option>
                  <option>Énergie & Utilities</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Décrivez votre besoin *</label>
                <textarea required rows={4} className="input-dark resize-none"
                  placeholder="Quel type de machine cherchez-vous ? Quelle est votre capacité de production souhaitée ? Quel est votre budget ?"
                  value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center h-12 text-base disabled:opacity-50">
                {loading ? 'Envoi en cours...' : 'Envoyer ma demande →'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
