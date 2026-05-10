'use client'
import { useState, useEffect, Suspense, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import MachineCard from '../../components/MachineCard'
import { normalizeMachine as normalize } from '../../lib/normalize'

const wilayas = ['Toutes','Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar','Blida','Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Alger','Djelfa','Jijel','Sétif','Saïda','Skikda','Sidi Bel Abbès','Annaba','Guelma','Constantine','Médéa','Mostaganem',"M'Sila",'Mascara','Ouargla','Oran','El Bayadh','Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf','Tissemsilt','El Oued','Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma','Aïn Témouchent','Ghardaïa','Relizane','Timimoun','Bordj Badji Mokhtar','Ouled Djellal','Béni Abbès','In Salah','In Guezzam','Touggourt','Djanet',"El M'Ghair",'El Meniaa']
const secteurs = ['Tous', 'Industrie Agroalimentaire', 'Bâtiment & Travaux Publics', 'Agricole', 'Textile', 'Pharma', 'Mining', 'Industrie', 'Énergie']
const types = ['Tous', 'Vente neuf', 'Occasion']

export default function CataloguePage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center text-[#8c8b8b]">Chargement...</div>}>
      <CatalogueInner />
    </Suspense>
  )
}

function CatalogueInner() {
  const searchParams = useSearchParams()
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [selectedSecteur, setSelectedSecteur] = useState(searchParams.get('secteur') || 'Tous')
  const [selectedWilaya, setSelectedWilaya] = useState('Toutes')
  const [selectedType, setSelectedType] = useState('Tous')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sortBy, setSortBy] = useState('pertinence')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [compareList, setCompareList] = useState([])
  const [compareOpen, setCompareOpen] = useState(false)
  const [page, setPage] = useState(1)
  const PER_PAGE = 12
  const filtersRef = useRef(null)

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (selectedSecteur !== 'Tous') params.set('category', selectedSecteur)
    if (selectedWilaya !== 'Toutes') params.set('wilaya', selectedWilaya)
    if (selectedType !== 'Tous') params.set('condition', selectedType)
    params.set('limit', '100')
    fetch(`/api/machines?${params}`)
      .then(r => r.json())
      .then(d => { setMachines((d.machines || []).map(normalize)); setLoading(false); setPage(1) })
      .catch(() => setLoading(false))
  }, [search, selectedSecteur, selectedWilaya, selectedType])

  useEffect(() => {
    const handleClick = (e) => { if (filtersRef.current && !filtersRef.current.contains(e.target)) setFiltersOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = machines
    .filter(m => verifiedOnly ? m.verifie : true)
    .sort((a, b) => {
      if (sortBy === 'prix-asc') return parseInt(a.prix) - parseInt(b.prix)
      if (sortBy === 'prix-desc') return parseInt(b.prix) - parseInt(a.prix)
      return 0
    })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const reset = () => { setSearch(''); setSelectedSecteur('Tous'); setSelectedWilaya('Toutes'); setSelectedType('Tous'); setVerifiedOnly(false) }
  const toggleCompare = (machine) => {
    setCompareList(prev => {
      const exists = prev.find(m => m.id === machine.id)
      if (exists) return prev.filter(m => m.id !== machine.id)
      if (prev.length >= 3) return prev
      return [...prev, machine]
    })
  }

  return (
    <div className="min-h-screen bg-white pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="py-10 border-b border-[#e9e9e9] mb-8">
          <h1 className="section-title mb-2">Catalogue Machines</h1>
          <p className="section-subtitle">Trouvez la machine qu'il vous faut parmi nos offres vérifiées</p>
        </div>

        {/* Search bar - same style as home */}
        <div className="mb-8" ref={filtersRef}>
          <div className="flex items-center gap-2 border border-[#e9e9e9] rounded-xl p-2 bg-white shadow-sm">
            <input
              type="text"
              placeholder="Rechercher une machine, fournisseur, marque..."
              className="flex-1 bg-transparent border-none outline-none text-[#141313] text-sm placeholder-[#8c8b8b] px-3 h-11"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select value={selectedType} onChange={e => setSelectedType(e.target.value)}
              className="h-11 bg-[#f9f9f8] border border-[#e9e9e9] rounded-lg text-sm text-[#434042] px-3 pr-8 outline-none cursor-pointer hidden sm:block">
              {types.map(t => <option key={t}>{t}</option>)}
            </select>
            <button className="btn-primary h-11 px-6 text-sm rounded-lg flex-shrink-0">
              <span className="sm:hidden"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" /></svg></span>
              <span className="hidden sm:inline">Rechercher</span>
            </button>
            <button onClick={() => setFiltersOpen(!filtersOpen)}
              className={`h-11 px-4 text-sm font-medium border rounded-lg flex items-center gap-1.5 transition-all flex-shrink-0 ${filtersOpen ? 'bg-[#141313] text-white border-[#141313]' : 'border-[#e9e9e9] text-[#434042] hover:border-[#141313]'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtrer
              <svg className={`w-3 h-3 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {filtersOpen && (
            <div className="bg-white border border-[#e9e9e9] rounded-xl mt-2 p-5 shadow-xl">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#434042] uppercase tracking-wide mb-2 block">Secteur</label>
                  <select value={selectedSecteur} onChange={e => setSelectedSecteur(e.target.value)} className="input-dark text-sm h-10">
                    {secteurs.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#434042] uppercase tracking-wide mb-2 block">Type</label>
                  <select value={selectedType} onChange={e => setSelectedType(e.target.value)} className="input-dark text-sm h-10">
                    {types.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#434042] uppercase tracking-wide mb-2 block">Wilaya</label>
                  <select value={selectedWilaya} onChange={e => setSelectedWilaya(e.target.value)} className="input-dark text-sm h-10">
                    {wilayas.map(w => <option key={w}>{w}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#434042] uppercase tracking-wide mb-2 block">Trier par</label>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input-dark text-sm h-10">
                    <option value="pertinence">Pertinence</option>
                    <option value="prix-asc">Prix ↑</option>
                    <option value="prix-desc">Prix ↓</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <button onClick={() => setVerifiedOnly(!verifiedOnly)}
                    className={`w-9 h-5 rounded-full transition-all relative flex-shrink-0 ${verifiedOnly ? 'bg-[#e46a33]' : 'bg-[#e9e9e9]'}`}>
                    <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all shadow ${verifiedOnly ? 'left-4.5' : 'left-0.5'}`}></div>
                  </button>
                  <span className="text-sm text-[#434042]">Vérifiés uniquement</span>
                </label>
                <button onClick={reset} className="text-xs text-[#8c8b8b] hover:text-[#141313] transition-colors">Réinitialiser</button>
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[#8c8b8b] text-sm">
            {loading ? 'Chargement...' : <><span className="font-semibold text-[#141313]">{filtered.length}</span> machines trouvées</>}
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="skeleton h-52 rounded-none"></div>
                <div className="p-4 space-y-3">
                  <div className="skeleton h-4 w-3/4"></div>
                  <div className="skeleton h-3 w-1/2"></div>
                  <div className="flex justify-between pt-2">
                    <div className="skeleton h-5 w-1/3"></div>
                    <div className="skeleton h-8 w-16 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : paginated.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginated.map(machine => (
              <MachineCard key={machine.id} machine={machine} onCompare={toggleCompare} compareList={compareList} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-[#e9e9e9] rounded-xl">
            <p className="text-[#8c8b8b] text-lg mb-2">Aucune machine trouvée</p>
            <p className="text-[#8c8b8b] text-sm mb-6">Essayez de modifier vos critères de recherche</p>
            <button onClick={reset} className="btn-primary">Réinitialiser</button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="flex items-center gap-1.5 px-4 py-2 border border-[#e9e9e9] rounded-lg text-sm text-[#434042] hover:border-[#141313] disabled:opacity-30 transition-all">
              ‹ Précédent
            </button>
            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
              const n = i + 1
              return (
                <button key={n} onClick={() => setPage(n)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all border ${page === n ? 'bg-[#141313] text-white border-[#141313]' : 'border-[#e9e9e9] text-[#434042] hover:border-[#141313]'}`}>
                  {n}
                </button>
              )
            })}
            {totalPages > 5 && <span className="text-[#8c8b8b] text-sm">···</span>}
            {totalPages > 5 && (
              <button onClick={() => setPage(totalPages)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all border ${page === totalPages ? 'bg-[#141313] text-white border-[#141313]' : 'border-[#e9e9e9] text-[#434042] hover:border-[#141313]'}`}>
                {totalPages}
              </button>
            )}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="flex items-center gap-1.5 px-4 py-2 border border-[#e9e9e9] rounded-lg text-sm text-[#434042] hover:border-[#141313] disabled:opacity-30 transition-all">
              Suivant ›
            </button>
          </div>
        )}

        {/* Fournisseur CTA */}
        <div className="mt-16 rounded-xl p-10 text-center relative overflow-hidden" style={{ backgroundImage:"url('/images/heromarche.png')", backgroundSize:'cover', backgroundPosition:'center' }}>
          <div className="absolute inset-0 bg-black/65" />
          <div className="relative z-10">
            <h2 className="section-title mb-3 text-white">Vous êtes fournisseur ?</h2>
            <p className="text-white/70 mb-6">Publiez vos machines et recevez des leads qualifiés chaque jour</p>
            <Link href="/vendeurs" className="btn-primary">Publier mes machines →</Link>
          </div>
        </div>
      </div>

      {/* Compare bar */}
      {compareList.length >= 2 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-[#141313] text-white rounded-xl px-5 py-3 flex items-center gap-4 shadow-2xl">
            <span className="text-sm font-medium">{compareList.length} sélectionnées</span>
            <button onClick={() => setCompareOpen(true)} className="bg-[#e46a33] text-white px-4 py-1.5 rounded-lg text-sm font-semibold">Comparer</button>
            <button onClick={() => setCompareList([])} className="text-white/50 hover:text-white">×</button>
          </div>
        </div>
      )}

      {/* Compare modal */}
      {compareOpen && compareList.length >= 2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#e9e9e9]">
              <h3 className="font-bold text-[#141313] text-lg" style={{fontFamily:'Barlow Condensed,sans-serif'}}>Comparer les machines</h3>
              <button onClick={() => setCompareOpen(false)} className="text-[#8c8b8b] hover:text-[#141313] text-2xl leading-none">×</button>
            </div>
            <div className="overflow-x-auto p-5">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left text-[#8c8b8b] text-xs uppercase tracking-wide pb-4 pr-4 w-36">Caractéristique</th>
                    {compareList.map(m => (
                      <th key={m.id} className="text-left pb-4 px-3">
                        <p className="font-semibold text-[#141313] text-sm">{m.nom}</p>
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
                    ['Localisation', m => m.wilaya],
                    ['Prix', m => parseInt(m.prix).toLocaleString('fr-DZ') + ' DZD'],
                    ['État', m => m.type],
                    ['Vérifié', m => m.verifie ? '✓ Oui' : '—'],
                    ['Disponibilité', () => '—'],
                    ['Garantie', () => '—'],
                    ['Livraison', () => '—'],
                    ['Service après-vente', () => '—'],
                  ].map(([label, fn]) => (
                    <tr key={label} className="border-t border-[#f9f9f8]">
                      <td className="py-3 pr-4 text-[#8c8b8b] text-xs font-medium">{label}</td>
                      {compareList.map(m => <td key={m.id} className="py-3 px-3 text-[#141313] text-sm">{fn(m)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
