'use client'
import { useState } from 'react'

export default function FeedbackForm({ onSuccess }) {
  const [form, setForm] = useState({ nom: '', poste: '', wilaya: '', note: 5, texte: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setDone(true)
        onSuccess?.()
      } else {
        const d = await res.json()
        setError(d.error || 'Erreur lors de l\'envoi')
      }
    } catch {
      setError('Erreur réseau')
    }
    setLoading(false)
  }

  if (done) {
    return (
      <div className="card p-8 text-center">
        <h3 className="text-white font-bold text-lg mb-2">Merci pour votre avis !</h3>
        <p className="text-[#8c8b8b] text-sm">Votre témoignage sera publié après validation par notre équipe.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-4">
      <h3 className="text-white font-bold text-lg">Partagez votre expérience</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[#8c8b8b] text-sm mb-1 block">Nom complet *</label>
          <input required className="input-dark" placeholder="Votre nom" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} />
        </div>
        <div>
          <label className="text-[#8c8b8b] text-sm mb-1 block">Poste / Entreprise</label>
          <input className="input-dark" placeholder="Ex: DG SARL MachinesPro" value={form.poste} onChange={e => setForm(f => ({ ...f, poste: e.target.value }))} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[#8c8b8b] text-sm mb-1 block">Wilaya</label>
          <input className="input-dark" placeholder="Ex: Alger" value={form.wilaya} onChange={e => setForm(f => ({ ...f, wilaya: e.target.value }))} />
        </div>
        <div>
          <label className="text-[#8c8b8b] text-sm mb-1 block">Note *</label>
          <div className="flex gap-1 mt-1">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} type="button" onClick={() => setForm(f => ({ ...f, note: n }))}
                className={`w-7 h-7 rounded-full border-2 transition-all ${n <= form.note ? 'bg-[#e46a33] border-[#e46a33]' : 'bg-transparent border-gray-700 hover:border-[#e46a33]'}`}>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <label className="text-[#8c8b8b] text-sm mb-1 block">Votre avis *</label>
        <textarea required rows={4} className="input-dark resize-none" placeholder="Décrivez votre expérience avec MachiNet..." value={form.texte} onChange={e => setForm(f => ({ ...f, texte: e.target.value }))} />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-50">
        {loading ? 'Envoi...' : 'Envoyer mon témoignage'}
      </button>
      <p className="text-[#434042] text-xs text-center">Votre avis sera publié après modération.</p>
    </form>
  )
}
