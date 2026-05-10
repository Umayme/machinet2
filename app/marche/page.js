'use client'
import { useState } from 'react'
import Link from 'next/link'

const secteursPrix = [
  {
    secteur: 'Bâtiment & Travaux Publics',

    color: 'text-orange-400',
    machines: [
      { nom: 'Pelle hydraulique 20-25T', min: '8 500 000', max: '14 000 000', tendance: 'up', pct: '+8%', mois: 'Avr 2026' },
      { nom: 'Grue mobile 30-50T', min: '18 000 000', max: '35 000 000', tendance: 'stable', pct: 'stable', mois: 'Avr 2026' },
      { nom: 'Bulldozer D6', min: '12 000 000', max: '20 000 000', tendance: 'up', pct: '+5%', mois: 'Mar 2026' },
      { nom: 'Compacteur vibrant', min: '3 500 000', max: '7 000 000', tendance: 'stable', pct: 'stable', mois: 'Avr 2026' },
      { nom: 'Centrale à béton 30m³/h', min: '9 000 000', max: '16 000 000', tendance: 'up', pct: '+4%', mois: 'Avr 2026' },
    ],
  },
  {
    secteur: 'Industrie Agroalimentaire',

    color: 'text-green-400',
    machines: [
      { nom: 'Ligne conditionnement yaourt', min: '3 200 000', max: '8 500 000', tendance: 'stable', pct: 'stable', mois: 'Avr 2026' },
      { nom: 'Pasteurisateur 500-1000L/h', min: '800 000', max: '2 200 000', tendance: 'up', pct: '+3%', mois: 'Avr 2026' },
      { nom: 'Chambre froide industrielle', min: '1 500 000', max: '4 000 000', tendance: 'up', pct: '+6%', mois: 'Mar 2026' },
      { nom: 'Mélangeur industriel 500L', min: '600 000', max: '1 800 000', tendance: 'stable', pct: 'stable', mois: 'Avr 2026' },
      { nom: 'Ligne emballage automatique', min: '4 500 000', max: '12 000 000', tendance: 'up', pct: '+7%', mois: 'Avr 2026' },
    ],
  },
  {
    secteur: 'Agriculture',

    color: 'text-lime-400',
    machines: [
      { nom: 'Tracteur 75-100CV', min: '2 100 000', max: '4 500 000', tendance: 'down', pct: '-2%', mois: 'Avr 2026' },
      { nom: 'Moissonneuse-batteuse', min: '15 000 000', max: '28 000 000', tendance: 'stable', pct: 'stable', mois: 'Mar 2026' },
      { nom: 'Système irrigation goutte-à-goutte / ha', min: '450 000', max: '900 000', tendance: 'up', pct: '+10%', mois: 'Avr 2026' },
      { nom: 'Serre métallique / m²', min: '8 000', max: '18 000', tendance: 'stable', pct: 'stable', mois: 'Avr 2026' },
    ],
  },
  {
    secteur: 'Textile & Habillement',

    color: 'text-pink-400',
    machines: [
      { nom: 'Machine à coudre industrielle Juki', min: '280 000', max: '500 000', tendance: 'stable', pct: 'stable', mois: 'Avr 2026' },
      { nom: 'Machine à tricoter circulaire', min: '1 200 000', max: '3 500 000', tendance: 'up', pct: '+5%', mois: 'Mar 2026' },
      { nom: 'Table de coupe automatique', min: '2 500 000', max: '6 000 000', tendance: 'stable', pct: 'stable', mois: 'Avr 2026' },
    ],
  },
]

const tendances = [
  { titre: 'Engins BTP en hausse', desc: 'La reprise des chantiers publics pousse les prix des pelles et grues à la hausse.', color: 'text-green-400', pct: '+6% moy.', bg: '/images/btpmarche.png' },
  { titre: 'Tracteurs stables', desc: 'Le marché agricole est calme malgré la saison. Bonne période pour acheter.', color: 'text-green-300', pct: 'Stable', bg: '/images/tracteurmarche.png' },
  { titre: 'IAA en croissance', desc: "L'industrie agroalimentaire continue de se développer, les lignes d'emballage s'apprécient.", color: 'text-green-400', pct: '+5% moy.', bg: '/images/iaamarche.png' },
  { titre: 'Textile sous pression', desc: "Les importations de machines textiles ont légèrement diminué, les prix locaux tiennent.", color: 'text-green-300', pct: 'Stable', bg: '/images/textilemarche.png' },
]

