'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const staticPrixData = [
    {
        secteur: 'Bâtiment & TP',
        machines: [
            { nom: 'Pelle hydraulique 13–20T', min: '8 500 000', max: '15 000 000', tendance: '↗', pct: '+8%', update: 'Avr 2026' },
            { nom: 'Pelle hydraulique 20–35T', min: '18 000 000', max: '35 000 000', tendance: '↗', pct: '+5%', update: 'Avr 2026' },
            { nom: 'Grue mobile 30–50T', min: '15 000 000', max: '28 000 000', tendance: '→', pct: 'stable', update: 'Avr 2026' },
            { nom: 'Niveleuse 140M', min: '18 000 000', max: '25 000 000', tendance: '↘', pct: '-3%', update: 'Avr 2026' },
            { nom: 'Bétonnière 500L', min: '150 000', max: '280 000', tendance: '→', pct: 'stable', update: 'Jan 2026' },
            { nom: 'Compacteur vibrant', min: '2 500 000', max: '5 000 000', tendance: '↗', pct: '+4%', update: 'Avr 2026' },
        ]
    },
    {
        secteur: 'Agroalimentaire',
        machines: [
            { nom: 'Pasteurisateur 500–1000L/h', min: '800 000', max: '1 500 000', tendance: '↗', pct: '+3%', update: 'Avr 2026' },
            { nom: 'Ligne conditionnement yaourt', min: '3 200 000', max: '6 800 000', tendance: '→', pct: 'stable', update: 'Avr 2026' },
            { nom: 'Ligne emballage sachets', min: '2 800 000', max: '5 500 000', tendance: '↗', pct: '+6%', update: 'Avr 2026' },
            { nom: 'Pétrin industriel 100kg', min: '250 000', max: '480 000', tendance: '→', pct: 'stable', update: 'Jan 2026' },
            { nom: 'Four tunnel boulangerie', min: '1 200 000', max: '3 500 000', tendance: '↗', pct: '+2%', update: 'Avr 2026' },
            { nom: 'Compresseur industriel 500L', min: '380 000', max: '650 000', tendance: '↘', pct: '-2%', update: 'Avr 2026' },
        ]
    },
    {
        secteur: 'Agricole',
        machines: [
            { nom: 'Tracteur 75–100CV', min: '2 500 000', max: '4 500 000', tendance: '↗', pct: '+5%', update: 'Avr 2026' },
            { nom: 'Moissonneuse batteuse', min: '9 000 000', max: '18 000 000', tendance: '→', pct: 'stable', update: 'Avr 2026' },
            { nom: 'Charrue 3 socs', min: '250 000', max: '450 000', tendance: '→', pct: 'stable', update: 'Jan 2026' },
            { nom: 'Semoir céréales', min: '350 000', max: '700 000', tendance: '↗', pct: '+3%', update: 'Avr 2026' },
            { nom: 'Système irrigation goutte', min: '1 500 000', max: '4 000 000', tendance: '↗', pct: '+7%', update: 'Avr 2026' },
        ]
    },
    {
        secteur: 'Textile',
        machines: [
            { nom: 'Machine à coudre industrielle', min: '280 000', max: '550 000', tendance: '→', pct: 'stable', update: 'Avr 2026' },
            { nom: 'Surjeteuse industrielle', min: '180 000', max: '380 000', tendance: '→', pct: 'stable', update: 'Jan 2026' },
            { nom: 'Machine broderie automatique', min: '1 200 000', max: '3 500 000', tendance: '↗', pct: '+4%', update: 'Avr 2026' },
        ]
    },
]

const tendanceColor = {
    '↗': 'text-green-400',
    '↘': 'text-red-400',
    '→': 'text-[#8c8b8b]',
}

