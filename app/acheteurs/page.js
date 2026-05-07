'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import MachineCard from '../../components/MachineCard'
import { normalizeMachine as normalize } from '../../lib/normalize'

const secteurs = ['Tous', 'Bâtiment & TP', 'Industrie Agroalimentaire', 'Agricole', 'Textile', 'Industrie', 'Pharma', 'Mining', 'Énergie']
const conditions = ['Tous', 'Vente neuf', 'Occasion']
const wilayas = ['Toutes', 'Alger', 'Oran', 'Constantine', 'Blida', 'Sétif', 'Annaba', 'Tlemcen', 'Batna', 'Béjaïa', 'Biskra', 'Tiaret', 'Boumerdès', 'Tipaza', 'Médéa']

export default function AcheteursPage() {
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [secteur, setSecteur] = useState('Tous')
  const [condition, setCondition] = useState('Tous')
  const [wilaya, setWilaya] = useState('Toutes')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sort, setSort] = useState('recent')

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (secteur !== 'Tous') params.set('category', secteur)
    if (wilaya !== 'Toutes') params.set('wilaya', wilaya)
    if (condition !== 'Tous') params.set('condition', condition)
    params.set('limit', '50')

    fetch(`/api/machines?${params}`)
      .then(r => r.json())
      .then(d => {
        setMachines((d.machines || []).map(normalize))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [search, secteur, wilaya, condition])

  const filtered = machines
    .filter(m => verifiedOnly ? m.verifie : true)
    .sort((a, b) => {
      if (sort === 'prix-asc') return parseInt(a.prix) - parseInt(b.prix)
      if (sort === 'prix-desc') return parseInt(b.prix) - parseInt(a.prix)
      return 0
    })

  return (
    <div className="min-h-screen pt-20">

      {/* HERO */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#f9f9f8] border border-[#e9e9e9] rounded-full px-4 py-2 mb-6">
              <span className="text-[#e46a33] text-sm font-medium">Pour les Acheteurs</span>
            </div>
            <h1 className="section-title text-5xl mb-6">Trouvez votre machine industrielle en Algérie</h1>
            <p className="section-subtitle mb-8">
              Accédez à des centaines de machines vérifiées. Comparez les prix, contactez directement les vendeurs et obtenez des devis gratuits.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {['Vendeurs vérifiés', 'Prix transparents', 'Conseil expert inclus', '69 wilayas'].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-[#434042] text-sm">
                  <span className="text-[#e46a33]">•</span>{f}
                </div>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold text-[#141313] mb-2">Demande assistée par IA</h3>
            <p className="text-[#8c8b8b] text-sm mb-4">Décrivez votre besoin et MachiBot vous trouve les meilleures offres.</p>
            <Link href="/ia-bots" className="btn-primary w-full justify-center">Parler à MachiBot</Link>
            <div className="mt-4 pt-4 border-t border-[#e9e9e9]">
              <p className="text-[#434042] text-xs text-center">Sans inscription · Réponse en 30 sec</p>
            </div>
          </div>
        </div>

        {/* SEARCH + FILTERS */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Rechercher une machine ou un fournisseur..."
            className="input-dark h-12 flex-1"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="input-dark h-12 w-full md:w-40" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="recent">Plus récents</option>
            <option value="prix-asc">Prix croissant</option>
            <option value="prix-desc">Prix décroissant</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-[#8c8b8b] text-sm">Secteur:</span>
            {secteurs.map(s => (
              <button key={s} onClick={() => setSecteur(s)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${secteur === s ? 'bg-[#e46a33] text-white' : 'bg-white/5 text-[#8c8b8b] hover:bg-[#f9f9f8] border border-[#e9e9e9]'}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-[#8c8b8b] text-sm">Type:</span>
            {conditions.map(c => (
              <button key={c} onClick={() => setCondition(c)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${condition === c ? 'bg-[#e46a33] text-white' : 'bg-white/5 text-[#8c8b8b] hover:bg-[#f9f9f8] border border-[#e9e9e9]'}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-[#8c8b8b] text-sm">Wilaya:</span>
            <select className="input-dark h-9 text-sm w-40" value={wilaya} onChange={e => setWilaya(e.target.value)}>
              {wilayas.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)} className="w-4 h-4 accent-[#e46a33]" />
            <span className="text-[#8c8b8b] text-sm">Vérifiés seulement</span>
          </label>
        </div>

        {/* RESULTS */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[#8c8b8b] text-sm">
            {loading ? 'Chargement...' : <>{filtered.length} machine{filtered.length !== 1 ? 's' : ''} trouvée{filtered.length !== 1 ? 's' : ''}</>}
          </p>
          <button onClick={() => { setSearch(''); setSecteur('Tous'); setCondition('Tous'); setWilaya('Toutes'); setVerifiedOnly(false) }}
            className="text-[#e46a33] text-sm hover:text-[#e46a33] transition-colors">
            Réinitialiser les filtres
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="card h-64 animate-pulse bg-[#f9f9f8]"></div>)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(m => <MachineCard key={m.id} machine={m} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl font-bold text-[#141313] mb-2">Aucune machine trouvée</p>
            <p className="text-[#8c8b8b] text-sm">Essayez d'autres filtres ou consultez notre conseiller IA.</p>
            <Link href="/ia-bots" className="btn-primary mt-6 inline-flex">Consulter MachiBot</Link>
          </div>
        )}
      </section>

      {/* AVANTAGES */}
      <section className="py-20 bg-gradient-to-b from-[#f9f9f8] to-[#f9f9f8]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="section-title text-center mb-4">Pourquoi acheter via MachiNet ?</h2>
          <p className="section-subtitle text-center mb-12">La plateforme qui simplifie votre sourcing industriel</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { titre: 'Vendeurs vérifiés', desc: 'Chaque vendeur passe par notre processus de vérification : documents, identité entreprise, réputation.' },
              { titre: 'Contact direct', desc: 'Échangez directement avec le vendeur. Pas d\'intermédiaire. Devis gratuit en 24h.' },
              { titre: 'Prix du marché', desc: 'Consultez notre base de données de prix pour négocier en connaissance de cause.' },
              { titre: 'Advisor expert', desc: 'MachiBot analyse votre besoin et vous recommande les meilleures machines pour votre activité.' },
              { titre: '69 wilayas', desc: 'Des vendeurs dans toute l\'Algérie. Filtrez par wilaya pour réduire les frais de transport.' },
              { titre: 'Occasion & neuf', desc: 'Comparez machines neuves et d\'occasion. Filtrez par état, année, kilométrage.' },
            ].map((f, i) => (
              <div key={i} className="card p-6">
                <h3 className="font-semibold text-[#141313] mb-2">{f.titre}</h3>
                <p className="text-[#8c8b8b] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
