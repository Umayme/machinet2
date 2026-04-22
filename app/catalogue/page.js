'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import MachineCard from '../../components/MachineCard'

const wilayas = ['Toutes', 'Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar','Blida','Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Alger','Djelfa','Jijel','Sétif','Saïda','Skikda','Sidi Bel Abbès','Annaba','Guelma','Constantine','Médéa','Mostaganem','Ouargla','Oran','El Bayadh','Boumerdès','El Tarf','Tindouf','Tissemsilt','El Oued','Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma','Aïn Témouchent','Ghardaïa','Relizane']
const secteurs = ['Tous', 'IAA', 'BTP', 'Agricole', 'Textile', 'Pharma', 'Mining', 'Industrie', 'Énergie']
const types = ['Tous', 'Vente neuf', 'Occasion']

function normalize(m) {
  // Handle both real DB format and legacy demo format
  return {
    id: m.id,
    nom: m.nom || m.name || 'Machine industrielle',
    fournisseur: m.fournisseur || m.seller?.name || m.seller?.company || 'Vendeur',
    wilaya: m.wilaya,
    prix: String(m.prix || m.price || 0),
    type: m.type || m.condition || 'Vente neuf',
    secteur: m.secteur || m.category || 'Industrie',
    verifie: m.verifie ?? m.verified ?? false,
    photos: m.photos,
  }
}

export default function CataloguePage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center text-gray-500">Chargement...</div>}>
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

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (selectedSecteur !== 'Tous') params.set('category', selectedSecteur)
    if (selectedWilaya !== 'Toutes') params.set('wilaya', selectedWilaya)
    if (selectedType !== 'Tous') params.set('condition', selectedType)
    params.set('limit', '50')

    fetch(`/api/machines?${params}`)
      .then(r => r.json())
      .then(d => {
        setMachines((d.machines || []).map(normalize))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [search, selectedSecteur, selectedWilaya, selectedType])

  const filtered = machines
    .filter(m => verifiedOnly ? m.verifie : true)
    .sort((a, b) => {
      if (sortBy === 'prix-asc') return parseInt(a.prix) - parseInt(b.prix)
      if (sortBy === 'prix-desc') return parseInt(b.prix) - parseInt(a.prix)
      return 0
    })

  const reset = () => {
    setSearch(''); setSelectedSecteur('Tous'); setSelectedWilaya('Toutes')
    setSelectedType('Tous'); setVerifiedOnly(false)
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-10">
          <h1 className="section-title mb-3">Catalogue Machines</h1>
          <p className="section-subtitle">Trouvez la machine qu'il vous faut parmi nos offres vérifiées</p>
        </div>

        {/* SEARCH */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Rechercher une machine, un fournisseur..."
            className="input-dark h-14 text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-8">
          {/* FILTRES SIDEBAR */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="card p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold">Filtres</h3>
                <button onClick={reset} className="text-purple-400 text-xs hover:text-purple-300">Réinitialiser</button>
              </div>

              <div className="mb-6">
                <h4 className="text-gray-400 text-sm font-medium mb-3">Secteur</h4>
                <div className="space-y-1">
                  {secteurs.map(s => (
                    <button key={s} onClick={() => setSelectedSecteur(s)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${selectedSecteur === s ? 'bg-purple-700/30 text-purple-300 border border-purple-700/50' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-gray-400 text-sm font-medium mb-3">Type d'offre</h4>
                <div className="space-y-1">
                  {types.map(t => (
                    <button key={t} onClick={() => setSelectedType(t)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${selectedType === t ? 'bg-purple-700/30 text-purple-300 border border-purple-700/50' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-gray-400 text-sm font-medium mb-3">Wilaya</h4>
                <select value={selectedWilaya} onChange={(e) => setSelectedWilaya(e.target.value)} className="input-dark text-sm py-2">
                  {wilayas.map(w => <option key={w} value={w} className="bg-gray-900">{w}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={`w-10 h-6 rounded-full transition-all relative ${verifiedOnly ? 'bg-purple-600' : 'bg-gray-700'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${verifiedOnly ? 'left-5' : 'left-1'}`}></div>
                </button>
                <span className="text-gray-400 text-sm">Vérifiés uniquement</span>
              </div>
            </div>
          </div>

          {/* RÉSULTATS */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500 text-sm">
                {loading ? 'Chargement...' : <><span className="text-white font-semibold">{filtered.length}</span> résultats</>}
              </p>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-dark text-sm py-2 w-48">
                <option value="pertinence" className="bg-gray-900">Pertinence</option>
                <option value="prix-asc" className="bg-gray-900">Prix croissant</option>
                <option value="prix-desc" className="bg-gray-900">Prix décroissant</option>
              </select>
            </div>

            {/* Filtres mobile */}
            <div className="lg:hidden flex gap-2 mb-6 overflow-x-auto pb-2">
              {secteurs.slice(1).map(s => (
                <button key={s} onClick={() => setSelectedSecteur(selectedSecteur === s ? 'Tous' : s)}
                  className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap border transition-all ${selectedSecteur === s ? 'bg-purple-700/30 text-purple-300 border-purple-700/50' : 'text-gray-500 border-gray-700'}`}>
                  {s}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card overflow-hidden">
                    <div className="skeleton h-48 rounded-none"></div>
                    <div className="p-5 space-y-3">
                      <div className="skeleton h-4 rounded w-3/4"></div>
                      <div className="skeleton h-3 rounded w-1/2"></div>
                      <div className="flex justify-between pt-2">
                        <div className="skeleton h-5 rounded w-1/3"></div>
                        <div className="skeleton h-8 rounded-lg w-16"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(machine => <MachineCard key={machine.id} machine={machine} />)}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-white font-semibold text-xl mb-2">Aucun résultat</h3>
                <p className="text-gray-500 mb-6">Essayez de modifier vos filtres</p>
                <button onClick={reset} className="btn-primary">Réinitialiser les filtres</button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-20 card p-10 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Vous êtes fournisseur ?</h2>
          <p className="text-gray-400 mb-6">Publiez vos machines et recevez des leads qualifiés chaque jour</p>
          <Link href="/fournisseurs" className="btn-primary">Publier mes machines →</Link>
        </div>
      </div>
    </div>
  )
}
