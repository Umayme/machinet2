'use client'
import { useState } from 'react'
import Link from 'next/link'

const articles = [
    {
        id: '1',
        titre: 'Comment choisir une pelle hydraulique pour le BTP algérien',
        categorie: 'BTP',
        icon: '🏗️',
        temps: '8 min',
        date: 'Mars 2025',
        desc: 'Guide complet pour sélectionner la bonne pelle hydraulique selon votre chantier, budget et région.',
        tags: ['Pelle', 'BTP', 'Achat'],
    },
    {
        id: '2',
        titre: 'Neuf vs Occasion : que choisir pour une IAA ?',
        categorie: 'IAA',
        icon: '🏭',
        temps: '6 min',
        date: 'Fév 2025',
        desc: 'Analyse comparative des avantages et inconvénients d\'acheter neuf ou occasion pour vos équipements agroalimentaires.',
        tags: ['IAA', 'Budget', 'Conseil'],
    },
    {
        id: '3',
        titre: 'Guide importation machines industrielles en Algérie 2025',
        categorie: 'Import',
        icon: '🚢',
        temps: '12 min',
        date: 'Jan 2025',
        desc: 'Tout ce qu\'il faut savoir sur les procédures douanières, les documents requis et les délais d\'importation.',
        tags: ['Import', 'Douane', 'Légal'],
    },
    {
        id: '4',
        titre: 'Tracteurs agricoles : les 5 meilleurs modèles disponibles en Algérie',
        categorie: 'Agricole',
        icon: '🌾',
        temps: '5 min',
        date: 'Mars 2025',
        desc: 'Comparatif des tracteurs les plus vendus en Algérie avec prix, disponibilité et service après-vente.',
        tags: ['Tracteur', 'Agricole', 'Comparatif'],
    },
    {
        id: '5',
        titre: 'Financement machines : les options disponibles pour les PME algériennes',
        categorie: 'Finance',
        icon: '💰',
        temps: '7 min',
        date: 'Fév 2025',
        desc: 'FGAR, leasing, crédit bancaire : toutes les solutions de financement pour l\'acquisition de machines industrielles.',
        tags: ['Finance', 'PME', 'FGAR'],
    },
    {
        id: '6',
        titre: 'Location vs Achat : calculez le meilleur choix pour votre projet',
        categorie: 'Conseil',
        icon: '📊',
        temps: '4 min',
        date: 'Jan 2025',
        desc: 'Méthodologie simple pour calculer le ROI et choisir entre louer ou acheter vos équipements.',
        tags: ['ROI', 'Location', 'Finance'],
    },
]

const categories = ['Tous', 'BTP', 'IAA', 'Agricole', 'Import', 'Finance', 'Conseil']

const calculateurs = [
    {
        icon: '📈',
        titre: 'Calculateur ROI Machine',
        desc: 'Estimez le retour sur investissement de votre achat machine en quelques clics',
        btn: 'Calculer',
    },
    {
        icon: '⚖️',
        titre: 'Neuf vs Occasion',
        desc: 'Comparez le coût total de possession selon votre durée d\'utilisation',
        btn: 'Comparer',
    },
    {
        icon: '💳',
        titre: 'Simulateur de financement',
        desc: 'Calculez vos mensualités selon le montant et la durée de crédit',
        btn: 'Simuler',
    },
]

