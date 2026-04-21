'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [form, setForm] = useState({ nom: '', email: '', telephone: '', sujet: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.nom,
          email: form.email,
          phone: form.telephone,
          message: `[${form.sujet}] ${form.message}`,
        }),
      })
      if (res.ok) {
        setSent(true)
      } else {
        const d = await res.json()
        setError(d.error || 'Erreur lors de l\'envoi')
      }
    } catch {
      setError('Erreur réseau, veuillez réessayer')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h1 className="section-title mb-4">Contactez-nous</h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            Notre équipe est disponible pour répondre à toutes vos questions.
            <br />Réponse garantie sous 24h.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* INFOS */}
          <div className="space-y-6">
            <div className="card p-6 flex items-start gap-4">
              <div>
                <h3 className="text-white font-semibold mb-1">Email</h3>
                <a href="mailto:machinetdz@gmail.com" className="text-purple-400 text-sm font-medium hover:text-purple-300">machinetdz@gmail.com</a>
                <p className="text-gray-600 text-xs mt-1">Réponse sous 24h</p>
              </div>
            </div>
            <div className="card p-6 flex items-start gap-4">
              <div>
                <h3 className="text-white font-semibold mb-1">Téléphone</h3>
                <a href="tel:+213659132072" className="text-purple-400 text-sm font-medium hover:text-purple-300">+213 659 132 072</a>
              </div>
            </div>
            <div className="card p-6 flex items-start gap-4">
              <div>
                <h3 className="text-white font-semibold mb-1">Adresse</h3>
                <p className="text-purple-400 text-sm font-medium">Alger, Algérie</p>
                <p className="text-gray-600 text-xs mt-1">Siège social</p>
              </div>
            </div>
            <div className="card p-6 flex items-start gap-4">
              <div>
                <h3 className="text-white font-semibold mb-1">WhatsApp</h3>
                <a href="https://wa.me/213659132072" target="_blank" rel="noreferrer" className="text-purple-400 text-sm font-medium hover:text-purple-300">+213 659 132 072</a>
                <p className="text-gray-600 text-xs mt-1">Réponse rapide</p>
              </div>
            </div>
          </div>

          {/* FORMULAIRE */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="card p-12 text-center">
                <h2 className="text-2xl font-black text-white mb-4">Message envoyé !</h2>
                <p className="text-gray-400 mb-8">Merci pour votre message. Notre équipe vous répondra dans les 24 heures.</p>
                <button onClick={() => { setSent(false); setForm({ nom: '', email: '', telephone: '', sujet: '', message: '' }) }} className="btn-primary">
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <div className="card p-8">
                <h2 className="text-white font-bold text-xl mb-6">Envoyez-nous un message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Nom complet *</label>
                      <input type="text" required placeholder="Votre nom et prénom" className="input-dark"
                        value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Email *</label>
                      <input type="email" required placeholder="ahmed@entreprise.dz" className="input-dark"
                        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Téléphone *</label>
                      <input type="tel" required placeholder="+213 6XX XX XX XX" className="input-dark"
                        value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Sujet *</label>
                      <select required className="input-dark" value={form.sujet} onChange={(e) => setForm({ ...form, sujet: e.target.value })}>
                        <option value="" className="bg-gray-900">Choisir un sujet</option>
                        <option value="Recherche machine" className="bg-gray-900">Recherche machine</option>
                        <option value="Devenir fournisseur" className="bg-gray-900">Devenir fournisseur</option>
                        <option value="Conseil expert" className="bg-gray-900">Conseil expert</option>
                        <option value="Support technique" className="bg-gray-900">Support technique</option>
                        <option value="Autre" className="bg-gray-900">Autre</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Message *</label>
                    <textarea required rows={6} placeholder="Décrivez votre besoin en détail..." className="input-dark resize-none"
                      value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  </div>
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 text-base disabled:opacity-50">
                    {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                  </button>
                  <p className="text-gray-600 text-xs text-center">
                    En envoyant ce formulaire, vous acceptez notre politique de confidentialité.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="mt-20">
          <h2 className="section-title text-center mb-12">Besoin d'aide rapide ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { titre: 'MachiBot', desc: 'Obtenez une recommandation instantanée sur votre besoin machine', btn: 'Parler à MachiBot', href: '/ia-bots' },
              { titre: 'Appel direct', desc: 'Parlez directement à un expert machines algérien', btn: 'Appeler maintenant', href: 'tel:+213659132072' },
              { titre: 'Consulting expert', desc: 'Réservez une session de conseil de 1h avec notre équipe', btn: 'Réserver', href: '/consulting' },
            ].map((opt, i) => (
              <div key={i} className="card p-6 text-center">
                <h3 className="text-white font-bold mb-2">{opt.titre}</h3>
                <p className="text-gray-500 text-sm mb-6">{opt.desc}</p>
                <Link href={opt.href} className="btn-outline w-full text-center justify-center block py-2 text-sm">{opt.btn}</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
