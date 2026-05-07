'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import MachineCard from '../components/MachineCard'

const stats = [
  { value: '500+', label: 'Fournisseurs vérifiés' },
  { value: '3 200+', label: 'Machines disponibles' },
  { value: '69', label: 'Wilayas couvertes' },
  { value: '15+', label: 'Secteurs couverts' },
]

const secteurs = [
  { label: 'Industrie Agroalimentaire', desc: 'Agroalimentaire', href: '/catalogue?secteur=IAA', img: '/images/iaa.png' },
  { label: 'Bâtiment & Travaux Publics', desc: 'Construction', href: '/catalogue?secteur=BTP', img: '/images/btp.png' },
  { label: 'Agricole', desc: 'Agriculture', href: '/catalogue?secteur=Agricole', img: '/images/agricole.png' },
  { label: 'Pharma', desc: 'Pharmaceutique', href: '/catalogue?secteur=Pharma', img: '/images/pharma.png' },
  { label: 'Bois', desc: 'Menuiserie', href: '/catalogue?secteur=Bois', img: '/images/bois.png' },
  { label: 'Textile', desc: 'Habillement', href: '/catalogue?secteur=Textile', img: '/images/textile.png' },
  { label: 'Mining', desc: 'Carrières & Mines', href: '/catalogue?secteur=Mining', img: '/images/mining.png' },
  { label: 'Énergie', desc: 'Électrique & Solaire', href: '/catalogue?secteur=Energie', img: '/images/energie.png' },
]

const temoignages = [
  { nom: 'Ahmed Bensalem', poste: 'Directeur usine', wilaya: 'Blida', note: 5, texte: "Grâce à MachiNet j'ai trouvé ma ligne de conditionnement en 3 jours au lieu de 3 mois." },
  { nom: 'Karim Mansouri', poste: 'Importateur machines', wilaya: 'Alger', note: 5, texte: "En tant que fournisseur, j'ai reçu 12 leads qualifiés le premier mois d'abonnement." },
  { nom: 'Fatima Zerrouki', poste: 'Entrepreneur', wilaya: 'Oran', note: 4, texte: "L'IA Advisor m'a aidée à choisir la bonne pelle hydraulique selon mon budget." },
]

const prixMarche = [
  { machine: 'Pelle hydraulique 20T', fourchette: '8,5M – 12M DZD', tendance: '↗', pct: '+8%' },
  { machine: 'Ligne emballage Industrie Agroalimentaire', fourchette: '3,2M – 6,8M DZD', tendance: '→', pct: 'stable' },
  { machine: 'Tracteur agricole 80CV', fourchette: '2,1M – 3,9M DZD', tendance: '↘', pct: '-2%' },
  { machine: 'Pasteurisateur 500L', fourchette: '800K – 1,5M DZD', tendance: '↗', pct: '+3%' },
]

function normalizeMachine(m) {
  return {
    id: m.id, nom: m.name || m.nom,
    fournisseur: m.seller?.name || m.seller?.company || m.fournisseur || 'Vendeur',
    wilaya: m.wilaya, prix: String(m.price || m.prix || 0),
    type: m.condition || m.type || 'Vente neuf',
    secteur: m.category || m.secteur || 'Industrie',
    verifie: m.verified ?? m.verifie ?? false,
    photos: m.photos,
  }
}

const SECTEURS_FILTER = ['Tous', 'Industrie Agroalimentaire', 'Bâtiment & Travaux Publics', 'Agricole', 'Pharma', 'Textile', 'Mining', 'Énergie', 'Bois']
const TYPES_FILTER = ['Tous types', 'Vente neuf', 'Occasion']
const WILAYAS_FILTER = ['Toutes wilayas', 'Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Sétif', 'Tlemcen']

