'use client'
import { useState } from 'react'
import Link from 'next/link'

const prixData = [
    {
        secteur: 'BTP',
        icon: '🏗️',
        machines: [
            { nom: 'Pelle hydraulique 13–20T', min: '8 500 000', max: '15 000 000', tendance: '↗️', pct: '+8%', update: 'Mars 2025' },
            { nom: 'Pelle hydraulique 20–35T', min: '18 000 000', max: '35 000 000', tendance: '↗️', pct: '+5%', update: 'Mars 2025' },
            { nom: 'Grue mobile 30–50T', min: '15 000 000', max: '28 000 000', tendance: '→', pct: 'stable', update: 'Fév 2025' },
            { nom: 'Niveleuse 140M', min: '18 000 000', max: '25 000 000', tendance: '↘️', pct: '-3%', update: 'Mars 2025' },
            { nom: 'Bétonnière 500L', min: '150 000', max: '280 000', tendance: '→', pct: 'stable', update: 'Jan 2025' },
            { nom: 'Compacteur vibrant', min: '2 500 000', max: '5 000 000', tendance: '↗️', pct: '+4%', update: 'Mars 2025' },
        ]
    },
    {
        secteur: 'IAA',
        icon: '🏭',
        machines: [
            { nom: 'Pasteurisateur 500–1000L/h', min: '800 000', max: '1 500 000', tendance: '↗️', pct: '+3%', update: 'Mars 2025' },
            { nom: 'Ligne conditionnement yaourt', min: '3 200 000', max: '6 800 000', tendance: '→', pct: 'stable', update: 'Fév 2025' },
            { nom: 'Ligne emballage sachets', min: '2 800 000', max: '5 500 000', tendance: '↗️', pct: '+6%', update: 'Mars 2025' },
            { nom: 'Pétrin industriel 100kg', min: '250 000', max: '480 000', tendance: '→', pct: 'stable', update: 'Jan 2025' },
            { nom: 'Four tunnel boulangerie', min: '1 200 000', max: '3 500 000', tendance: '↗️', pct: '+2%', update: 'Mars 2025' },
            { nom: 'Compresseur industriel 500L', min: '380 000', max: '650 000', tendance: '↘️', pct: '-2%', update: 'Fév 2025' },
        ]
    },
    {
        secteur: 'Agricole',
        icon: '🌾',
        machines: [
            { nom: 'Tracteur 75–100CV', min: '2 500 000', max: '4 500 000', tendance: '↗️', pct: '+5%', update: 'Mars 2025' },
            { nom: 'Moissonneuse batteuse', min: '9 000 000', max: '18 000 000', tendance: '→', pct: 'stable', update: 'Fév 2025' },
            { nom: 'Charrue 3 socs', min: '250 000', max: '450 000', tendance: '→', pct: 'stable', update: 'Jan 2025' },
            { nom: 'Semoir céréales', min: '350 000', max: '700 000', tendance: '↗️', pct: '+3%', update: 'Mars 2025' },
            { nom: 'Système irrigation goutte', min: '1 500 000', max: '4 000 000', tendance: '↗️', pct: '+7%', update: 'Mars 2025' },
        ]
    },
    {
        secteur: 'Textile',
        icon: '👗',
        machines: [
            { nom: 'Machine à coudre industrielle', min: '280 000', max: '550 000', tendance: '→', pct: 'stable', update: 'Fév 2025' },
            { nom: 'Surjeteuse industrielle', min: '180 000', max: '380 000', tendance: '→', pct: 'stable', update: 'Jan 2025' },
            { nom: 'Machine broderie automatique', min: '1 200 000', max: '3 500 000', tendance: '↗️', pct: '+4%', update: 'Mars 2025' },
        ]
    },
]

const tendanceColor = {
    '↗️': 'text-green-400',
    '↘️': 'text-red-400',
    '→': 'text-gray-400',
}

