'use client'
import { useState } from 'react'
import Link from 'next/link'

const wilayas = [
  { n: '01', nom: 'Adrar', region: 'Sud', vendeurs: 3 },
  { n: '02', nom: 'Chlef', region: 'Centre-Ouest', vendeurs: 18 },
  { n: '03', nom: 'Laghouat', region: 'Hauts Plateaux', vendeurs: 8 },
  { n: '04', nom: "Oum El Bouaghi", region: 'Est', vendeurs: 14 },
  { n: '05', nom: 'Batna', region: 'Est', vendeurs: 22 },
  { n: '06', nom: 'Béjaïa', region: 'Nord-Est', vendeurs: 19 },
  { n: '07', nom: 'Biskra', region: 'Hauts Plateaux Est', vendeurs: 16 },
  { n: '08', nom: 'Béchar', region: 'Sud-Ouest', vendeurs: 5 },
  { n: '09', nom: 'Blida', region: 'Centre', vendeurs: 31 },
  { n: '10', nom: 'Bouira', region: 'Centre', vendeurs: 11 },
  { n: '11', nom: 'Tamanrasset', region: 'Grand Sud', vendeurs: 2 },
  { n: '12', nom: 'Tébessa', region: 'Est', vendeurs: 10 },
  { n: '13', nom: 'Tlemcen', region: 'Ouest', vendeurs: 24 },
  { n: '14', nom: 'Tiaret', region: 'Hauts Plateaux Ouest', vendeurs: 15 },
  { n: '15', nom: 'Tizi Ouzou', region: 'Nord-Centre', vendeurs: 17 },
  { n: '16', nom: 'Alger', region: 'Centre', vendeurs: 87 },
  { n: '17', nom: 'Djelfa', region: 'Hauts Plateaux', vendeurs: 9 },
  { n: '18', nom: 'Jijel', region: 'Nord-Est', vendeurs: 12 },
  { n: '19', nom: 'Sétif', region: 'Nord-Est', vendeurs: 29 },
  { n: '20', nom: 'Saïda', region: 'Hauts Plateaux Ouest', vendeurs: 7 },
  { n: '21', nom: 'Skikda', region: 'Nord-Est', vendeurs: 20 },
  { n: '22', nom: 'Sidi Bel Abbès', region: 'Ouest', vendeurs: 16 },
  { n: '23', nom: 'Annaba', region: 'Nord-Est', vendeurs: 26 },
  { n: '24', nom: 'Guelma', region: 'Nord-Est', vendeurs: 11 },
  { n: '25', nom: 'Constantine', region: 'Nord-Est', vendeurs: 38 },
  { n: '26', nom: 'Médéa', region: 'Centre', vendeurs: 13 },
  { n: '27', nom: 'Mostaganem', region: 'Ouest', vendeurs: 14 },
  { n: '28', nom: "M'Sila", region: 'Centre-Est', vendeurs: 11 },
  { n: '29', nom: 'Mascara', region: 'Ouest', vendeurs: 13 },
  { n: '30', nom: 'Ouargla', region: 'Sud-Est', vendeurs: 9 },
  { n: '31', nom: 'Oran', region: 'Ouest', vendeurs: 56 },
  { n: '32', nom: 'El Bayadh', region: 'Hauts Plateaux', vendeurs: 4 },
  { n: '33', nom: 'Illizi', region: 'Grand Sud', vendeurs: 1 },
  { n: '34', nom: 'Bordj Bou Arréridj', region: 'Centre-Est', vendeurs: 16 },
  { n: '35', nom: 'Boumerdès', region: 'Centre', vendeurs: 18 },
  { n: '36', nom: 'El Tarf', region: 'Nord-Est', vendeurs: 8 },
  { n: '37', nom: 'Tindouf', region: 'Grand Sud', vendeurs: 1 },
  { n: '38', nom: 'Tissemsilt', region: 'Hauts Plateaux', vendeurs: 5 },
  { n: '39', nom: 'El Oued', region: 'Sud-Est', vendeurs: 8 },
  { n: '40', nom: 'Khenchela', region: 'Est', vendeurs: 7 },
  { n: '41', nom: 'Souk Ahras', region: 'Nord-Est', vendeurs: 9 },
  { n: '42', nom: 'Tipaza', region: 'Centre-Ouest', vendeurs: 21 },
  { n: '43', nom: 'Mila', region: 'Nord-Est', vendeurs: 10 },
  { n: '44', nom: 'Aïn Defla', region: 'Centre-Ouest', vendeurs: 12 },
  { n: '45', nom: 'Naâma', region: 'Hauts Plateaux', vendeurs: 3 },
  { n: '46', nom: 'Aïn Témouchent', region: 'Ouest', vendeurs: 10 },
  { n: '47', nom: 'Ghardaïa', region: 'Sud', vendeurs: 7 },
  { n: '48', nom: 'Relizane', region: 'Ouest', vendeurs: 13 },
  { n: '49', nom: 'Timimoun', region: 'Grand Sud', vendeurs: 2 },
  { n: '50', nom: 'Bordj Badji Mokhtar', region: 'Grand Sud', vendeurs: 1 },
  { n: '51', nom: 'Ouled Djellal', region: 'Sud-Est', vendeurs: 3 },
  { n: '52', nom: 'Béni Abbès', region: 'Sud-Ouest', vendeurs: 2 },
  { n: '53', nom: 'In Salah', region: 'Grand Sud', vendeurs: 1 },
  { n: '54', nom: 'In Guezzam', region: 'Grand Sud', vendeurs: 1 },
  { n: '55', nom: 'Touggourt', region: 'Sud-Est', vendeurs: 5 },
  { n: '56', nom: 'Djanet', region: 'Grand Sud', vendeurs: 1 },
  { n: '57', nom: "El M'Ghair", region: 'Sud-Est', vendeurs: 3 },
  { n: '58', nom: 'El Meniaa', region: 'Grand Sud', vendeurs: 2 },
]