function StarRating({ note }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-4 h-4 ${i <= note ? 'text-[#e46a33]' : 'text-[#e9e9e9]'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [featuredMachines, setFeaturedMachines] = useState([])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filterSecteur, setFilterSecteur] = useState('Tous')
  const [filterType, setFilterType] = useState('Tous types')
  const [filterWilaya, setFilterWilaya] = useState('Toutes wilayas')
  const [compareList, setCompareList] = useState([])
  const [compareOpen, setCompareOpen] = useState(false)
  const filtersRef = useRef(null)

  useEffect(() => {
    fetch('/api/machines?limit=6')
      .then(r => r.json())
      .then(d => { if (d.machines?.length) setFeaturedMachines(d.machines.map(normalizeMachine)) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (filtersRef.current && !filtersRef.current.contains(e.target)) setFiltersOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (filterSecteur !== 'Tous') params.set('secteur', filterSecteur)
    if (filterType !== 'Tous types') params.set('type', filterType)
    if (filterWilaya !== 'Toutes wilayas') params.set('wilaya', filterWilaya)
    window.location.href = `/catalogue?${params.toString()}`
  }

  const toggleCompare = (machine) => {
    setCompareList(prev => {
      const exists = prev.find(m => m.id === machine.id)
      if (exists) return prev.filter(m => m.id !== machine.id)
      if (prev.length >= 3) return prev
      return [...prev, machine]
    })
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <img src="/images/hero-bg.png" alt="MachiNet" className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/35 z-[1]"></div>
        <div className="grid-bg absolute inset-0 z-[2] opacity-20"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 text-center w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor:'#e46a33'}}></span>
            <span className="text-white/90 text-sm">1ère plateforme B2B machines industrielles en Algérie</span>
          </div>

          {/* Headline */}
          <h1 className="hero-title mb-4">
            <span className="text-white block">where the machines</span>
            <span style={{color:'#e46a33'}} className="block">connect</span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
            La plateforme qui connecte acheteurs et fournisseurs de machines industrielles
          </p>

          {/* Search bar */}
          <div className="max-w-3xl mx-auto" ref={filtersRef}>
            <div className="bg-white/95 rounded-xl p-2 flex items-center gap-2 shadow-lg">
              <input
                type="text"
                placeholder="Rechercher une machine, marque, catégorie..."
                className="flex-1 bg-transparent border-none outline-none text-[#141313] text-sm placeholder-[#8c8b8b] px-3 h-11"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="btn-primary h-11 px-6 text-sm whitespace-nowrap rounded-lg flex-shrink-0"
              >
                Rechercher
              </button>
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`h-11 px-4 text-sm font-medium border rounded-lg flex items-center gap-1.5 transition-all flex-shrink-0 ${filtersOpen ? 'bg-[#141313] text-white border-[#141313]' : 'border-[#e9e9e9] text-[#434042] hover:border-[#141313]'}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtrer
                <svg className={`w-3 h-3 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Filter panel */}
            {filtersOpen && (
              <div className="bg-white border border-[#e9e9e9] rounded-xl mt-2 p-5 shadow-xl text-left">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="text-xs font-semibold text-[#434042] uppercase tracking-wide mb-2 block">Secteur</label>
                    <select
                      value={filterSecteur}
                      onChange={e => setFilterSecteur(e.target.value)}
                      className="input-dark text-sm"
                    >
                      {SECTEURS_FILTER.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#434042] uppercase tracking-wide mb-2 block">Type d'offre</label>
                    <select
                      value={filterType}
                      onChange={e => setFilterType(e.target.value)}
                      className="input-dark text-sm"
                    >
                      {TYPES_FILTER.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#434042] uppercase tracking-wide mb-2 block">Wilaya</label>
                    <select
                      value={filterWilaya}
                      onChange={e => setFilterWilaya(e.target.value)}
                      className="input-dark text-sm"
                    >
                      {WILAYAS_FILTER.map(w => <option key={w}>{w}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button onClick={() => { setFilterSecteur('Tous'); setFilterType('Tous types'); setFilterWilaya('Toutes wilayas') }}
                    className="text-xs text-[#8c8b8b] hover:text-[#141313] mr-4 transition-colors">
                    Réinitialiser
                  </button>
                  <button onClick={handleSearch} className="btn-primary text-sm py-2 px-5">
                    Appliquer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-14 border-b border-[#e9e9e9]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="stat-value mb-1">{s.value}</div>
                <div className="text-[#8c8b8b] text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTEURS ── */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="section-title mb-3">Tous les secteurs. Une seule plateforme.</h2>
          <p className="section-subtitle">Parcourez par secteur d'activité</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {secteurs.map((s, i) => (
            <Link key={i} href={s.href} className="relative rounded-xl overflow-hidden group h-32">
              {s.img && (
                <img src={s.img} alt={s.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="relative z-10 h-full flex flex-col items-start justify-end p-3">
                <div className="text-white font-bold text-sm leading-tight">{s.label}</div>
                <div className="text-white/70 text-xs">{s.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── MACHINES EN VEDETTE ── */}
      <section className="py-16 bg-[#f9f9f8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title mb-1">Machines en vedette</h2>
              <p className="section-subtitle">Sélectionnées par notre équipe</p>
            </div>
            <Link href="/catalogue" className="btn-outline text-sm">Voir tout →</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredMachines.length > 0
              ? featuredMachines.map(m => (
                  <MachineCard key={m.id} machine={m} onCompare={toggleCompare} compareList={compareList} />
                ))
              : [...Array(6)].map((_, i) => (
                  <div key={i} className="card overflow-hidden">
                    <div className="skeleton h-52 rounded-none"></div>
                    <div className="p-4 space-y-3">
                      <div className="skeleton h-4 w-3/4"></div>
                      <div className="skeleton h-3 w-1/2"></div>
                      <div className="skeleton h-3 w-1/3"></div>
                      <div className="flex justify-between items-center pt-2">
                        <div className="skeleton h-6 w-1/3"></div>
                        <div className="skeleton h-8 w-16 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                ))
            }
          </div>

          {/* Compare bar */}
          {compareList.length >= 2 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
              <div className="bg-[#141313] text-white rounded-xl px-5 py-3 flex items-center gap-4 shadow-2xl">
                <span className="text-sm font-medium">{compareList.length} machines sélectionnées</span>
                <button onClick={() => setCompareOpen(true)} className="bg-[#e46a33] text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors">
                  Comparer
                </button>
                <button onClick={() => setCompareList([])} className="text-white/50 hover:text-white text-sm transition-colors">×</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── COMPARE MODAL ── */}
      {compareOpen && compareList.length >= 2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141313]/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#e9e9e9]">
              <h3 className="font-bold text-[#141313] text-lg" style={{fontFamily:'Barlow Condensed,sans-serif'}}>Comparer les machines</h3>
              <button onClick={() => setCompareOpen(false)} className="text-[#8c8b8b] hover:text-[#141313] text-xl">×</button>
            </div>
            <div className="overflow-x-auto p-5">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left text-[#8c8b8b] text-xs uppercase tracking-wide pb-4 pr-4 w-36">Caractéristique</th>
                    {compareList.map(m => (
                      <th key={m.id} className="text-left pb-4 px-3">
                        <p className="font-semibold text-[#141313] text-sm line-clamp-2">{m.nom}</p>
                        <p className="text-[#8c8b8b] text-xs">{m.wilaya}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Catégorie', m => m.secteur],
                    ['Type', m => m.type],
                    ['Fournisseur', m => m.fournisseur],
                    ['Wilaya', m => m.wilaya],
                    ['Prix', m => parseInt(m.prix).toLocaleString('fr-DZ') + ' DZD'],
                    ['État', m => m.type],
                    ['Vérifié', m => m.verifie ? '✓ Oui' : '—'],
                  ].map(([label, fn]) => (
                    <tr key={label} className="border-t border-[#f9f9f8]">
                      <td className="py-3 pr-4 text-[#8c8b8b] text-xs font-medium">{label}</td>
                      {compareList.map(m => (
                        <td key={m.id} className="py-3 px-3 text-[#141313] text-sm">{fn(m)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── COMMENT ÇA MARCHE ── */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="section-title mb-3">Comment ça marche ?</h2>
          <p className="section-subtitle">Simple, rapide, efficace</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              role: 'A', title: 'Pour les Acheteurs', href: '/acheteurs', cta: 'En savoir plus →',
              steps: [
                { n: '1', titre: 'Décrivez votre besoin', desc: 'Secteur, type de machine, budget et wilaya. Recherche avancée et filtres.' },
                { n: '2', titre: 'Recevez des recommandations IA', desc: 'Comparatif prix, fournisseurs vérifiés, spécifications côte à côte.' },
                { n: '3', titre: 'Contactez directement', desc: 'Mise en relation directe, devis gratuit, sans intermédiaire.' },
              ]
            },
            {
              role: 'V', title: 'Pour les Vendeurs', href: '/vendeurs', cta: 'Devenir vendeur →',
              steps: [
                { n: '1', titre: 'Créez votre profil', desc: "Profil entreprise professionnel, badge vérifié, visible dans toute l'Algérie." },
                { n: '2', titre: 'Publiez votre catalogue', desc: 'Ajoutez vos machines en minutes. Photos, specs, prix, disponibilité.' },
                { n: '3', titre: 'Recevez des leads qualifiés', desc: "Acheteurs avec vraie intention d'achat. Dashboard analytics inclus." },
              ]
            }
          ].map(card => (
            <div key={card.role} className="card p-7">
              <div className="flex items-center gap-3 mb-7 pb-5 border-b border-[#e9e9e9]">
                <div className="w-9 h-9 rounded-lg bg-[#141313] flex items-center justify-center text-white font-bold text-sm">{card.role}</div>
                <h3 className="text-[#141313] font-bold text-base">{card.title}</h3>
              </div>
              {card.steps.map(step => (
                <div key={step.n} className="flex gap-4 mb-5 last:mb-0">
                  <div className="w-7 h-7 rounded-full border-2 border-[#141313] flex items-center justify-center text-[#141313] text-xs font-bold flex-shrink-0 mt-0.5">{step.n}</div>
                  <div>
                    <h4 className="text-[#141313] font-semibold text-sm mb-0.5">{step.titre}</h4>
                    <p className="text-[#8c8b8b] text-xs leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
              <div className="mt-6 pt-5 border-t border-[#e9e9e9]">
                <Link href={card.href} className="btn-primary text-sm">{card.cta}</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── IA ADVISOR ── */}
      <section className="py-16 bg-[#141313]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="hero-title text-white mb-4">
            Pas sûr de quelle machine choisir ?
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
            MachiBot analyse votre activité, votre budget et vos besoins pour vous recommander exactement la bonne machine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mx-auto sm:max-w-none">
            <Link href="/ia-bots" className="bg-[#e46a33] text-white px-10 py-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-base inline-flex items-center justify-center gap-2 w-full sm:w-auto">
              Parler à MachiBot
            </Link>
            <Link href="/experts" className="text-base px-10 py-4 rounded-lg font-semibold border-2 border-white bg-white text-[#141313] hover:bg-transparent hover:text-white transition-all inline-flex items-center justify-center w-full sm:w-auto">
              Consulter un expert
            </Link>
          </div>
          <p className="text-white/30 text-sm mt-4">Réponse instantanée · Sans inscription</p>
        </div>
      </section>

      {/* ── PRIX DU MARCHÉ ── */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="section-title mb-4">Les prix réels du marché algérien</h2>
            <p className="section-subtitle mb-8">Fini les prix opaques. Connaissez la valeur du marché avant d'acheter ou de vendre.</p>
            <div className="flex gap-3">
              <Link href="/marche" className="btn-primary">Voir le marché →</Link>
              <Link href="/prix" className="btn-outline">Tous les prix</Link>
            </div>
          </div>
          <div className="space-y-2">
            {prixMarche.map((p, i) => (
              <div key={i} className="card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 font-bold
                    ${p.tendance === '↗' ? 'bg-green-50 text-green-600' : p.tendance === '↘' ? 'bg-red-50 text-red-500' : 'bg-[#f9f9f8] text-[#8c8b8b]'}`}>
                    {p.tendance}
                  </div>
                  <div>
                    <p className="text-[#141313] text-sm font-medium">{p.machine}</p>
                    <p className="text-[#8c8b8b] text-xs mt-0.5">{p.fourchette}</p>
                  </div>
                </div>
                <span className={`tag text-xs ${p.tendance === '↗' ? 'bg-green-50 text-green-600 border-green-200' : p.tendance === '↘' ? 'bg-red-50 text-red-500 border-red-200' : ''}`}>
                  {p.pct}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="py-16 bg-[#f9f9f8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="section-title mb-3">Ils nous font confiance</h2>
            <p className="section-subtitle">Des industriels algériens satisfaits</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {temoignages.map((t, i) => (
              <div key={i} className="card p-6 bg-white">
                <StarRating note={t.note} />
                <p className="text-[#434042] text-sm leading-relaxed my-4 italic">"{t.texte}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#e9e9e9]">
                  <div className="w-9 h-9 rounded-full bg-[#141313] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {t.nom[0]}
                  </div>
                  <div>
                    <p className="text-[#141313] text-sm font-semibold">{t.nom}</p>
                    <p className="text-[#8c8b8b] text-xs">{t.poste} · {t.wilaya}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-20 max-w-4xl mx-auto px-6 text-center">
        <h2 className="hero-title text-[#141313] mb-4">Rejoignez MachiNet</h2>
        <p className="text-[#8c8b8b] text-lg mb-10 max-w-xl mx-auto">
          La première plateforme B2B de machines industrielles en Algérie.<br/>Acheteurs, vendeurs, experts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/catalogue" className="btn-primary text-base px-10 py-4">Parcourir le catalogue</Link>
          <Link href="/register" className="btn-outline text-base px-10 py-4">Créer un compte</Link>
        </div>
      </section>

    </div>
  )
}
