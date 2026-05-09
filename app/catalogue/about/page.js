'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const staticTeam = [
  { id: 's1', nom: 'Yassine Hadjadj', titre: 'CEO & Co-fondateur', bio: 'Ingénieur industriel, 10 ans dans le secteur des machines en Algérie.', wilaya: 'Alger' },
  { id: 's2', nom: 'Sarah Benmansour', titre: 'CTO & Co-fondatrice', bio: 'Développeuse full-stack, spécialisée IA et marketplaces B2B.', wilaya: 'Alger' },
  { id: 's3', nom: 'Omar Farès', titre: 'Head of Sales', bio: 'Commercial B2B industriel, ancien importateur de matériel BTP.', wilaya: 'Oran' },
  { id: 's4', nom: 'Nour Slimani', titre: 'Product Designer', bio: 'Designer UX/UI spécialisée SaaS et plateformes industrielles.', wilaya: 'Alger' },
  { id: 's5', nom: 'Anis Khelifi', titre: 'Responsable Partenariats', bio: 'Développement commercial, réseau de fournisseurs algériens.', wilaya: 'Constantine' },
  { id: 's6', nom: 'Rania Medjber', titre: 'Cheffe de projet Tech', bio: 'Ingénieure logiciel, infrastructure cloud et sécurité des données.', wilaya: 'Blida' },
]

const valeurs = [
  { titre: 'Transparence', desc: 'Des prix réels, des vendeurs vérifiés. Pas de faux profils, pas de prix cachés.' },
  { titre: 'Algérie first', desc: 'Conçu pour le marché algérien, par des Algériens. Nous connaissons vos défis.' },
  { titre: 'Efficacité', desc: "Réduire le temps de sourcing de 3 mois à 3 jours. C'est notre mission." },
  { titre: 'Confiance', desc: 'Chaque vendeur est vérifié. Chaque transaction sécurisée. Votre tranquillité d\'esprit.' },
]

const milestones = [
  { date: 'Jan 2024', event: 'Idée fondatrice — constat du problème de sourcing industriel en Algérie' },
  { date: 'Avr 2024', event: 'Premiers prototypes et interviews avec 50 industriels algériens' },
  { date: 'Sep 2024', event: 'Levée de fonds initiale. Recrutement de l\'équipe technique' },
  { date: 'Jan 2025', event: 'Lancement de la beta fermée avec 30 vendeurs partenaires' },
  { date: 'Juin 2025', event: '500 vendeurs inscrits, 3 200 machines référencées' },
  { date: 'Avr 2026', event: 'Lancement public — 58 wilayas couvertes' },
]

