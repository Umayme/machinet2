'use client'
import { useState } from 'react'
import Link from 'next/link'

const plans = {
  acheteurs: [
    { nom: 'Gratuit', prix: 0, prixAnnuel: 0, desc: 'Pour découvrir', badge: null, features: ['Accès catalogue complet', 'Recherche & filtres', 'Consultation prix du marché', '3 demandes de contact/mois', 'MachiBot (10 questions/mois)'] },
    { nom: 'Premium', prix: 3000, prixAnnuel: 2400, desc: 'Pour les acheteurs actifs', badge: 'Populaire', features: ['Tout Gratuit', 'Contacts illimités', 'MachiBot illimité', 'Alertes nouvelles machines', 'Accès prix détaillés', 'Support prioritaire'] },
    { nom: 'Entreprise', prix: null, prixAnnuel: null, desc: 'Pour les grands comptes', badge: null, features: ['Tout Premium', 'Compte multi-utilisateurs', 'API accès données', 'Consultant dédié', 'Rapports marché mensuels', 'SLA garanti'] },
  ],
  vendeurs: [
    { nom: 'Gratuit', prix: 0, prixAnnuel: 0, desc: 'Pour démarrer', badge: null, features: ['3 annonces actives', 'Profil entreprise basique', 'Réception contacts acheteurs', 'Tableau de bord simple'] },
    { nom: 'Pro', prix: 15000, prixAnnuel: 12000, desc: 'Pour les vendeurs sérieux', badge: 'Recommandé', features: ['Annonces illimitées', 'Badge Vérifié', 'Mise en avant catalogue', 'Analytics avancés', 'Leads qualifiés prioritaires', 'Support dédié'] },
    { nom: 'Entreprise', prix: 45000, prixAnnuel: 36000, desc: 'Pour importateurs & grossistes', badge: null, features: ['Tout Pro', 'Page marque premium', 'Matching IA acheteurs', 'Intégration ERP/CRM', 'Account manager dédié', 'Rapport performance mensuel'] },
  ],
  consultants: [
    { nom: 'Starter', prix: 0, prixAnnuel: 0, desc: 'Pour lancer votre activité', badge: null, features: ['Profil consultant public', '3 missions/mois', 'Accès aux demandes acheteurs', 'Tableau de bord basique', 'Badge consultant vérifié (sur approbation)'] },
    { nom: 'Pro', prix: 12000, prixAnnuel: 9600, desc: 'Pour les consultants actifs', badge: 'Recommandé', features: ['Tout Starter', 'Missions illimitées', 'Mise en avant profil', 'Analytics & rapports', 'Accès leads prioritaires', 'Support dédié 7j/7'] },
    { nom: 'Cabinet', prix: null, prixAnnuel: null, desc: 'Pour les cabinets industriels', badge: null, features: ['Tout Pro', 'Comptes équipe multi-consultants', 'Page cabinet premium', 'Intégration CRM', 'Account manager dédié', 'Contrats-cadres'] },
  ],
}

