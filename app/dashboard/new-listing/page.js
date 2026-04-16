'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const wilayas = ['Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar','Blida','Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Alger','Djelfa','Jijel','Sétif','Saïda','Skikda','Sidi Bel Abbès','Annaba','Guelma','Constantine','Médéa','Mostaganem',"M'Sila",'Mascara','Ouargla','Oran','El Bayadh','Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf','Tissemsilt','El Oued','Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma','Aïn Témouchent','Ghardaïa','Relizane','Timimoun','Bordj Badji Mokhtar','Ouled Djellal','Béni Abbès','In Salah','In Guezzam','Touggourt','Djanet',"El M'Ghair",'El Meniaa']
const categories = ['BTP','IAA','Agricole','Textile','Industrie','Pharma','Mining','Énergie','Autre']
const conditions = ['Vente neuf','Occasion','Location']

export default function NewListingPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', category: '', price: '', condition: '', wilaya: '', description: '', specs: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/machines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      router.push('/dashboard')
    } else {
      setError(data.error || 'Erreur lors de la publication')
    }
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard" className="text-gray-500 hover:text-white transition-colors">← Dashboard</Link>
          <span className="text-gray-700">/</span>
          <span className="text-white">Nouvelle annonce</span>
        </div>
        <h1 className="text-3xl font-black text-white mb-8">Publier une machine</h1>

        <form onSubmit={handleSubmit} className="card p-8 space-y-5">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Nom de la machine *</label>
            <input required className="input-dark h-12" placeholder="Ex: Pelle hydraulique Caterpillar 320" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Catégorie / Secteur *</label>
              <select required className="input-dark h-12" value={form.category} onChange={e => set('category', e.target.value)}>
                <option value="">Sélectionner...</option>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">État *</label>
              <select required className="input-dark h-12" value={form.condition} onChange={e => set('condition', e.target.value)}>
                <option value="">Sélectionner...</option>
                {conditions.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Prix (DZD) *</label>
              <input required type="number" className="input-dark h-12" placeholder="Ex: 4500000" value={form.price} onChange={e => set('price', e.target.value)} />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Wilaya *</label>
              <select required className="input-dark h-12" value={form.wilaya} onChange={e => set('wilaya', e.target.value)}>
                <option value="">Sélectionner...</option>
                {wilayas.map(w => <option key={w}>{w}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Description</label>
            <textarea rows={4} className="input-dark resize-none" placeholder="État, année, heures de service, historique d'entretien..." value={form.description} onChange={e => set('description', e.target.value)} />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Spécifications techniques</label>
            <textarea rows={3} className="input-dark resize-none" placeholder="Puissance: 120kW, Poids: 18T, ..." value={form.specs} onChange={e => set('specs', e.target.value)} />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center h-12 text-base disabled:opacity-50">
            {loading ? 'Publication...' : 'Publier l\'annonce →'}
          </button>
        </form>
      </div>
    </div>
  )
}
