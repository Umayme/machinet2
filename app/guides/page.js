'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const catIcons = {
  'BTP': '🏗️', 'IAA': '🌿', 'Agricole': '🚜', 'Import': '🚢', 'Finance': '💰', 'Conseil': '💡',
}
const catBg = {
  'BTP': 'bg-orange-50 border-orange-200', 'IAA': 'bg-green-50 border-green-200',
  'Agricole': 'bg-lime-50 border-lime-200', 'Import': 'bg-blue-50 border-blue-200',
  'Finance': 'bg-yellow-50 border-yellow-200', 'Conseil': 'bg-[#fff5f0] border-[#e46a33]/30',
}
const catText = {
  'BTP': 'text-orange-600', 'IAA': 'text-green-600', 'Agricole': 'text-lime-600',
  'Import': 'text-blue-600', 'Finance': 'text-yellow-600', 'Conseil': 'text-[#e46a33]',
}

const staticArticles = [
  { id: '1', titre: 'Comment choisir une pelle hydraulique pour le BTP algérien', categorie: 'BTP', temps: '8 min', createdAt: '2026-04-01', desc: 'Guide complet pour sélectionner la bonne pelle hydraulique selon votre chantier, budget et région.', tags: ['Pelle', 'BTP', 'Achat'] },
  { id: '2', titre: 'Neuf vs Occasion : que choisir pour une IAA ?', categorie: 'IAA', temps: '6 min', createdAt: '2026-04-01', desc: "Analyse comparative des avantages et inconvénients d'acheter neuf ou occasion pour vos équipements agroalimentaires.", tags: ['IAA', 'Budget', 'Conseil'] },
  { id: '3', titre: 'Guide importation machines industrielles en Algérie 2026', categorie: 'Import', temps: '12 min', createdAt: '2026-04-01', desc: "Tout ce qu'il faut savoir sur les procédures douanières, les documents requis et les délais d'importation.", tags: ['Import', 'Douane', 'Légal'] },
  { id: '4', titre: 'Tracteurs agricoles : les meilleurs modèles disponibles en Algérie', categorie: 'Agricole', temps: '5 min', createdAt: '2026-04-01', desc: 'Comparatif des tracteurs les plus vendus en Algérie avec prix, disponibilité et service après-vente.', tags: ['Tracteur', 'Agricole', 'Comparatif'] },
  { id: '5', titre: 'Financement machines : les options disponibles pour les PME algériennes', categorie: 'Finance', temps: '7 min', createdAt: '2026-04-01', desc: "FGAR, leasing, crédit bancaire : toutes les solutions de financement pour l'acquisition de machines industrielles.", tags: ['Finance', 'PME', 'FGAR'] },
  { id: '6', titre: 'Location vs Achat : calculez le meilleur choix pour votre projet', categorie: 'Conseil', temps: '4 min', createdAt: '2026-04-01', desc: 'Méthodologie simple pour calculer le ROI et choisir entre louer ou acheter vos équipements.', tags: ['ROI', 'Location', 'Finance'] },
]

const categories = ['Tous', 'BTP', 'IAA', 'Agricole', 'Import', 'Finance', 'Conseil']

function formatDate(iso) {
  try { return new Date(iso).toLocaleDateString('fr-DZ', { month: 'short', year: 'numeric' }) }
  catch { return iso }
}

function ArticleImagePlaceholder({ categorie }) {
  return (
    <div className={`w-full h-44 rounded-xl mb-4 flex flex-col items-center justify-center border-2 border-dashed ${catBg[categorie] || 'bg-[#f9f9f8] border-[#e9e9e9]'}`}>
      <span className="text-4xl mb-2">{catIcons[categorie] || '📄'}</span>
      <span className="text-xs text-[#8c8b8b]">Photo à ajouter</span>
    </div>
  )
}

