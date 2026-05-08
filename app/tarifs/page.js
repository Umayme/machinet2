'use client'
import { useState } from 'react'
import Link from 'next/link'

const plans = [
  {
    nom: 'Starter',
    prix: 0,
    desc: 'Pour découvrir MachiNet',
    badge: null,
    color: '#8c8b8b',
    cta: "S'inscrire gratuitement",
    href: '/register',
  },
  {
    nom: 'Bronze',
    prix: 15000,
    desc: 'Pour démarrer sérieusement',
    badge: null,
    color: '#cd7f32',
    cta: "Choisir Bronze",
    href: '/register?plan=bronze',
  },
  {
    nom: 'Silver',
    prix: 30000,
    desc: 'Pour les vendeurs actifs',
    badge: 'Recommandé',
    color: '#e46a33',
    cta: "Choisir Silver",
    href: '/register?plan=silver',
  },
  {
    nom: 'Gold',
    prix: 45000,
    desc: 'Pour importateurs & grossistes',
    badge: 'Premium',
    color: '#141313',
    cta: "Choisir Gold",
    href: '/register?plan=gold',
  },
]

const comparisonFeatures = [
  { label: 'Annonces actives', values: ['3', '15', 'Illimité', 'Illimité'] },
  { label: 'Contacts acheteurs/mois', values: ['3', 'Illimité', 'Illimité', 'Illimité'] },
  { label: 'Badge Vérifié', values: [false, true, true, true] },
  { label: 'Analytics', values: [false, 'Basique', 'Avancé', 'Avancé+'] },
  { label: 'Leads qualifiés', values: [false, false, true, true] },
  { label: 'MachiBot', values: ['10 questions', 'Illimité', 'Illimité', 'Illimité'] },
  { label: 'Mise en avant catalogue', values: [false, false, true, true] },
  { label: 'Accès prix du marché', values: [false, false, true, true] },
  { label: 'Page marque premium', values: [false, false, false, true] },
  { label: 'Matching IA', values: [false, false, false, true] },
  { label: 'Multi-utilisateurs', values: [false, false, false, true] },
  { label: 'Account manager', values: [false, false, false, true] },
  { label: 'Support', values: ['FAQ', 'Email', '7j/7', 'Dédié'] },
]

const creditPacks = [
  { nom: 'Pack Starter', credits: 50, prix: 2500 },
  { nom: 'Pack Pro', credits: 150, prix: 6500, badge: 'Populaire' },
  { nom: 'Pack Business', credits: 500, prix: 18000 },
]

const actionCosts = [
  { action: 'Publier une annonce', credits: 5 },
  { action: 'Contacter un vendeur', credits: 3 },
  { action: 'Demande de devis', credits: 4 },
  { action: 'Mise en avant annonce (7j)', credits: 10 },
  { action: 'Accès fiche technique complète', credits: 2 },
  { action: 'Export catalogue PDF', credits: 8 },
  { action: 'Alerte machine personnalisée', credits: 5 },
  { action: 'Demande de consultation expert', credits: 15 },
]

const faqs = [
  { q: 'Puis-je changer de plan à tout moment ?', r: 'Oui, upgrade ou downgrade à tout moment sans pénalité. La facturation est ajustée au prorata.' },
  { q: 'Y a-t-il une commission sur les ventes ?', r: 'Non. MachiNet ne prend aucune commission. Vous payez uniquement l\'abonnement mensuel.' },
  { q: 'Comment payer en Algérie ?', r: 'Virement bancaire, CCP, ou paiement en agence. Facture officielle fournie.' },
  { q: 'Les crédits expirent-ils ?', r: 'Les crédits sont valables 12 mois à partir de la date d\'achat. Ils se cumulent avec votre abonnement.' },
]