export default function TarifsPage() {
  const [tab, setTab] = useState('vendeurs')
  const [annuel, setAnnuel] = useState(false)
  const currentPlans = plans[tab]

  return (
    <div className="min-h-screen pt-20">
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="section-title text-5xl mb-4">Tarifs MachiNet</h1>
          <p className="section-subtitle mb-8">Plans simples et transparents — tout en DZD</p>

          {/* Tabs */}
          <div className="inline-flex bg-white/5 border border-purple-900/30 rounded-xl p-1 mb-8">
            {[['vendeurs', 'Vendeurs'], ['acheteurs', 'Acheteurs'], ['consultants', 'Consultants']].map(([v, l]) => (
              <button key={v} onClick={() => setTab(v)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${tab === v ? 'bg-purple-700 text-white' : 'text-gray-400 hover:text-white'}`}>
                {l}
              </button>
            ))}
          </div>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className={`text-sm ${!annuel ? 'text-white' : 'text-gray-500'}`}>Mensuel</span>
            <button onClick={() => setAnnuel(!annuel)}
              className={`w-12 h-6 rounded-full transition-colors ${annuel ? 'bg-purple-600' : 'bg-white/20'}`}>
              <span className={`block w-4 h-4 bg-white rounded-full mx-1 transition-transform ${annuel ? 'translate-x-6' : ''}`}></span>
            </button>
            <span className={`text-sm ${annuel ? 'text-white' : 'text-gray-500'}`}>Annuel</span>
            {annuel && <span className="bg-green-900/30 text-green-400 text-xs px-2 py-0.5 rounded-full border border-green-800/40">-20%</span>}
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {currentPlans.map((p, i) => (
            <div key={i} className={`card p-8 relative ${p.badge ? 'border-purple-600/60' : ''}`}>
              {p.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-700 text-white text-xs font-bold px-4 py-1 rounded-full">
                  {p.badge}
                </span>
              )}
              <h3 className="text-white font-black text-xl mb-1">{p.nom}</h3>
              <p className="text-gray-500 text-sm mb-4">{p.desc}</p>
              <div className="mb-6">
                {p.prix === null ? (
                  <p className="text-2xl font-black text-white">Sur devis</p>
                ) : p.prix === 0 ? (
                  <p className="text-4xl font-black text-purple-400">Gratuit</p>
                ) : (
                  <>
                    <p className="text-4xl font-black text-purple-400">
                      {(annuel ? p.prixAnnuel : p.prix).toLocaleString('fr-DZ')}
                      <span className="text-base text-purple-600 font-normal"> DZD/mois</span>
                    </p>
                    {annuel && <p className="text-gray-500 text-xs mt-1">Facturé annuellement</p>}
                  </>
                )}
              </div>
              <ul className="space-y-2 mb-8">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-gray-400 text-sm">
                    <span className="text-purple-400 mt-0.5 flex-shrink-0">•</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={p.prix === null ? '/contact' : tab === 'consultants' ? '/register?role=consultant' : tab === 'vendeurs' ? '/register?role=seller' : '/register'}
                className={`w-full justify-center ${p.badge ? 'btn-primary' : 'btn-outline'}`}>
                {p.prix === 0 ? "S'inscrire" : p.prix === null ? 'Nous contacter' : "S'abonner"}
              </Link>
            </div>
          ))}
        </div>

        {/* Consulting */}
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">Services de consulting</h2>
          <p className="section-subtitle mb-8">Accompagnement expert pour vos projets industriels</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { nom: 'Audit & Sourcing', prix: '45 000 DZD', duree: '3-5 jours', desc: 'Analyse besoins + benchmark fournisseurs + rapport' },
              { nom: 'Accompagnement Achat', prix: '75 000 DZD', duree: '1-2 semaines', desc: 'Sourcing + négociation + vérification + contrat', badge: 'Populaire' },
              { nom: 'Projet Clé en Main', prix: 'Sur devis', duree: 'Variable', desc: 'De l\'étude de faisabilité à la mise en route complète' },
            ].map((s, i) => (
              <div key={i} className="card p-6 relative">
                {s.badge && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-700 text-white text-xs font-bold px-4 py-1 rounded-full">{s.badge}</span>}
                <h3 className="text-white font-bold mb-2">{s.nom}</h3>
                <p className="text-purple-400 font-black text-lg mb-1">{s.prix}</p>
                <p className="text-gray-600 text-xs mb-3">{s.duree}</p>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/consulting" className="btn-primary">Demander un devis consulting →</Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="section-title text-center mb-8">Questions fréquentes</h2>
          {[
            { q: 'Puis-je changer de plan à tout moment ?', r: 'Oui, upgrade ou downgrade à tout moment sans pénalité.' },
            { q: 'Y a-t-il une commission sur les ventes ?', r: 'Non. MachiNet ne prend aucune commission. Vous payez uniquement l\'abonnement mensuel.' },
            { q: 'Comment payer en Algérie ?', r: 'Virement bancaire, CCP, ou paiement en agence. Facture officielle fournie.' },
            { q: "Comment fonctionne le plan Starter ?", r: "Le plan Starter vous permet de démarrer avec des fonctionnalités de base. Pas de carte bancaire requise pour démarrer." },
          ].map((f, i) => (
            <div key={i} className="card p-5 mb-3">
              <p className="text-white font-medium text-sm mb-2">{f.q}</p>
              <p className="text-gray-500 text-sm">{f.r}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