export default function GuidesPage() {
  const [selectedCat, setSelectedCat] = useState('Tous')
  const [search, setSearch] = useState('')
  const [articles, setArticles] = useState(staticArticles)
  const [dbCats, setDbCats] = useState([])
  const [showShareForm, setShowShareForm] = useState(false)
  const [shareForm, setShareForm] = useState({ titre: '', categorie: 'BTP', desc: '', nom: '' })
  const [shareSent, setShareSent] = useState(false)

  useEffect(() => {
    fetch('/api/blog')
      .then(r => r.json())
      .then(d => {
        if (d.posts?.length > 0) {
          setArticles([...d.posts, ...staticArticles])
          const extra = [...new Set(d.posts.map(p => p.categorie))].filter(c => !categories.includes(c))
          setDbCats(extra)
        }
      })
      .catch(() => {})
  }, [])

  const allCats = [...categories, ...dbCats]
  const filtered = articles.filter(a => {
    const matchCat = selectedCat === 'Tous' || a.categorie === selectedCat
    const matchSearch = a.titre.toLowerCase().includes(search.toLowerCase()) ||
      (a.desc || '').toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen pt-24 pb-20">

      {/* HERO BAND */}
      <div className="bg-[#141313] py-16 mb-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block bg-[#e46a33]/20 text-[#e46a33] text-xs font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">Ressources & Guides</span>
          <h1 className="hero-title text-white mb-4">Conseils & Guides</h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Tous les conseils d'experts pour bien acheter, financer et utiliser vos machines industrielles en Algérie.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">

        {/* FEATURED ARTICLE */}
        <div className="rounded-2xl overflow-hidden mb-12 border border-[#e9e9e9] shadow-sm" style={{background:'linear-gradient(135deg,#fff5f0 0%,#fff 60%)'}}>
          <div className="flex flex-col md:flex-row">
            {/* Image placeholder */}
            <div className="md:w-72 h-52 md:h-auto bg-gradient-to-br from-[#e46a33]/10 to-[#e46a33]/30 flex items-center justify-center flex-shrink-0">
              <div className="text-center">
                <svg className="w-16 h-16 text-[#e46a33] mx-auto mb-2 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                <p className="text-[#e46a33] text-xs font-medium">Photo à ajouter</p>
              </div>
            </div>
            <div className="p-8 flex flex-col justify-center">
              <span className="badge-verified mb-3 inline-block">Article du mois</span>
              <h2 className="font-black text-[#141313] text-2xl mb-3 leading-snug">
                Guide complet : Acheter une machine industrielle en Algérie en 2026
              </h2>
              <p className="text-[#8c8b8b] mb-6 leading-relaxed">
                De la recherche fournisseur à la livraison, en passant par la négociation et les aspects légaux.
              </p>
              <div className="flex items-center gap-4">
                <Link href="/experts" className="btn-primary">Parler à un expert →</Link>
                <span className="text-[#434042] text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  15 min de lecture
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH + FILTRES */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c8b8b]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Rechercher un guide..." className="input-dark h-12 pl-10" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {allCats.map(c => (
              <button key={c} onClick={() => setSelectedCat(c)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${selectedCat === c ? 'bg-[#e46a33] text-white border-[#e46a33]' : 'text-[#8c8b8b] border-[#e9e9e9] hover:border-[#e46a33] hover:text-[#e46a33] bg-white'}`}>
                {catIcons[c] && <span className="mr-1">{catIcons[c]}</span>}{c}
              </button>
            ))}
          </div>
        </div>

        {/* ARTICLES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filtered.map(article => (
            <div key={article.id} className="card overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
              {article.image
                ? <img src={article.image} alt={article.titre} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
                : <ArticleImagePlaceholder categorie={article.categorie} />
              }
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${catBg[article.categorie] || 'bg-[#f9f9f8] border-[#e9e9e9]'} ${catText[article.categorie] || 'text-[#e46a33]'}`}>
                    {catIcons[article.categorie]} {article.categorie}
                  </span>
                  <span className="text-[#8c8b8b] text-xs flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {article.temps}
                  </span>
                </div>
                <h3 className="font-bold text-[#141313] mb-2 group-hover:text-[#e46a33] transition-colors leading-snug text-sm">{article.titre}</h3>
                <p className="text-[#8c8b8b] text-xs leading-relaxed mb-3 line-clamp-2">{article.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {(article.tags || []).map(tag => (
           