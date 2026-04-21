'use client'
import { useState } from 'react'
import Link from 'next/link'

const secteursPrix = [
  {
    secteur: 'BTP & Construction',
    icon: '',
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
    secteur: 'IAA & Agroalimentaire',
    icon: '',
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
    icon: '',
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
    icon: '',
    color: 'text-pink-400',
    machines: [
      { nom: 'Machine à coudre industrielle Juki', min: '280 000', max: '500 000', tendance: 'stable', pct: 'stable', mois: 'Avr 2026' },
      { nom: 'Machine à tricoter circulaire', min: '1 200 000', max: '3 500 000', tendance: 'up', pct: '+5%', mois: 'Mar 2026' },
      { nom: 'Table de coupe automatique', min: '2 500 000', max: '6 000 000', tendance: 'stable', pct: 'stable', mois: 'Avr 2026' },
    ],
  },
]

const tendances = [
  { titre: 'Engins BTP en hausse', desc: 'La reprise des chantiers publics pousse les prix des pelles et grues à la hausse.', color: 'text-green-400', pct: '+6% moy.' },
  { titre: 'Tracteurs stables', desc: 'Le marché agricole est calme malgré la saison. Bonne période pour acheter.', color: 'text-gray-400', pct: 'Stable' },
  { titre: 'IAA en croissance', desc: "L'industrie agroalimentaire continue de se développer, les lignes d'emballage s'apprécient.", color: 'text-green-400', pct: '+5% moy.' },
  { titre: 'Textile sous pression', desc: "Les importations de machines textiles ont légèrement diminué, les prix locaux tiennent.", color: 'text-gray-400', pct: 'Stable' },
]

export default function MarchePage() {
  const [secteurActif, setSecteurActif] = useState('all')

  const filteredSecteurs = secteurActif === 'all'
    ? secteursPrix
    : secteursPrix.filter(s => s.secteur.toLowerCase().includes(secteurActif))

  return (
    <div className="min-h-screen pt-20">

      {/* HERO */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-900/20 border border-purple-800/40 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-green-300 text-sm font-medium">Données mises à jour en continu</span>
          </div>
          <h1 className="section-title text-5xl mb-4">Marché des machines industrielles</h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            Prix indicatifs du marché algérien · Tendances · Analyses sectorielles
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { v: '200+', l: 'Types de machines suivis' },
            { v: '69', l: 'Wilayas couvertes' },
            { v: '500+', l: 'Vendeurs référencés' },
            { v: 'Mensuel', l: 'Fréquence de mise à jour' },
          ].map((s, i) => (
            <div key={i} className="card p-5 text-center">
              <p className="text-2xl font-black text-purple-400">{s.v}</p>
              <p className="text-gray-500 text-xs mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TENDANCES */}
      <section className="py-8 max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-white mb-6">Tendances du mois — Avril 2026</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {tendances.map((t, i) => (
            <div key={i} className="card p-5">
              <p className={`text-sm font-bold mb-1 ${t.color}`}>{t.pct}</p>
              <h3 className="text-white font-semibold text-sm mb-2">{t.titre}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FILTRES */}
      <section className="max-w-7xl mx-auto px-6 mb-8">
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
              className={`px-4 py-2 rounded-lg text-sm transition-all ${secteurActif === f.v ? 'bg-purple-700 text-white' : 'bg-white/5 text-gray-400 hover:bg-purple-900/20 hover:text-purple-300 border border-white/10'}`}>
              {f.l}
            </button>
          ))}
        </div>
      </section>

      {/* TABLES DE PRIX */}
      <section className="max-w-7xl mx-auto px-6 pb-20 space-y-10">
        {filteredSecteurs.map((s, i) => (
          <div key={i}>
            <h2 className={`text-xl font-bold mb-4 ${s.color}`}>{s.secteur}</h2>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-purple-900/30">
                      <th className="text-left px-6 py-4 text-gray-500 text-xs uppercase tracking-wider font-medium">Machine</th>
                      <th className="text-right px-6 py-4 text-gray-500 text-xs uppercase tracking-wider font-medium">Prix min (DZD)</th>
                      <th className="text-right px-6 py-4 text-gray-500 text-xs uppercase tracking-wider font-medium">Prix max (DZD)</th>
                      <th className="text-center px-6 py-4 text-gray-500 text-xs uppercase tracking-wider font-medium">Tendance</th>
                      <th className="text-right px-6 py-4 text-gray-500 text-xs uppercase tracking-wider font-medium">Màj</th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.machines.map((m, j) => (
                      <tr key={j} className="border-b border-purple-900/10 hover:bg-purple-900/5 transition-colors">
                        <td className="px-6 py-4 text-white text-sm font-medium">{m.nom}</td>
                        <td className="px-6 py-4 text-right text-gray-300 text-sm">{m.min}</td>
                        <td className="px-6 py-4 text-right text-purple-400 text-sm font-semibold">{m.max}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-xs ${m.tendance === 'up' ? 'text-green-500' : m.tendance === 'down' ? 'text-red-500' : 'text-gray-500'}`}>{m.pct}</span>
                        </td>
                        <td className="px-6 py-4 text-right text-gray-600 text-xs">{m.mois}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="py-16 max-w-4xl mx-auto px-6 text-center">
        <div className="card p-12">
          <h2 className="text-3xl font-black text-white mb-4">Vous vendez une machine ?</h2>
          <p className="text-gray-400 mb-8">Publiez votre annonce et touchez des acheteurs dans toute l'Algérie.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-primary">Publier une annonce</Link>
            <Link href="/catalogue" className="btn-outline">Voir le catalogue</Link>
          </div>
        </div>
      </section>

    </div>
  )
}