export default function AboutPage() {
  const [team, setTeam] = useState(staticTeam)

  useEffect(() => {
    fetch('/api/team')
      .then(r => r.json())
      .then(d => { if (d.members && d.members.length > 0) setTeam(d.members) })
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen">

      {/* HERO — dark band */}
      <div className="bg-[#141313] pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <span className="text-[#e46a33] text-sm font-medium">Notre mission</span>
            </div>
            <h1 className="hero-title text-white mb-6">
              Digitaliser le sourcing<br/><span style={{color:'#e46a33'}}>industriel en Algérie</span>
            </h1>
            <p className="text-[#8c8b8b] leading-relaxed mb-4">
              MachiNet est né d'un constat simple : trouver une machine industrielle en Algérie prend des mois. Des appels téléphoniques, des déplacements, des prix opaques. Il fallait une plateforme moderne.
            </p>
            <p className="text-[#8c8b8b] leading-relaxed mb-8">
              Nous connectons les acheteurs industriels avec des vendeurs vérifiés dans les 58 wilayas. Avec l'IA, la transparence des prix et un réseau de consultants experts, nous transformons le marché des machines en Algérie.
            </p>
            <Link href="/register" className="btn-primary">Rejoindre MachiNet →</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { v: '2026', l: 'Lancé en' },
              { v: '500+', l: 'Vendeurs actifs' },
              { v: '58', l: 'Wilayas couvertes' },
              { v: '10 000+', l: 'Acheteurs inscrits' },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <p className="text-3xl font-bold text-[#e46a33] font-['Barlow_Condensed'] mb-1">{s.v}</p>
                <p className="text-[#8c8b8b] text-sm">{s.l}</p>
              </div>
            ))}
          </div>
          </div>{/* close grid */}
        </div>{/* close max-w */}
      </div>{/* close dark hero */}

      {/* VALEURS */}
      <section className="py-20 bg-[#f9f9f8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Nos valeurs</h2>
            <p className="section-subtitle">Ce qui guide chacune de nos décisions</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { titre: 'Transparence', desc: 'Des prix réels, des vendeurs vérifiés. Pas de faux profils, pas de prix cachés.', icon: '🔍', color: '#3b82f6' },
              { titre: 'Algérie first', desc: 'Conçu pour le marché algérien, par des Algériens. Nous connaissons vos défis.', icon: '🇩🇿', color: '#10b981' },
              { titre: 'Efficacité', desc: "Réduire le temps de sourcing de 3 mois à 3 jours. C'est notre mission.", icon: '⚡', color: '#f59e0b' },
              { titre: 'Confiance', desc: 'Chaque vendeur est vérifié. Chaque transaction sécurisée. Votre tranquillité d\'esprit.', icon: '🏅', color: '#e46a33' },
            ].map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[#e9e9e9] text-center hover:shadow-md transition-all" style={{ borderTop: `3px solid ${v.color}` }}>
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="font-bold text-[#141313] mb-2">{v.titre}</h3>
                <p className="text-[#8c8b8b] text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÉQUIPE */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Notre équipe</h2>
            <p className="section-subtitle">Des Algériens qui comprennent votre industrie</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((t, i) => (
              <div key={t.id || i} className="card p-6 hover:border-[#e46a33] transition-all">
                {/* Photo area */}
                <div className="mb-4 relative">
                  {t.avatar ? (
                    <img src={t.avatar} alt={t.nom} className="w-full h-48 object-cover rounded-xl" />
                  ) : (
                    <div className="w-full h-48 rounded-xl bg-gradient-to-br from-[#f9f9f8] to-[#e9e9e9] border-2 border-dashed border-[#e9e9e9] flex flex-col items-center justify-center gap-2">
                      <div className="w-16 h-16 rounded-full bg-[#141313] flex items-center justify-center text-white font-black text-2xl">
                        {t.nom[0]}
                      </div>
                      <div className="flex items-center gap-1 text-[#8c8b8b] text-xs">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        Photo à venir
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-[#141313] text-base">{t.nom}</h3>
                  <p className="text-[#e46a33] text-sm font-medium">{t.titre}</p>
                  <p className="text-[#434042] text-xs mb-3">{t.wilaya}</p>
                  <p className="text-[#8c8b8b] text-sm leading-relaxed">{t.bio || t.bg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTENARIATS */}
      <section className="py-20 max-w-4xl mx-auto px-6">
        <div className="card p-8">
          <h3 className="font-bold text-[#141313] text-xl mb-4">Partenariats</h3>
          <p className="text-[#8c8b8b] text-sm mb-4">Associations, fédérations industrielles, chambres de commerce — travaillons ensemble.</p>
          <Link href="/contact" className="text-[#e46a33] hover:text-[#e46a33] transition-colors text-sm">
            Nous contacter →
          </Link>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 max-w-4xl mx-auto px-6 text-center">
        <h2 className="section-title mb-4">
          Vous partagez notre vision ?
        </h2>
        <p className="text-[#8c8b8b] text-lg mb-8">
          Rejoignez des centaines d'industriels algériens qui font confiance à MachiNet.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="btn-primary">Rejoindre MachiNet →</Link>
          <Link href="/contact" className="btn-outline">Nous contacter</Link>
        </div>
      </section>

    </div>
  )
}
