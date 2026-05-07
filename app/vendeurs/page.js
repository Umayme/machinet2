'use client'
import { useState } from 'react'
import Link from 'next/link'
import FeedbackForm from '../../components/FeedbackForm'

const avantages = [
  { titre: 'Visibilité nationale', desc: 'Votre catalogue visible par des acheteurs dans les 69 wilayas d\'Algérie.' },
  { titre: 'Leads qualifiés', desc: 'Recevez uniquement des demandes d\'acheteurs avec une vraie intention d\'achat.' },
  { titre: 'Badge vérifié', desc: 'Gagnez la confiance des acheteurs avec notre badge de vendeur vérifié MachiNet.' },
  { titre: 'Dashboard analytics', desc: 'Suivez vos vues, contacts, et performances. Optimisez vos annonces.' },
  { titre: 'IA au service de vos ventes', desc: 'Notre IA recommande vos machines aux acheteurs les plus pertinents automatiquement.' },
  { titre: 'Support dédié', desc: 'Un responsable compte vous accompagne de l\'inscription au premier lead.' },
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
              { v: '69', l: 'Wilayas couvertes' },
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
              <div key={i} className="card p-6">
                <h3 className="font-semibold text-[#141313] mb-2">{a.titre}</h3>
                <p className="text-[#8c8b8b] text-sm leading-relaxed">{a.desc}</p>
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
                <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-[#f9f9f8] z-0"></div>
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
          <div className="grid md:grid-cols-3 gap-6">
            {temoignages.map((t, i) => (
              <div key={i} className="card p-6">
                <div className="flex mb-4 gap-1">
                  {[...Array(t.note)].map((_, j) => <svg key={j} className="w-4 h-4 text-[#e46a33] fill-current inline-block" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>)}
                </div>
                <p className="text-[#8c8b8b] text-sm leading-relaxed mb-6 italic">"{t.texte}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f9f9f8] border border-[#e9e9e9] flex items-center justify-center text-[#e46a33] font-bold text-sm">{t.nom[0]}</div>
                  <div>
                    <p className="font-semibold text-[#141313] text-sm">{t.nom}</p>
                    <p className="text-[#434042] text-xs">{t.poste} · {t.wilaya}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 max-w-3xl mx-auto px-6">
        <h2 className="section-title text-center mb-12">Questions fréquentes</h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="card overflow-hidden">
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="font-medium text-[#141313] text-sm">{f.q}</span>
                <span className={`text-[#e46a33] text-xl transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-[#8c8b8b] text-sm leading-relaxed border-t border-[#e9e9e9] pt-4">
                  {f.r}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FEEDBACK */}
      <section className="py-20 max-w-2xl mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="section-title mb-3">Partagez votre expérience</h2>
          <p className="section-subtitle">Votre avis aide d'autres vendeurs à rejoindre MachiNet</p>
        </div>
        <FeedbackForm />
      </section>

      {/* CTA FINAL */}
      <section className="py-20 max-w-4xl mx-auto px-6 text-center">
        <div className="card p-16">
          <h2 className="section-title mb-4">Prêt à recevoir vos premiers leads ?</h2>
          <p className="text-[#8c8b8b] text-lg mb-8">Rejoignez 500+ vendeurs qui développent leur business sur MachiNet.</p>
          <Link href="/register?role=seller" className="btn-primary text-base px-12 py-4">
            Créer mon compte vendeur →
          </Link>
        </div>
      </section>

    </div>
  )
}