export default function PrixPage() {
    const [selectedSecteur, setSelectedSecteur] = useState('Tous')
    const [search, setSearch] = useState('')
    const [prixData, setPrixData] = useState(staticPrixData)

    useEffect(() => {
        fetch('/api/prix')
            .then(r => r.json())
            .then(d => { if (d.data && d.data.length > 0) setPrixData(d.data) })
            .catch(() => {})
    }, [])

    const filtered = prixData
        .filter(s => selectedSecteur === 'Tous' || s.secteur === selectedSecteur)
        .map(s => ({
            ...s,
            machines: s.machines.filter(m =>
                m.nom.toLowerCase().includes(search.toLowerCase())
            )
        }))
        .filter(s => s.machines.length > 0)

    return (
        <div className="min-h-screen">
            {/* HERO — dark band */}
            <div className="bg-[#141313] pt-20 pb-16">
              <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-green-400 text-sm font-medium">Mis à jour en continu</span>
                    </div>
                    <h1 className="hero-title text-white mb-4">Prix du Marché<br/><span style={{color:'#e46a33'}}>Algérien</span></h1>
                    <p className="text-[#8c8b8b] text-lg max-w-2xl mx-auto">
                        Fourchettes de prix réelles basées sur les transactions du marché algérien.
                        Données collectées auprès de 500+ fournisseurs vérifiés.
                    </p>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { val: '150+', label: 'Types de machines' },
                        { val: '500+', label: 'Fournisseurs sources' },
                        { val: '58', label: 'Wilayas couvertes' },
                        { val: 'Mensuel', label: 'Fréquence mise à jour' },
                    ].map((s, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                            <p className="text-3xl font-bold text-white font-['Barlow_Condensed']">{s.val}</p>
                            <p className="text-[#8c8b8b] text-xs mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pb-20 pt-10">

                {/* SEARCH + FILTRES */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Rechercher une machine..."
                            className="input-dark h-12"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {['Tous', 'Bâtiment & TP', 'Agroalimentaire', 'Agricole', 'Textile'].map(s => (
                            <button
                                key={s}
                                onClick={() => setSelectedSecteur(s)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${selectedSecteur === s
                                        ? 'bg-[#e46a33]/10 text-[#e46a33] border-[#e46a33]'
                                        : 'text-[#8c8b8b] border-[#e9e9e9] hover:border-[#e46a33] hover:text-[#e46a33]'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* TABLES PAR SECTEUR */}
                <div className="space-y-8">
                    {filtered.map((secteur, i) => (
                        <div key={i} className="card overflow-hidden">
                            {/* Header secteur */}
                            <div className="px-6 py-4 border-b border-[#e9e9e9] flex items-center gap-3">
                                <h2 className="font-bold text-[#141313] text-lg">{secteur.secteur}</h2>
                                <span className="badge-verified ml-auto">{secteur.machines.length} machines</span>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-[#e9e9e9]">
                                            <th className="text-left px-6 py-3 text-[#8c8b8b] text-xs font-medium">Machine</th>
                                            <th className="text-left px-6 py-3 text-[#8c8b8b] text-xs font-medium">Prix min</th>
                                            <th className="text-left px-6 py-3 text-[#8c8b8b] text-xs font-medium">Prix max</th>
                                            <th className="text-left px-6 py-3 text-[#8c8b8b] text-xs font-medium">Tendance</th>
                                            <th className="text-left px-6 py-3 text-[#8c8b8b] text-xs font-medium">Mis à jour</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {secteur.machines.map((m, j) => (
                                            <tr key={j} className="border-b border-[#e9e9e9] hover:bg-[#f9f9f8]/50 transition-colors">
                                                <td className="px-6 py-4 text-[#141313] text-sm font-medium">{m.nom}</td>
                                                <td className="px-6 py-4 text-[#e46a33] text-sm font-semibold">{m.min} DZD</td>
                                                <td className="px-6 py-4 text-[#e46a33] text-sm">{m.max} DZD</td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-sm font-semibold ${tendanceColor[m.tendance]}`}>
                                                        {m.tendance} {m.pct}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-[#434042] text-xs">{m.update}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA PREMIUM */}
                <div className="mt-16 relative rounded-2xl overflow-hidden border border-[#e9e9e9] p-10 text-center"
                    style={{ background: '#141313' }}>
                    <h2 className="text-2xl font-black text-white mb-3">
                        Accès complet aux données de prix
                    </h2>
                    <p className="text-[#8c8b8b] mb-6 max-w-xl mx-auto">
                        Obtenez les prix en temps réel, les alertes de variation et les rapports sectoriels complets avec le plan Premium.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/tarifs" className="btn-primary px-8 py-3">
                            Voir les tarifs →
                        </Link>
                    </div>
                </div>

            </div>
            </div>{/* close max-w wrapper */}
        </div>
    )
}