const regions = ['Toutes', 'Centre', 'Nord-Est', 'Ouest', 'Est', 'Hauts Plateaux', 'Hauts Plateaux Ouest', 'Hauts Plateaux Est', 'Centre-Ouest', 'Centre-Est', 'Sud', 'Sud-Est', 'Sud-Ouest', 'Grand Sud']

function getColor(vendeurs) {
  if (vendeurs >= 50) return 'border-purple-500 bg-purple-900/30'
  if (vendeurs >= 20) return 'border-purple-700/60 bg-purple-900/20'
  if (vendeurs >= 10) return 'border-purple-900/60 bg-purple-900/10'
  return 'border-white/10 bg-white/3'
}

function getDot(vendeurs) {
  if (vendeurs >= 50) return 'bg-purple-400'
  if (vendeurs >= 20) return 'bg-purple-600'
  if (vendeurs >= 10) return 'bg-purple-800'
  return 'bg-gray-700'
}

export default function CouverturePage() {
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('Toutes')

  const filtered = wilayas.filter(w => {
    const matchSearch = w.nom.toLowerCase().includes(search.toLowerCase()) || w.n.includes(search)
    const matchRegion = region === 'Toutes' || w.region === region
    return matchSearch && matchRegion
  })

  const totalVendeurs = wilayas.reduce((sum, w) => sum + w.vendeurs, 0)

  return (
    <div className="min-h-screen pt-20">

      {/* HERO */}
      <section className="py-16 max-w-7xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-purple-900/20 border border-purple-800/40 rounded-full px-4 py-2 mb-6">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-green-300 text-sm font-medium">Couverture nationale complète</span>
        </div>
        <h1 className="section-title text-5xl mb-4">MachiNet couvre les 58 wilayas</h1>
        <p className="section-subtitle max-w-xl mx-auto mb-10">
          De Tamanrasset à Annaba, des vendeurs et acheteurs partout en Algérie.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16">
          {[
            { v: '58', l: 'Wilayas couvertes' },
            { v: totalVendeurs + '+', l: 'Vendeurs référencés' },
            { v: '100%', l: 'Territoire national' },
            { v: '3 200+', l: 'Machines disponibles' },
          ].map((s, i) => (
            <div key={i} className="card p-5 text-center">
              <p className="text-2xl font-black text-purple-400">{s.v}</p>
              <p className="text-gray-500 text-xs mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LÉGENDE */}
      <section className="max-w-7xl mx-auto px-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <span className="text-gray-500 text-sm">Densité de vendeurs :</span>
          {[
            { color: 'bg-purple-400', label: '50+ vendeurs' },
            { color: 'bg-purple-600', label: '20-49 vendeurs' },
            { color: 'bg-purple-800', label: '10-19 vendeurs' },
            { color: 'bg-gray-700', label: '1-9 vendeurs' },
          ].map((l, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${l.color}`}></span>
              <span className="text-gray-400 text-xs">{l.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FILTRES */}
      <section className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Rechercher une wilaya..."
              className="input-dark h-10 text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="input-dark h-10 text-sm w-full sm:w-56" value={region} onChange={e => setRegion(e.target.value)}>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <span className="text-gray-500 text-sm self-center">{filtered.length} wilaya{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </section>

      {/* GRILLE DES WILAYAS */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filtered.map((w, i) => (
            <Link key={i} href={`/catalogue?wilaya=${encodeURIComponent(w.nom)}`}
              className={`border rounded-xl p-4 hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-900/20 transition-all group ${getColor(w.vendeurs)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-xs font-mono">{w.n}</span>
                <span className={`w-2.5 h-2.5 rounded-full ${getDot(w.vendeurs)}`}></span>
              </div>
              <p className="text-white text-sm font-semibold leading-tight group-hover:text-purple-300 transition-colors">{w.nom}</p>
              <p className="text-gray-600 text-xs mt-1">{w.region}</p>
              <p className="text-purple-500 text-xs mt-2 font-medium">{w.vendeurs} vendeur{w.vendeurs !== 1 ? 's' : ''}</p>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">Aucune wilaya trouvée pour "{search}"</p>
          </div>
        )}
      </section>

      {/* TOP WILAYAS */}
      <section className="py-16 bg-gradient-to-b from-black via-purple-950/5 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="section-title text-center mb-12">Top wilayas par nombre de vendeurs</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...wilayas].sort((a, b) => b.vendeurs - a.vendeurs).slice(0, 5).map((w, i) => (
              <Link key={i} href={`/catalogue?wilaya=${encodeURIComponent(w.nom)}`} className="card p-5 text-center hover:border-purple-500/60 transition-all">
                <div className="text-3xl font-black text-purple-400 mb-1">#{i + 1}</div>
                <p className="text-white font-bold">{w.nom}</p>
                <p className="text-gray-500 text-xs mt-1">{w.region}</p>
                <p className="text-purple-400 text-lg font-black mt-2">{w.vendeurs}</p>
                <p className="text-gray-600 text-xs">vendeurs</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-black text-white mb-4">Vous êtes vendeur dans une wilaya peu couverte ?</h2>
        <p className="text-gray-400 mb-8">C'est l'occasion idéale. Moins de concurrence, plus de visibilité pour vos annonces.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register?role=seller" className="btn-primary">Publier mes machines →</Link>
          <Link href="/catalogue" className="btn-outline">Voir le catalogue</Link>
        </div>
      </section>

    </div>
  )
}