export default function MarchePage() {
  const [secteurActif, setSecteurActif] = useState('all')

  const filteredSecteurs = secteurActif === 'all'
    ? secteursPrix
    : secteursPrix.filter(s => s.secteur.toLowerCase().includes(secteurActif))

  return (
    <div className="min-h-screen">

      {/* HERO — dark band */}
      <div className="pt-20 pb-16 relative" style={{ backgroundImage: "url('/images/heromarche.png')", backgroundSize:'cover', backgroundPosition:'center', position:'relative' }}>
        <div className="absolute inset-0 bg-black/65" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-green-400 text-sm font-medium">Données mises à jour en continu</span>
            </div>
            <h1 className="hero-title text-white mb-4">Marché des machines<br/><span style={{color:'#e46a33'}}>industrielles</span></h1>
            <p className="text-[#8c8b8b] text-lg max-w-2xl mx-auto">
              Prix indicatifs du marché algérien · Tendances · Analyses sectorielles
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { v: '200+', l: 'Types de machines suivis' },
              { v: '69', l: 'Wilayas couvertes' },
              { v: '500+', l: 'Vendeurs référencés' },
              { v: 'Mensuel', l: 'Fréquence de mise à jour' },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                <p className="text-3xl font-bold text-white font-['Barlow_Condensed']">{s.v}</p>
                <p className="text-[#8c8b8b] text-xs mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10">

      {/* TENDANCES */}
      <section className="py-8">
        <h2 className="text-2xl font-bold text-[#141313] mb-6">Tendances du mois — Avril 2026</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {tendances.map((t, i) => (
            <div key={i} className="rounded-xl overflow-hidden relative" style={{ backgroundImage:`url('${t.bg}')`, backgroundSize:'cover', backgroundPosition:'center' }}>
              <div className="absolute inset-0 bg-black/65" />
              <div className="relative z-10 p-5">
                <p className={`text-sm font-bold mb-1 ${t.color}`}>{t.pct}</p>
                <h3 className="text-white font-semibold text-sm mb-2">{t.titre}</h3>
                <p className="text-white/70 text-xs leading-relaxed">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FILTRES */}
      <section className="mb-8">
        <div className="flex gap-2 flex-wrap">
          {[
            { v: 'all', l: 'Tous les secteurs' },
            { v: 'btp', l: 'BTP' },
            { v: 'iaa', l: 'IAA' },
            { v: 'agri', l: 'Agriculture' },
            { v: 'text', l: 'Textile' },
          ].map(f => (
            <button key={f.v}
              onClick={() => setSecteurActif(f.v)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${secteurActif === f.v ? 'bg-[#e46a33] text-white' : 'bg-white/5 text-[#8c8b8b] hover:bg-[#f9f9f8] hover:text-[#e46a33] border border-[#e9e9e9]'}`}>
              {f.l}
            </button>
          ))}
        </div>
      </section>

      {/* TABLES DE PRIX */}
      <section className="pb-20 space-y-10">
        {filteredSecteurs.map((s, i) => (
          <div key={i}>
            <h2 className={`text-xl font-bold mb-4 ${s.color}`}>{s.secteur}</h2>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e9e9e9]">
                      <th className="text-left px-6 py-4 text-[#8c8b8b] text-xs uppercase tracking-wider font-medium">Machine</th>
                      <th className="text-right px-6 py-4 text-[#8c8b8b] text-xs uppercase tracking-wider font-medium">Prix min (DZD)</th>
                      <th className="text-right px-6 py-4 text-[#8c8b8b] text-xs uppercase tracking-wider font-medium">Prix max (DZD)</th>
                      <th className="text-center px-6 py-4 text-[#8c8b8b] text-xs uppercase tracking-wider font-medium">Tendance</th>
                      <th className="text-right px-6 py-4 text-[#8c8b8b] text-xs uppercase tracking-wider font-medium">Màj</th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.machines.map((m, j) => (
                      <tr key={j} className="border-b border-[#e9e9e9] hover:bg-[#f9f9f8] transition-colors">
                        <td className="px-6 py-4 text-[#141313] text-sm font-medium">{m.nom}</td>
                        <td className="px-6 py-4 text-right text-[#434042] text-sm">{m.min}</td>
                        <td className="px-6 py-4 text-right text-[#e46a33] text-sm font-semibold">{m.max}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`tag text-xs ${m.tendance === 'up' ? 'bg-green-900/20 text-green-400 border-green-800/30' : m.tendance === 'down' ? 'bg-red-900/20 text-red-400 border-red-800/30' : 'bg-gray-900/20 text-[#8c8b8b] border-gray-700/30'}`}>{m.pct}</span>
                        </td>
                        <td className="px-6 py-4 text-right text-[#434042] text-xs">{m.mois}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </section>

      </div>{/* close max-w wrapper */}

      {/* CTA */}
      <section className="py-16 bg-[#141313]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="hero-title text-white mb-4 whitespace-nowrap">Vous vendez une machine ?</h2>
          <p className="text-[#8c8b8b] mb-8 text-lg">Publiez votre annonce et touchez des acheteurs dans toute l'Algérie.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-primary" style={{ backgroundColor:'#e46a33' }}>Publier une annonce</Link>
            <Link href="/catalogue" className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all font-semibold">Voir le catalogue</Link>
          </div>
        </div>
      </section>

    </div>
  )
}
