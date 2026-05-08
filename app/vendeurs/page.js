'use client'
import { useState } from 'react'
import Link from 'next/link'
import FeedbackForm from '../../components/FeedbackForm'

const avantages = [
  {
    titre: 'Visibilité nationale',
    desc: 'Votre catalogue visible par des acheteurs dans les 58 wilayas d\'Algérie.',
    color: '#e46a33',
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  {
    titre: 'Leads qualifiés',
    desc: 'Recevez uniquement des demandes d\'acheteurs avec une vraie intention d\'achat.',
    color: '#10b981',
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
  {
    titre: 'Badge vérifié',
    desc: 'Gagnez la confiance des acheteurs avec notre badge de vendeur vérifié MachiNet.',
    color: '#3b82f6',
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
  },
  {
    titre: 'Dashboard analytics',
    desc: 'Suivez vos vues, contacts, et performances. Optimisez vos annonces.',
    color: '#8b5cf6',
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  },
  {
    titre: 'IA au service de vos ventes',
    desc: 'Notre IA recommande vos machines aux acheteurs les plus pertinents automatiquement.',
    color: '#f59e0b',
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  },
  {
    titre: 'Support dédié',
    desc: 'Un responsable compte vous accompagne de l\'inscription au premier lead.',
    color: '#ec4899',
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  },
]

const etapes = [
  { n: '1', titre: 'Créez votre profil vendeur', desc: 'Inscription en 5 minutes. Renseignez votre entreprise, secteur d\'activité et wilaya.' },
  { n: '2', titre: 'Publiez vos machines', desc: 'Ajoutez vos machines avec photos, spécifications techniques, prix et disponibilité.' },
  { n: '3', titre: 'Recevez des leads', desc: 'Les acheteurs vous contactent directement. Vous recevez leurs coordonnées complètes.' },
  { n: '4', titre: 'Gérez votre catalogue', desc: 'Dashboard en temps réel. Modifiez vos annonces, suivez vos performances, fermez vos ventes.' },
]

const temoignages = [
  { nom: 'Rachid Hadj Ali', poste: 'Importateur matériel BTP', wilaya: 'Alger', note: 5, texte: "Nous avons reçu 18 demandes qualifiées le premier mois. Le ROI est immédiat par rapport à la prospection traditionnelle." },
  { nom: 'Nadia Bouziane', poste: 'DG SARL Agri Machines', wilaya: 'Sétif', note: 5, texte: "MachiNet nous a permis de toucher des acheteurs dans des wilayas où nous n'avions aucune présence commerciale." },
  { nom: 'Youcef Merzouk', poste: 'Responsable commercial', wilaya: 'Oran', note: 5, texte: "La fonctionnalité de matching IA envoie nos machines aux bons acheteurs. Nos taux de conversion ont doublé." },
]

const faqs = [
  { q: "Combien coûte l'inscription pour un vendeur ?", r: "Le plan Starter permet de publier jusqu'à 3 annonces. Le plan Pro à 15 000 DZD/mois vous donne accès aux leads illimités, au badge vérifié et aux analytics avancés." },
  { q: "Combien de machines puis-je publier ?", r: "Le plan Starter permet jusqu'à 3 annonces actives. Le plan Pro est illimité." },
  { q: "Comment fonctionne la vérification vendeur ?", r: "Vous envoyez vos documents d'entreprise (RC, NIS). Notre équipe vérifie sous 48h. Vous recevez ensuite le badge vérifié." },
  { q: "Les acheteurs peuvent-ils me contacter directement ?", r: "Oui. Les acheteurs vous envoient une demande de contact avec leurs coordonnées. Vous les rappelez directement." },
]

export default function VendeursPage() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="min-h-screen pt-20">

      {/* HERO */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#f9f9f8] border border-[#e9e9e9] rounded-full px-4 py-2 mb-6">
              <span className="text-[#e46a33] text-sm font-medium">Pour les Vendeurs</span>
            </div>
            <h1 className="section-title text-5xl mb-6">
              Vendez vos machines à des acheteurs qualifiés dans toute l'Algérie
            </h1>
            <p className="section-subtitle mb-8">
              Rejoignez la première plateforme B2B de machines industrielles en Algérie. Publiez votre catalogue et recevez des leads qualifiés chaque mois.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register?role=seller" className="btn-primary text-base px-8 py-4">
                Créer un compte vendeur →
              </Link>
              <Link href="/tarifs" className="btn-outline text-base px-8 py-4">
                Voir les tarifs
              </Link>
            </div>
            <p className="text-[#434042] text-sm mt-4">Profil actif sous 24h</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { v: '10 000+', l: 'Acheteurs actifs' },
              { v: '45', l: 'Leads/mois en moyenne' },
              { v: '58', l: 'Wilayas couvertes' },
              { v: '3x', l: 'Plus de visibilité' },
            ].map((s, i) => (
              <div key={i} className="card p-6 text-center">
                <p className="text-3xl font-black text-[#e46a33] mb-1">{s.v}</p>
                <p className="text-[#8c8b8b] text-sm">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AVANTAGES */}
      <section className="py-20 bg-gradient-to-b from-[#f9f9f8] to-[#f9f9f8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Pourquoi vendre sur MachiNet ?</h2>
            <p className="section-subtitle">La plateforme conçue pour les industriels algériens</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {avantages.map((a, i) => (
              <div key={i} className="card p-6 flex gap-4" style={{ borderLeft: `4px solid ${a.color}` }}>
                <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${a.color}18`, color: a.color }}>
                  {a.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-[#141313] mb-1.5">{a.titre}</h3>
                  <p className="text-[#8c8b8b] text-sm leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÉTAPES */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">Commencez en 4 étapes</h2>
          <p className="section-subtitle">Simple, rapide, efficace</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {etapes.map((e, i) => (
            <div key={i} className="relative">
              {i < etapes.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-[#e9e9e9] z-0" style={{background: 'linear-gradient(90deg, #e46a33 0%, #e9e9e9 100%)'}}></div>
              )}
              <div className="card p-6 relative z-10">
                <div className="w-10 h-10 rounded-full bg-[#e46a33] text-white flex items-center justify-center font-bold text-lg mb-4">{e.n}</div>
                <h3 className="font-semibold text-[#141313] mb-2">{e.titre}</h3>
                <p className="text-[#8c8b8b] text-sm leading-relaxed">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/register?role=seller" className="btn-primary text-base px-10 py-4">
            Commencer maintenant →
          </Link>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="py-20 bg-gradient-to-b from-[#f9f9f8] to-[#f9f9f8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Vendeurs qui nous font confiance</h2>
          </div>
          <div className="grid md:grid-col