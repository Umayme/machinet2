'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import MachineCard from '../components/MachineCard'

const stats = [
  { value: '500+', label: 'Fournisseurs vérifiés' },
  { value: '3 200+', label: 'Machines disponibles' },
  { value: '69', label: 'Wilayas couvertes' },
  { value: '15+', label: 'Secteurs couverts' },
]

const secteurs = [
  { label: 'IAA', desc: 'Agroalimentaire', href: '/catalogue?secteur=IAA' },
  { label: 'BTP', desc: 'Construction', href: '/catalogue?secteur=BTP' },
  { label: 'Agricole', desc: 'Agriculture', href: '/catalogue?secteur=Agricole' },
  { label: 'Pharma', desc: 'Pharmaceutique', href: '/catalogue?secteur=Pharma' },
  { label: 'Bois', desc: 'Menuiserie', href: '/catalogue?secteur=Bois' },
  { label: 'Textile', desc: 'Habillement', href: '/catalogue?secteur=Textile' },
  { label: 'Mining', desc: 'Carrières & Mines', href: '/catalogue?secteur=Mining' },
  { label: 'Énergie', desc: 'Électrique & Solaire', href: '/catalogue?secteur=Energie' },
]

const temoignages = [
  { nom: 'Ahmed Bensalem', poste: 'Directeur usine IAA', wilaya: 'Blida', note: 5, texte: "Grâce à MachiNet j'ai trouvé ma ligne de conditionnement en 3 jours au lieu de 3 mois." },
  { nom: 'Karim Mansouri', poste: 'Importateur machines', wilaya: 'Alger', note: 5, texte: "En tant que fournisseur, j'ai reçu 12 leads qualifiés le premier mois d'abonnement." },
  { nom: 'Fatima Zerrouki', poste: 'Entrepreneur BTP', wilaya: 'Oran', note: 5, texte: "L'IA Advisor m'a aidée à choisir la bonne pelle hydraulique selon mon budget." },
]

const prixMarche = [
  { machine: 'Pelle hydraulique 20T', fourchette: '8,5M – 12M DZD', tendance: '↗', pct: '+8%' },
  { machine: 'Ligne emballage IAA', fourchette: '3,2M – 6,8M DZD', tendance: '→', pct: 'stable' },
  { machine: 'Tracteur agricole 80CV', fourchette: '2,1M – 3,9M DZD', tendance: '↘', pct: '-2%' },
  { machine: 'Pasteurisateur 500L', fourchette: '800K – 1,5M DZD', tendance: '↗', pct: '+3%' },
]

