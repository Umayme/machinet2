'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import MachineCard from '../../components/MachineCard'
import { normalizeMachine as normalize } from '../../lib/normalize'

const secteurs = ['Tous', 'Bâtiment & TP', 'Industrie Agroalimentaire', 'Agricole', 'Textile', 'Industrie', 'Pharma', 'Mining', 'Énergie']
const conditions = ['Tous', 'Vente neuf', 'Occasion']
const wilayas = ['Toutes','Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar','Blida','Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Alger','Djelfa','Jijel','Sétif','Saïda','Skikda','Sidi Bel Abbès','Annaba','Guelma','Constantine','Médéa','Mostaganem',"M'Sila",'Mascara','Ouargla','Oran','El Bayadh','Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf','Tissemsilt','El Oued','Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma','Aïn Témouchent','Ghardaïa','Relizane']

const avantages = [
  { titre: 'Vendeurs vérifiés', desc: 'Chaque vendeur passe par notre processus de vérification : documents, identité entreprise, réputation.', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>, color: '#10b981' },
  { titre: 'Contact direct', desc: "Échangez directement avec le vendeur. Pas d'intermédiaire. Devis gratuit en 24h.", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 3H3v18l4-4h14V3z" /></svg>, color: '#3b82f6' },
  { titre: 'Prix du marché', desc: 'Consultez notre base de données de prix pour négocier en connaissance de cause.', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>, color: '#f59e0b' },
  { titre: 'IA Advisor', desc: 'MachiBot analyse votre besoin et vous recommande les meilleures machines pour votre activité.', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>, color: '#8b5cf6' },
  { titre: '69 wilayas', desc: "Des vendeurs dans toute l'Algérie. Filtrez par wilaya pour réduire les frais de transport.", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, color: '#e46a33' },
  { titre: '0% Commission', desc: "MachiNet ne prend aucune commission sur vos achats. La plateforme est totalement gratuite pour les acheteurs.", icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: '#06b6d4' },
]

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
      .then(d => { setMachines((d.machines || []).map(normalize)); setLoading(false) })
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
    <div className="min-h-screen">

      {/* HERO DARK BAND */}
      <div className="bg-[#141313] pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#e46a33] animate-pulse"></span>
                <span className="text-white/80 text-sm font-medium">Pour les Acheteurs</span>
              </div>
              <h1 className="hero-title text-white mb-5">
                Trouvez votre<br/><span style={{color:'#e46a33'}}>machine idéale</span>
              </h1>
              <p className="text-white/60 text-base mb-8 leading-relaxed">
                Des centaines de machines vérifiées dans toute l'Algérie. Comparez, contactez, achetez — sans intermédiaire.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Vendeurs vérifiés', icon: '✓' },
                  { label: 'Prix transparents', icon: '✓' },
                  { label: 'Conseil IA inclus', icon: '✓' },
                  { label: '69 wilayas', icon: '✓' },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/70 text-sm">
                    <span className="text-[#e46a33] font-bold">{f.icon}</span>{f.label}
                  </div>
                ))}
              </div>
            </div>

            {/* IA CARD */}
            <div className="rounded-2xl p-6 relative overflow-hidden" style={{backgroundImage:"url('/images/heroconseil.png')",backgroundSize:"cover",backgroundPosition:"center"}}>
              <div className="absolute inset-0 bg-black/70 rounded-2xl" />
              <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden">
                  <img src="/images/machibot.png" alt="MachiBot" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Demande assistée par IA</h3>
                  <p className="text-white/50 text-xs">MachiBot trouve en 30 secondes</p>
                </div>
              </div>
              <p className="text-white/60 text-sm mb-5 leading-relaxed">Décrivez votre besoin en quelques mots et MachiBot vous trouve les meilleures offres disponibles.</p>
              <Link href="/ia-bots" className="block w-full text-center bg-[#e46a33] hover:bg-orange-600 text-white py-3 rounded-xl font-semibold text-sm transition-colors">
                Parler à MachiBot →
              </Link>
              <div className="flex items-center justify-center gap-4 mt-4 text-white/30 text-xs">
                <span>Sans inscription</span>
                <span>·</span>
                <span>Réponse instantanée</span>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH + FILTERS — sticky below hero */}
      <div className="bg-white border-b border-[#e9e9e9] shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c8b8b]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Rechercher une machine, marque, fournisseur..." className="input-dark h-11 pl-10 w-full" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="input-dark h-11 w-full md:w-44 text-sm" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="recent">Plus récents</option>
              <option value="prix-asc">Prix croissant</option>
              <option value="prix-desc">Prix décroissant</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2 mt-3 items-center">
            <span className="text-[#8c8b8b] text-xs font-medium">Secteur :</span>
            {secteurs.map(s => (
              <button key={s} onClick={() => setSecteur(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${secteur === s ? 'bg-[#141313] text-white border-[#141313]' : 'bg-white text-[#8c8b8b] border-[#e9e9e9] hover:border-[#141313]'}`}>
                {s}
              </button>
            ))}
            <span className="text-[#8c8b8b] text-xs font-medium ml-2">Type :</span>
            {conditions.map(c => (
              <button key={c} onClick={() => setCondition(c)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${condition === c ? 'bg-[#e46a33] text-white border-[#e46a33]' : 'bg-white text-[#8c8b8b] border-[#e9e9e9] hover:border-[#e46a33]'}`}>
                {c}
              </button>
            ))}
            <select className="input-dark h-8 text-xs w-36 ml-1" value={wilaya} onChange={e => setWilaya(e.target.value)}>
              {wilayas.map(w => <option key={w}>{w}</option>)}
            </select>
            <label className="flex items-center gap-1.5 cursor-pointer ml-1">
              <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)} className="w-3.5 h-3.5 accent-[#e46a33]" />
              <span className="text-[#8c8b8b] text-xs">Vérifiés</span>
            </label>
            <button onClick={() => { setSearch(''); setSecteur('Tous'); setCondition('Tous'); setWilaya('Toutes'); setVerifiedOnly(false) }}
              className="ml-auto text-[#e46a33] text-xs hover:underline">Réinitialiser</button>
          </div>
        </div>
      </div>

      {/* RESULTS */}
      <section className="py-10 max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[#8c8b8b] text-sm font-medium">
            {loading ? 'Chargement...' : <><span className="text-[#141313] font-bold">{filtered.length}</span> machine{filtered.length !== 1 ? 's' : ''} trouvée{filtered.length !== 1 ? 's' : ''}</>}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="card h-72 skeleton"></div>)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(m => <MachineCard key={m.id} machine={m} />)}
          </div>
        ) : (
          <div className="card p-16 text-center">
            <svg className="w-16 h-16 text-[#e9e9e9] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-xl font-bold text-[#141313] mb-2">Aucune machine trouvée</p>
            <p className="text-[#8c8b8b] text-sm mb-6">Essayez d'autres filtres ou demandez à MachiBot.</p>
            <Link href="/ia-bots" className="btn-primary">Consulter MachiBot</Link>
          </div>
        )}
      </section>

      {/* AVANTAGES */}
      <section className="py-16 bg-[#f9f9f8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">Pourquoi acheter via MachiNet ?</h2>
            <p className="section-subtitle">La plateforme qui simplifie votre sourcing industriel</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {avantages.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[#e9e9e9] hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors" style={{ background: f.color + '15', color: f.color }}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-[#141313] mb-2">{f.titre}</h3>
                <p className="text-[#8c8b8b] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 max-w-4xl mx-auto px-6 text-center">
        <div className="rounded-2xl p-12 relative overflow-hidden" style={{ backgroundImage:"url('/images/heroconseil.png')", backgroundSize:'cover', backgroundPosition:'center' }}>
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative z-10">
            <h2 className="hero-title text-white mb-3">Pas sûr de votre choix ?</h2>
            <p className="text-white/60 mb-8">MachiBot analyse votre besoin et vous recommande la machine idéale pour votre activité et votre budget.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/ia-bots" className="bg-[#e46a33] text-white px-10 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors">Parler à MachiBot →</Link>
              <Link href="/experts" className="bg-white/10 text-white border border-white/20 px-10 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors">Consulter un expert</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
