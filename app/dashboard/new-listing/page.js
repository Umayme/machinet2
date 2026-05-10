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
  default: 'Puissance: \nPoids: \nDimensions: \nAnnée de fabrication: \nEtat général: \n',
}

export default function NewListingPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', category: '', price: '', condition: '', wilaya: '', description: '', specs: '' })
  const [photos, setPhotos] = useState([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    const toUpload = files.slice(0, 5 - photos.length)
    const urls = []
    for (const file of toUpload) {
      if (file.size > 5 * 1024 * 1024) continue
      try {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('upload_preset', 'ozt0lxsu')
        const res = await fetch('https://api.cloudinary.com/v1_1/dwkok9ccl/image/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (data.secure_url) urls.push(data.secure_url)
      } catch (err) { console.error('Upload error:', err) }
    }
    setPhotos(p => [...p, ...urls])
    setUploading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const res = await fetch('/api/machines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, photos }),
      })
      const data = await res.json()
      if (res.ok) router.push('/dashboard')
      else setError(data.error || "Erreur lors de la publication")
    } catch (err) {
      setError("Erreur réseau — verifiez votre connexion et reessayez.")
    } finally {
      setLoading(false)
    }
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const applyTemplate = () => {
    const tpl = specTemplates[form.category] || specTemplates.default
    if (!form.specs) set('specs', tpl)
  }

  return (
    <div className="min-h-screen bg-[#f9f9f8] pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
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
          <p className="text-[#8c8b8b] text-sm">Completez tous les champs pour une meilleure visibilite.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#e9e9e9] p-6 space-y-4">
            <h2 className="font-bold text-[#141313] text-sm uppercase tracking-wide">Informations principales</h2>
            <div>
              <label className="block text-[#434042] text-sm font-medium mb-1.5">Nom de la machine *</label>
              <input required className="input-dark h-12" placeholder="Ex: Pelle hydraulique Caterpillar 320D" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#434042] text-sm font-medium mb-1.5">Categorie *</label>
                <select required className="input-dark h-12" value={form.category} onChange={e => { set('category', e.target.value); if (!form.specs) set('specs', specTemplates[e.target.value] || specTemplates.default) }}>
                  <option value="">Selectionner...</option>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[#434042] text-sm font-medium mb-1.5">Etat *</label>
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
                  <option value="">Selectionner...</option>
                  {wilayas.map(w => <option key={w}>{w}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#e9e9e9] p-6">
            <h2 className="font-bold text-[#141313] text-sm uppercase tracking-wide mb-4">Photos (max 5)</h2>
            <div className="grid grid-cols-5 gap-2 mb-3">
              {photos.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-[#e9e9e9]">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setPhotos(p => p.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full text-white text-xs flex items-center justify-center hover:bg-red-600">x</button>
                </div>
              ))}
              {photos.length < 5 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-[#e9e9e9] flex flex-col items-center justify-center cursor-pointer hover:border-[#e46a33] transition-all">
                  <svg className="w-6 h-6 text-[#8c8b8b] mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                  <span className="text-[#8c8b8b] text-xs">{uploading ? '...' : 'Ajouter'}</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
                </label>
              )}
            </div>
            <p className="text-[#8c8b8b] text-xs">JPG, PNG ou WebP - max 5 Mo par image</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#e9e9e9] p-6 space-y-4">
            <h2 className="font-bold text-[#141313] text-sm uppercase tracking-wide">Description</h2>
            <div>
              <label className="block text-[#434042] text-sm font-medium mb-1.5">Description</label>
              <textarea rows={4} className="input-dark resize-none" placeholder="Decrivez l'etat general, l'historique d'entretien..." value={form.description} onChange={e => set('description', e.target.value)} />
            </div>
          </div>
          {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">{error}</div>}
          <button type="submit" disabled={loading || uploading} className="btn-primary w-full justify-center text-base disabled:opacity-50 rounded-xl py-4">
            {loading ? 'Publication en cours...' : 'Publier mon annonce'}
          </button>
          <p className="text-center text-[#8c8b8b] text-xs">L annonce sera verifiee par notre equipe avant publication</p>
        </form>
      </div>
    </div>
  )
}
