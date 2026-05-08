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
          <div className="space-y-4">
            <div className="card p-5 flex items-start gap-4 hover:border-[#e46a33] transition-colors">
              <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#e46a33]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <h3 className="font-semibold text-[#141313] mb-1 text-sm">Email</h3>
                <a href="mailto:machinetdz@gmail.com" className="text-[#e46a33] text-sm font-medium hover:underline">machinetdz@gmail.com</a>
                <p className="text-[#434042] text-xs mt-1">Réponse sous 24h</p>
              </div>
            </div>
            <div className="card p-5 flex items-start gap-4 hover:border-[#e46a33] transition-colors">
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <div>
                <h3 className="font-semibold text-[#141313] mb-1 text-sm">Téléphone</h3>
                <a href="tel:+213659132072" className="text-[#e46a33] text-sm font-medium hover:underline">+213 659 132 072</a>
                <p className="text-[#434042] text-xs mt-1">Lun–Sam · 9h–18h</p>
              </div>
            </div>
            <div className="card p-5 flex items-start gap-4 hover:border-[#e46a33] transition-colors">
              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </div>
              <div>
                <h3 className="font-semibold text-[#141313] mb-1 text-sm">WhatsApp</h3>
                <a href="https://wa.me/213659132072" target="_blank" rel="noreferrer" className="text-[#e46a33] text-sm font-medium hover:underline">+213 659 132 072</a>
                <p className="text-[#434042] text-xs mt-1">Réponse rapide</p>
              </div>
            </div>
            <div className="card p-5 flex items-start gap-4 hover:border-[#e46a33] transition-colors">
              <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#e46a33]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div>
                <h3 className="font-semibold text-[#141313] mb-1 text-sm">Adresse</h3>
                <p className="text-[#e46a33] text-sm font-medium">Imama, Tlemcen — Algérie</p>
                <p className="text-[#434042] text-xs mt-1">Siège social</p>
              </div>
            </div>
          </div>

          {/* FORMULAIRE */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="card p-12 text-center">
                <h2 className="section-title mb-4">Message envoyé !</h2>
                <p className="text-[#8c8b8b] mb-8">Merci pour votre message. Notre équipe vous répondra dans les 24 heures.</p>
                <button onClick={() => { setSent(false); setForm({ nom: '', email: '', telephone: '', sujet: '', message: '' }) }} className="btn-primary">
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <div className="card p-8">
                <h2 className="font-bold text-[#141313] text-xl mb-6">Envoyez-nous un message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[#8c8b8b] text-sm mb-2 block">Nom complet *</label>
                      <input type="text" required placeholder="Votre nom et prénom" className="input-dark"
                        value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-[#8c8b8b] text-sm mb-2 block">Email *</label>
                      <input type="email" required placeholder="ahmed@entreprise.dz" className="input-dark"
                        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[#8c8b8b] text-sm mb-2 block">Téléphone *</label>
                      <input type="tel" required placeholder="+213 6XX XX XX XX" className="input-dark"
                        value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-[#8c8b8b] text-sm mb-2 block">Sujet *</label>
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
                    <label className="text-[#8c8b8b] text-sm mb-2 block">Message *</label>
                    <textarea required rows={6} placeholder="Décrivez votre besoin en détail..." className="input-dark resize-none"
                      value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  </div>
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 text-base disabled:opacity-50">
                    {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                  </button>
                  <p className="text-[#434042] text-xs text-center">
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
                <h3 className="font-bold text-[#141313] mb-2">{opt.titre}</h3>
                <p className="text-[#8c8b8b] text-sm mb-6">{opt.desc}</p>
                <Link href={opt.href} className="btn-outline w-full text-center justify-center block py-2 text-sm">{opt.btn}</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