export default function GuidesPage() {
    const [selectedCat, setSelectedCat] = useState('Tous')
    const [search, setSearch] = useState('')

    const filtered = articles.filter(a => {
        const matchCat = selectedCat === 'Tous' || a.categorie === selectedCat
        const matchSearch = a.titre.toLowerCase().includes(search.toLowerCase()) ||
            a.desc.toLowerCase().includes(search.toLowerCase())
        return matchCat && matchSearch
    })

    const catColors = {
        'BTP': 'bg-orange-900/30 text-orange-400',
        'IAA': 'bg-green-900/30 text-green-400',
        'Agricole': 'bg-lime-900/30 text-lime-400',
        'Import': 'bg-blue-900/30 text-blue-400',
        'Finance': 'bg-yellow-900/30 text-yellow-400',
        'Conseil': 'bg-purple-900/30 text-purple-400',
    }

    return (
        <div className="min-h-screen pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-6">

                {/* HEADER */}
                <div className="text-center mb-12">
                    <h1 className="section-title mb-4">Conseils & Guides</h1>
                    <p className="section-subtitle max-w-2xl mx-auto">
                        Tous les conseils d'experts pour bien acheter, financer et utiliser
                        vos machines industrielles en Algérie.
                    </p>
                </div>

                {/* ARTICLE FEATURED */}
                <div className="card p-8 mb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-900/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                        <div className="text-8xl">📚</div>
                        <div className="flex-1">
                            <span className="badge-verified mb-3 inline-block">Article du mois</span>
                            <h2 className="text-white font-black text-2xl mb-3">
                                Guide complet : Acheter une machine industrielle en Algérie en 2025
                            </h2>
                            <p className="text-gray-400 mb-6">
                                De la recherche fournisseur à la livraison, en passant par la négociation et les aspects légaux — tout ce qu'il faut savoir pour réussir votre achat.
                            </p>
                            <div className="flex items-center gap-4">
                                <Link href="#" className="btn-primary">Lire le guide →</Link>
                                <span className="text-gray-600 text-sm">⏱ 15 min de lecture</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SEARCH + FILTRES */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
                        <input
                            type="text"
                            placeholder="Rechercher un guide..."
                            className="input-dark pl-12 h-12"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {categories.map(c => (
                            <button
                                key={c}
                                onClick={() => setSelectedCat(c)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${selectedCat === c
                                        ? 'bg-purple-700/30 text-purple-300 border-purple-700/50'
                                        : 'text-gray-500 border-gray-700 hover:border-purple-700/50 hover:text-white'
                                    }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ARTICLES GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                    {filtered.map((article) => (
                        <div key={article.id} className="card p-6 group cursor-pointer">
                            <div className="flex items-start justify-between mb-4">
                                <span className="text-4xl">{article.icon}</span>
                                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${catColors[article.categorie] || 'bg-purple-900/30 text-purple-400'}`}>
                                    {article.categorie}
                                </span>
                            </div>
                            <h3 className="text-white font-bold mb-3 group-hover:text-purple-300 transition-colors leading-snug">
                                {article.titre}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-4">{article.desc}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {article.tags.map(tag => (
                                    <span key={tag} className="px-2 py-0.5 bg-white/5 rounded-md text-gray-600 text-xs">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-purple-900/20">
                                <div className="flex items-center gap-3 text-gray-600 text-xs">
                                    <span>⏱ {article.temps}</span>
                                    <span>📅 {article.date}</span>
                                </div>
                                <Link href="#" className="text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors">
                                    Lire →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CALCULATEURS */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="section-title mb-4">Calculateurs interactifs</h2>
                        <p className="section-subtitle">Outils gratuits pour prendre de meilleures décisions</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {calculateurs.map((c, i) => (
                            <div key={i} className="card p-6 text-center">
                                <div className="text-5xl mb-4">{c.icon}</div>
                                <h3 className="text-white font-bold mb-2">{c.titre}</h3>
                                <p className="text-gray-500 text-sm mb-6">{c.desc}</p>
                                <button className="btn-outline w-full justify-center py-2 text-sm">
                                    {c.btn} →
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* NEWSLETTER */}
                <div className="card p-10 text-center">
                    <h2 className="text-2xl font-black text-white mb-3">
                        📬 Recevez nos guides par email
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Nouveaux articles, alertes prix et conseils experts chaque semaine.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="votre@email.dz"
                            className="input-dark flex-1"
                        />
                        <button className="btn-primary whitespace-nowrap">
                            S'abonner →
                        </button>
                    </div>
                    <p className="text-gray-600 text-xs mt-3">Gratuit · Désabonnement en 1 clic</p>
                </div>

            </div>
        </div>
    )
}