export default function PrixPage() {
    const [selectedSecteur, setSelectedSecteur] = useState('Tous')
    const [search, setSearch] = useState('')

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
        <div className="min-h-screen pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-6">

                {/* HEADER */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-purple-900/20 border border-purple-800/40 rounded-full px-4 py-2 mb-6">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-green-300 text-sm font-medium">Mis à jour en continu</span>
                    </div>
                    <h1 className="section-title mb-4">Prix du Marché Algérien</h1>
                    <p className="section-subtitle max-w-2xl mx-auto">
                        Fourchettes de prix réelles basées sur les transactions du marché algérien.
                        <br />Données collectées auprès de 500+ fournisseurs vérifiés.
                    </p>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { val: '150+', label: 'Types de machines' },
                        { val: '500+', label: 'Fournisseurs sources' },
                        { val: '48', label: 'Wilayas couvertes' },
                        { val: 'Mensuel', label: 'Fréquence mise à jour' },
                    ].map((s, i) => (
                        <div key={i} className="card p-4 text-center">
                            <p className="text-2xl font-black text-purple-400">{s.val}</p>
                            <p className="text-gray-500 text-xs mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* SEARCH + FILTRES */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
                        <input
                            type="text"
                            placeholder="Rechercher une machine..."
                            className="input-dark pl-12 h-12"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {['Tous', 'BTP', 'IAA', 'Agricole', 'Textile'].map(s => (
                            <button
                                key={s}
                                onClick={() => setSelectedSecteur(s)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${selectedSecteur === s
                                        ? 'bg-purple-700/30 text-purple-300 border-purple-700/50'
                                        : 'text-gray-500 border-gray-700 hover:border-purple-700/50 hover:text-white'
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
                            <div className="px-6 py-4 border-b border-purple-900/20 flex items-center gap-3">
                                <span className="text-2xl">{secteur.icon}</span>
                                <h2 className="text-white font-bold text-lg">{secteur.secteur}</h2>
                                <span className="badge-verified ml-auto">{secteur.machines.length} machines</span>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-purple-900/10">
                                            <th className="text-left px-6 py-3 text-gray-500 text-xs font-medium">Machine</th>
                                            <th className="text-left px-6 py-3 text-gray-500 text-xs font-medium">Prix min</th>
                                            <th className="text-left px-6 py-3 text-gray-500 text-xs font-medium">Prix max</th>
                                            <th className="text-left px-6 py-3 text-gray-500 text-xs font-medium">Tendance</th>
                                            <th className="text-left px-6 py-3 text-gray-500 text-xs font-medium">Mis à jour</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {secteur.machines.map((m, j) => (
                                            <tr key={j} className="border-b border-purple-900/10 hover:bg-purple-900/5 transition-colors">
                                                <td className="px-6 py-4 text-white text-sm font-medium">{m.nom}</td>
                                                <td className="px-6 py-4 text-purple-400 text-sm font-semibold">{m.min} DZD</td>
                                                <td className="px-6 py-4 text-purple-300 text-sm">{m.max} DZD</td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-sm font-semibold ${tendanceColor[m.tendance]}`}>
                                                        {m.tendance} {m.pct}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 text-xs">{m.update}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA PREMIUM */}
                <div className="mt-16 relative rounded-2xl overflow-hidden border border-purple-800/30 p-10 text-center"
                    style={{ background: 'linear-gradient(135deg, #0f0a1a, #1a0a2e, #0f0a1a)' }}>
                    <h2 className="text-2xl font-black text-white mb-3">
                        Accès complet aux données de prix
                    </h2>
                    <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                        Obtenez les prix en temps réel, les alertes de variation et les rapports sectoriels complets avec le plan Premium.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/tarifs" className="btn-primary px-8 py-3">
                            Voir les tarifs →
                        </Link>
                        <Link href="/register" className="btn-outline px-8 py-3">
                            Essai gratuit
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    )
}