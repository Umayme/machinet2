'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const wilayas = ['Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar','Blida','Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Alger','Djelfa','Jijel','Sétif','Saïda','Skikda','Sidi Bel Abbès','Annaba','Guelma','Constantine','Médéa','Mostaganem',"M'Sila",'Mascara','Ouargla','Oran','El Bayadh','Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf','Tissemsilt','El Oued','Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma','Aïn Témouchent','Ghardaïa','Relizane','Timimoun','Bordj Badji Mokhtar','Ouled Djellal','Béni Abbès','In Salah','In Guezzam','Touggourt','Djanet',"El M'Ghair",'El Meniaa']
const categories = ['BTP','IAA','Agricole','Textile','Industrie','Pharma','Mining','Énergie','Autre']
const conditions = ['Vente neuf','Occasion']

const specTemplates = {
  BTP: 'Puissance moteur: \nPoids opérationnel: \nProfondeur de fouille max: \nForce de poussée: \nAnnée de fabrication: \nHeures de service: \n',
  IAA: 'Capacité de production: \nPuissance: \nMatériaux de contact: \nDimensions (L×l×H): \nAnnée: \nNormes: \n',
  Agricole: 'Puissance (CV): \nType de transmission: \nEssieux: \nPrise de force (tr/min): \nAnnée: \nHeures moteur: \n',
  default: 'Puissance: \nPoids: \nDimensions: \nAnnée de fabrication: \nÉtat général: \n',
}

export default function NewListingPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', category: '', price: '', condition: '', wilaya: '', description: '', specs: '' })
  const [photos, setPhotos] = useState([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    const toRead = files.slice(0, 5 - photos.length)
    let done = 0
    const results = []
    toRead.forEach((file, idx) => {
      if (file.size > 5 * 1024 * 1024) { done++; if (done === toRead.length) { setPhotos(p => [...p, ...results]); setUploading(false) }; return }
      const reader = new FileReader()
      reader.onload = (ev) => {
        results[idx] = ev.target.result
        done++
        if (done === toRead.length) { setPhotos(p => [...p, ...results.filter(Boolean)]); setUploading(false) }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    const res = await fetch('/api/machines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, photos }),
    })
    const data = await res.json(); setLoading(false)
    if (res.ok) router.push('/dashboard')
    else setError(data.error || "Erreur lors de la publication")
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const applyTemplate = () => {
    const tpl = specTemplates[form.category] || specTemplates.default
    if (!form.specs) set('specs', tpl)
  }

  return (
    <div className="min-h-screen bg-[#f9f9f8] pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <Link href="/dashboard" className="text-[#8c8b8b] hover:text-[#e46a33] transition-colors flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Dashboard
          </Link>
          <span className="text-[#e9e9e9]">/</span>
          <span className="text-[#141313] font-medium">Nouvelle annonce</span>
        </div>

        <div className="mb-8">
          <h1 className="section-title mb-1">Publier une machine</h1>
          <p className="text-[#8c8b8b] text-sm">Complétez tous les champs pour une meilleure visibilité.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Infos principales */}
          <div className="bg-white rounded-2xl border border-[#e9e9e9] p-6 space-y-4">
            <h2 className="font-bold text-[#141313] text-sm uppercase tracking-wide">Informations principales</h2>
            <div>
              <label className="block text-[#434042] text-sm font-medium mb-1.5">Nom de la machine *</label>
              <input required className="input-dark h-12" placeholder="Ex: Pelle hydraulique Caterpillar 320D" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#434042] text-sm font-medium mb-1.5">Catégorie *</label>
                <select required className="input-dark h-12" value={form.category} onChange={e => { set('category', e.target.value); if (!form.specs) set('specs', specTemplates[e.target.value] || specTemplates.default) }}>
                  <option value="">Sélectionner...</option>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[#434042] text-sm font-medium mb-1.5">État *</label>
                <div className="flex gap-2 h-12 items-center">
                  {conditions.map(c => (
                    <button key={c} type="button" onClick={() => set('condition', c)}
                      className={`flex-1 h-10 rounded-lg border text-sm font-medium transition-all ${form.condition === c ? 'bg-[#141313] text-white border-[#141313]' : 'bg-white text-[#434042] border-[#e9e9e9] hover:border-[#141313]'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#434042] text-sm font-medium mb-1.5">Prix (DZD) *</label>
                <div className="relative">
                  <input required type="number" className="input-dark h-12 pr-16" placeholder="4 500 000" value={form.price} onChange={e => set('price', e.target.value)} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c8b8b] text-sm font-medium">DZD</span>
                </div>
                {form.price && <p className="text-[#8c8b8b] text-xs mt-1">{parseInt(form.price).toLocaleString('fr-DZ')} DZD</p>}
              </div>
              <div>
                <label className="block text-[#434042] text-sm font-medium mb-1.5">Wilaya *</label>
                <select required className="input-dark h-12" value={form.wilaya} onChange={e => set('wilaya', e.target.value)}>
                  <option value="">Sélectionner...</option>
                  {wilayas.map(w => <option key={w}>{w}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="bg-white rounded-2xl border border-[#e9e9e9] p-6">
            <h2 className="font-bold text-[#141313] text-sm uppercase tracking-wide mb-4">Photos <span className="text-[#8c8b8b] norm