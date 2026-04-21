import Link from 'next/link'

const team = [
  { nom: 'Yassine Hadjadj', titre: 'CEO & Co-fondateur', bg: 'Ingénieur industriel, 10 ans dans le secteur des machines en Algérie.', wilaya: 'Alger' },
  { nom: 'Sarah Benmansour', titre: 'CTO & Co-fondatrice', bg: 'Développeuse full-stack, spécialisée IA et marketplaces B2B.', wilaya: 'Alger' },
  { nom: 'Omar Farès', titre: 'Head of Sales', bg: 'Commercial B2B industriel, ancien importateur de matériel BTP.', wilaya: 'Oran' },
  { nom: 'Nour Slimani', titre: 'Product Designer', bg: 'Designer UX/UI spécialisée SaaS et plateformes industrielles.', wilaya: 'Alger' },
  { nom: 'Anis Khelifi', titre: 'Responsable Partenariats', bg: 'Développement commercial, réseau de fournisseurs algériens.', wilaya: 'Constantine' },
  { nom: 'Rania Medjber', titre: 'Cheffe de projet Tech', bg: 'Ingénieure logiciel, infrastructure cloud et sécurité des données.', wilaya: 'Blida' },
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
  { date: 'Avr 2026', event: 'Lancement public — 69 wilayas couvertes' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">

      {/* HERO */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-900/20 border border-purple-800/40 rounded-full px-4 py-2 mb-6">
              <span className="text-purple-300 text-sm font-medium">Notre mission</span>
            </div>
            <h1 className="section-title text-5xl mb-6">
              Digitaliser le sourcing industriel en Algérie
            </h1>
            <p className="section-subtitle leading-relaxed mb-6">
              MachiNet est né d'un constat simple : trouver une machine industrielle en Algérie prend des mois. Des appels téléphoniques, des déplacements, des prix opaques. Il fallait une plateforme moderne.
            </p>
            <p className="text-gray-500 text-base leading-relaxed mb-8">
              Nous connectons les acheteurs industriels avec des vendeurs vérifiés dans les 69 wilayas. Avec l'IA, la transparence des prix et un réseau de consultants experts, nous transformons le marché des machines en Algérie.
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
              <div key={i} className="card p-6 text-center">
                <p className="text-3xl font-black text-purple-400 mb-1">{s.v}</p>
                <p className="text-gray-500 text-sm">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALEURS */}
      <section className="py-20 bg-gradient-to-b from-black via-purple-950/5 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Nos valeurs</h2>
            <p className="section-subtitle">Ce qui guide chacune de nos décisions</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valeurs.map((v, i) => (
              <div key={i} className="card p-6 text-center">
                <h3 className="text-white font-bold mb-2">{v.titre}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-20 max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">Notre parcours</h2>
        </div>
        <div className="relative">
          <div className="absolute left-24 top-0 bottom-0 w-px bg-purple-900/40"></div>
          <div className="space-y-8">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-8 items-start">
                <div className="w-20 text-right flex-shrink-0">
                  <span className="text-purple-400 text-xs font-bold">{m.date}</span>
                </div>
                <div className="relative flex-shrink-0 mt-1">
                  <div className="w-3 h-3 rounded-full bg-purple-600 border-2 border-purple-400"></div>
                </div>
                <div className="card p-4 flex-1">
                  <p className="text-gray-300 text-sm leading-relaxed">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÉQUIPE */}
      <section className="py-20 bg-gradient-to-b from-black via-purple-950/5 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Notre équipe</h2>
            <p className="section-subtitle">Des Algériens qui comprennent votre industrie</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((t, i) => (
              <div key={i} className="card p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center text-white font-black text-xl flex-shrink-0">
                    {t.nom[0]}
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{t.nom}</h3>
                    <p className="text-purple-400 text-sm">{t.titre}</p>
                    <p className="text-gray-600 text-xs">{t.wilaya}</p>
                  </div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{t.bg}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTENARIATS */}
      <section className="py-20 max-w-4xl mx-auto px-6">
        <div className="card p-8">
          <h3 className="text-white font-bold text-xl mb-4">Partenariats</h3>
          <p className="text-gray-400 text-sm mb-4">Associations, fédérations industrielles, chambres de commerce — travaillons ensemble.</p>
          <Link href="/contact" className="text-purple-400 hover:text-purple-300 transition-colors text-sm">
            Nous contacter →
          </Link>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-black text-white mb-4">
          Vous partagez notre vision ?
        </h2>
        <p className="text-gray-400 text-lg mb-8">
          Rejoignez des centaines d'industriels algériens qui font confiance à MachiNet.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="btn-primary">Créer un compte gratuit</Link>
          <Link href="/contact" className="btn-outline">Nous contacter</Link>
        </div>
      </section>

    </div>
  )
}