export default function TarifsPage() {
  const [showActions, setShowActions] = useState(false)

  return (
    <div className="min-h-screen">

      {/* HERO — dark band */}
      <div className="bg-[#141313] pt-20 pb-14">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="hero-title text-white mb-3">Tarifs <span style={{color:'#e46a33'}}>MachiNet</span></h1>
          <p className="text-[#8c8b8b] text-lg mb-2">Plans simples et transparents — tout en DZD</p>
          <p className="text-[#8c8b8b] text-sm">Sans commission · Facturation mensuelle · Résiliable à tout moment</p>
        </div>
      </div>

      {/* PLANS CARDS */}
      <section className="pb-10 max-w-7xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((p, i) => (
            <div key={i} className={`rounded-2xl p-6 relative flex flex-col border-2 transition-all hover:shadow-lg ${p.badge === 'Recommandé' ? 'border-[#e46a33] bg-white' : p.badge === 'Premium' ? 'border-[#141313] bg-[#141313]' : 'border-[#e9e9e9] bg-white'}`}>
              {p.badge && (
                <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-4 py-1 rounded-full ${p.badge === 'Premium' ? 'bg-[#e46a33]' : 'bg-[#e46a33]'}`}>
                  {p.badge}
                </span>
              )}
              <div className="mb-4">
                <h3 className="font-black text-2xl mb-1" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: p.badge === 'Premium' ? '#e46a33' : p.color }}>{p.nom}</h3>
                <p className={`text-xs ${p.badge === 'Premium' ? 'text-white/60' : 'text-[#8c8b8b]'}`}>{p.desc}</p>
              </div>
              <div className="mb-6">
                {p.prix === 0 ? (
                  <p className={`text-4xl font-black ${p.badge === 'Premium' ? 'text-white' : 'text-[#141313]'}`}>Gratuit</p>
                ) : (
                  <>
                    <p className={`text-3xl font-black ${p.badge === 'Premium' ? 'text-white' : 'text-[#141313]'}`}>
                      {p.prix.toLocaleString('fr-DZ')}
                      <span className={`text-base font-normal ${p.badge === 'Premium' ? 'text-white/50' : 'text-[#8c8b8b]'}`}> DZD</span>
                    </p>
                    <p className={`text-xs mt-1 ${p.badge === 'Premium' ? 'text-white/50' : 'text-[#8c8b8b]'}`}>par mois</p>
                  </>
                )}
              </div>
              <div className="flex-1" />
              <Link href={p.href}
                className={`w-full text-center py-3 rounded-xl text-sm font-semibold transition-all mt-4 ${p.badge === 'Recommandé' ? 'bg-[#e46a33] text-white hover:bg-[#c85a25]' : p.badge === 'Premium' ? 'bg-[#e46a33] text-white hover:bg-[#c85a25]' : 'border-2 border-[#e9e9e9] text-[#141313] hover:border-[#141313]'}`}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="pb-16 max-w-7xl mx-auto px-6">
        <div className="overflow-x-auto rounded-2xl border border-[#e9e9e9]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f9f9f8]">
                <th className="text-left px-6 py-4 text-[#434042] font-semibold w-52">Fonctionnalité</th>
                {plans.map((p, i) => (
                  <th key={i} className="text-center px-4 py-4 font-black text-base" style={{ color: p.color, fontFamily: 'Barlow Condensed, sans-serif' }}>
                    {p.nom}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((feature, fi) => (
                <tr key={fi} className={fi % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f8]/50'}>
                  <td className="px-6 py-3.5 text-[#434042] font-medium">{feature.label}</td>
                  {feature.values.map((val, vi) => (
                    <td key={vi} className="px-4 py-3.5 text-center">
                      {val === true ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                        </span>
                      ) : val === false ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                        </span>
                      ) : (
                        <span className="text-[#141313] font-medium text-sm">{val}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-[#f9f9f8]">
                <td className="px-6 py-4"></td>
                {plans.map((p, i) => (
                  <td key={i} className="px-4 py-4 text-center">
                    <Link href={p.href}
                      className={`inline-block px-5 py-2 rounded-lg text-sm font-semibold transition-all ${p.badge ? 'bg-[#e46a33] text-white hover:bg-[#c85a25]' : 'border border-[#e9e9e9] text-[#141313] hover:border-[#141313]'}`}>
                      {p.cta}
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CREDIT PACKS */}
      <section className="py-16 bg-[#f9f9f8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="section-title mb-3">Packs de crédits</h2>
            <p className="text-[#8c8b8b]">Complétez votre abonnement avec des crédits pour des actions ponctuelles</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {creditPacks.map((c, i) => (
              <div key={i} className={`card p-6 text-center relative ${c.badge ? 'border-[#e46a33] border-2' : ''}`}>
                {c.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#e46a33] text-white text-xs font-bold px-4 py-1 rounded-full">
                    {c.badge}
                  </span>
                )}
                <p className="text-3xl font-black text-[#e46a33] mb-1">{c.credits}</p>
                <p className="text-[#8c8b8b] text-xs mb-3">crédits</p>
                <p className="font-bold text-[#141313] mb-1">{c.nom}</p>
                <p className="text-[#8c8b8b] text-sm mb-4">{c.prix.toLocaleString('fr-DZ')} DZD</p>
                <Link href="/register" className="btn-primary w-full justify-center text-sm py-2">Acheter</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COÛT DES ACTIONS */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <button
      