function normalizeMachine(m) {
  return {
    id: m.id,
    nom: m.name || m.nom,
    fournisseur: m.seller?.name || m.seller?.company || m.fournisseur || 'Vendeur',
    wilaya: m.wilaya,
    prix: String(m.price || m.prix || 0),
    type: m.condition || m.type || 'Vente neuf',
    secteur: m.category || m.secteur || 'Industrie',
    verifie: m.verified ?? m.verifie ?? false,
    photos: m.photos,
  }
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [featuredMachines, setFeaturedMachines] = useState([])

  useEffect(() => {
    fetch('/api/machines?limit=6')
      .then(r => r.json())
      .then(d => { if (d.machines?.length) setFeaturedMachines(d.machines.map(normalizeMachine)) })
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen">

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="grid-bg absolute inset-0 opacity-60"></div>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-900/25 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-violet-900/15 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-purple-800/12 rounded-full blur-[80px]"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-900/20 border border-purple-800/40 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
            <span className="text-purple-300 text-sm font-medium">1ère plateforme B2B machines industrielles en Algérie</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="text-white">Trouvez la machine</span>
            <br />
            <span style={{ background: 'linear-gradient(135deg, #c084fc, #a855f7, #7e22ce)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              qu'il vous faut.
            </span>
          </h1>
          <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            IAA · BTP · Agricole · Pharmaceutique · Textile et plus encore.
            <br />Fournisseurs vérifiés. Prix transparents. Conseil IA expert.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-8">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Ex: pelle hydraulique, pasteurisateur, tracteur..."
                className="input-dark h-14 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (window.location.href = `/catalogue${searchQuery ? `?q=${searchQuery}` : ''}`)}
              />
            </div>
            <Link href={`/catalogue${searchQuery ? `?q=${searchQuery}` : ''}`}
              className="btn-primary h-14 px-8 text-base whitespace-nowrap justify-center">
              Rechercher
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {['Pelle hydraulique', 'Ligne IAA', 'Tracteur', 'Grue', 'Pasteurisateur', 'Compresseur'].map((term) => (
              <Link key={term} href={`/catalogue?q=${term}`}
                className="px-3 py-1.5 bg-white/5 hover:bg-purple-900/20 border border-white/10 hover:border-purple-700/40 rounded-full text-gray-400 hover:text-purple-300 text-sm transition-all">
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 border-y border-purple-900/20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="stat-value mb-2">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTEURS */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">Tous les secteurs. Une seule plateforme.</h2>
          <p className="section-subtitle">Parcourez par secteur d'activité</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {secteurs.map((s, i) => (
            <Link key={i} href={s.href} className="card p-6 text-center group">
              <div className="text-white font-bold text-lg mb-1 group-hover:text-purple-300 transition-colors">{s.label}</div>
              <div className="text-gray-500 text-sm">{s.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* MACHINES EN VEDETTE */}
      <section className="py-20 bg-gradient-to-b from-black via-purple-950/5 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="section-title mb-2">Machines en vedette</h2>
              <p className="section-subtitle">Sélectionnées par notre équipe</p>
            </div>
            <Link href="/catalogue" className="btn-outline text-sm">Voir tout →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredMachines.length > 0 ? featuredMachines.map((machine) => (
              <MachineCard key={machine.id} machine={machine} />
            )) : [...Array(6)].map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="skeleton h-48 rounded-none"></div>
                <div className="p-5 space-y-3">
                  <div className="skeleton h-4 rounded w-3/4"></div>
                  <div className="skeleton h-3 rounded w-1/2"></div>
                  <div className="skeleton h-3 rounded w-1/3"></div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="skeleton h-6 rounded w-1/3"></div>
                    <div className="skeleton h-8 rounded-lg w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-title mb-4">Comment ça marche ?</h2>
          <p className="section-subtitle">Simple, rapide, efficace</p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="card p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-purple-900/30 border border-purple-700/40 flex items-center justify-center text-purple-400 font-bold">A</div>
              <h3 className="text-white font-bold text-lg">Pour les Acheteurs</h3>
            </div>
            {[
              { n: '1', titre: 'Décrivez votre besoin', desc: 'Secteur, type de machine, budget et wilaya. Recherche avancée et filtres intelligents.' },
              { n: '2', titre: 'Recevez des recommandations IA', desc: 'Comparatif prix, fournisseurs vérifiés, spécifications côte à côte.' },
              { n: '3', titre: 'Contactez directement', desc: "Mise en relation directe, devis gratuit, sans intermédiaire inutile." },
            ].map((step) => (
              <div key={step.n} className="flex gap-4 mb-6">
                <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">{step.n}</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">{step.titre}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
            <Link href="/acheteurs" className="btn-primary">En savoir plus →</Link>
          </div>
          <div className="card p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-purple-900/30 border border-purple-700/40 flex items-center justify-center text-purple-400 font-bold">V</div>
              <h3 className="text-white font-bold text-lg">Pour les Vendeurs</h3>
            </div>
            {[
              { n: '1', titre: 'Créez votre profil', desc: 'Profil entreprise professionnel, badge vérifié, visible dans toute l\'Algérie.' },
              { n: '2', titre: 'Publiez votre catalogue', desc: 'Ajoutez vos machines en minutes. Photos, specs, prix, disponibilité.' },
              { n: '3', titre: 'Recevez des leads qualifiés', desc: "Acheteurs avec vraie intention d'achat. Dashboard analytics inclus." },
            ].map((step) => (
              <div key={step.n} className="flex gap-4 mb-6">
                <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">{step.n}</div>
                <div>
                  <h4 className="text-white font-semibold mb-1">{step.titre}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
            <Link href="/vendeurs" className="btn-outline">Devenir vendeur →</Link>
          </div>
        </div>
      </section>

      {/* IA ADVISOR */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative rounded-2xl overflow-hidden border border-purple-800/30 p-10 md:p-16 text-center"
            style={{ background: 'linear-gradient(135deg, #0f0a1a, #1a0a2e, #0f0a1a)' }}>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-purple-700/30 border border-purple-600/40 mx-auto mb-6 flex items-center justify-center animate-float">
                <span className="text-purple-300 font-black text-xl">AI</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Pas sûr de quelle machine choisir ?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                MachiBot analyse votre activité, votre budget et vos besoins pour vous recommander exactement la bonne machine.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/ia-bots" className="btn-primary text-base px-10 py-4">
                  Parler à MachiBot
                </Link>
                <Link href="/consulting" className="btn-outline text-base px-10 py-4">
                  Consulting expert
                </Link>
              </div>
              <p className="text-gray-600 text-sm mt-4">Réponse instantanée · Sans inscription</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRIX DU MARCHÉ */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="section-title mb-4">Les prix réels du marché algérien</h2>
            <p className="section-subtitle mb-8">Fini les prix opaques. Connaissez la valeur du marché avant d'acheter ou de vendre.</p>
            <div className="flex gap-4">
              <Link href="/marche" className="btn-primary">Voir le marché →</Link>
              <Link href="/prix" className="btn-outline">Tous les prix</Link>
            </div>
          </div>
          <div className="space-y-3">
            {prixMarche.map((p, i) => (
              <div key={i} className="card p-4 flex items-center justify-between group hover:border-purple-500/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${p.tendance === '↗' ? 'bg-green-900/30 text-green-400' : p.tendance === '↘' ? 'bg-red-900/30 text-red-400' : 'bg-gray-900/30 text-gray-400'}`}>{p.tendance}</div>
                  <div>
                    <p className="text-white text-sm font-medium">{p.machine}</p>
                    <p className="text-purple-400 text-xs mt-0.5">{p.fourchette}</p>
                  </div>
                </div>
                <span className={`tag text-xs ${p.tendance === '↗' ? 'bg-green-900/20 text-green-400 border-green-800/30' : p.tendance === '↘' ? 'bg-red-900/20 text-red-400 border-red-800/30' : 'bg-gray-900/20 text-gray-400 border-gray-700/30'}`}>{p.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="py-20 bg-gradient-to-b from-black via-purple-950/5 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Ils nous font confiance</h2>
            <p className="section-subtitle">Des industriels algériens satisfaits</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {temoignages.map((t, i) => (
              <div key={i} className="card p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.note)].map((_, j) => <div key={j} className="w-2 h-2 rounded-full bg-purple-500"></div>)}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 italic">"{t.texte}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-900/30 border border-purple-700/40 flex items-center justify-center text-purple-400 font-bold text-sm">
                    {t.nom[0]}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.nom}</p>
                    <p className="text-gray-600 text-xs">{t.poste} · {t.wilaya}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
          Rejoignez MachiNet
        </h2>
        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
          La première plateforme B2B de machines industrielles en Algérie. Acheteurs, vendeurs, consultants.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/catalogue" className="btn-primary text-base px-10 py-4">Parcourir le catalogue</Link>
          <Link href="/register" className="btn-outline text-base px-10 py-4">Créer un compte</Link>
        </div>
      </section>

    </div>
  )
}
