'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import FeedbackForm from '../../components/FeedbackForm'

const temoignages = [
    { nom: 'Karim Mansouri', poste: 'Importateur machines IAA', wilaya: 'Alger', note: 5, texte: "En 3 mois j'ai reçu 45 leads qualifiés. Mon chiffre d'affaires a augmenté de 30%." },
    { nom: 'Samir Boudali', poste: 'SARL EquipBTP', wilaya: 'Oran', note: 5, texte: "Le dashboard analytics m'aide à comprendre quels produits intéressent le plus mes clients." },
    { nom: 'Nassim Tebbal', poste: 'AgriMach Sétif', wilaya: 'Sétif', note: 5, texte: "Le badge vérifié a vraiment boosté ma crédibilité. Les clients me contactent avec confiance." },
]

const staticFaq = [
    { id: 's1', q: "Comment fonctionne la vérification fournisseur ?", r: "Notre équipe vérifie votre registre de commerce, vos références clients et la qualité de vos machines avant d'attribuer le badge vérifié. Délai : 3–5 jours ouvrables." },
    { id: 's2', q: "Combien de leads puis-je recevoir par mois ?", r: "Avec le plan Pro, il n'y a pas de limite. En moyenne, nos fournisseurs Pro reçoivent 15–40 leads qualifiés par mois selon leur secteur." },
    { id: 's3', q: "Puis-je publier des machines de plusieurs marques ?", r: "Oui, absolument. Vous pouvez publier toutes les marques que vous distribuez, avec des fiches produits séparées pour chacune." },
    { id: 's4', q: "Comment sont qualifiés les leads ?", r: "Chaque acheteur doit renseigner son secteur, budget approximatif et wilaya avant de vous contacter. Vous recevez uniquement des prospects avec une vraie intention d'achat." },
]

export default function FournisseursPage() {
    const [openFaq, setOpenFaq] = useState(null)
    const [faqItems, setFaqItems] = useState(staticFaq)
    const [dbFeedbacks, setDbFeedbacks] = useState([])

    useEffect(() => {
        fetch('/api/faq?page=fournisseurs')
            .then(r => r.json())
            .then(d => { if (d.faqs && d.faqs.length > 0) setFaqItems(d.faqs.map(f => ({ id: f.id, q: f.question, r: f.reponse }))) })
            .catch(() => {})
        fetch('/api/feedback')
            .then(r => r.json())
            .then(d => { if (d.feedbacks) setDbFeedbacks(d.feedbacks) })
            .catch(() => {})
    }, [])

    return (
        <div className="min-h-screen">
            {/* HERO — dark band */}
            <div className="bg-[#141313] pt-20 pb-16">
              <div className="max-w-7xl mx-auto px-6">
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8">
                        <span className="w-2 h-2 bg-[#e46a33] rounded-full animate-pulse"></span>
                        <span className="text-[#e46a33] text-sm font-medium">+500 fournisseurs nous font confiance</span>
                    </div>
                    <h1 className="hero-title text-white mb-4">
                        Développez votre business<br /><span style={{color:'#e46a33'}}>avec MachiNet</span>
                    </h1>
                    <p className="text-[#8c8b8b] text-lg max-w-2xl mx-auto mb-10">
                        Rejoignez la 1ère plateforme B2B machines en Algérie. Publiez votre catalogue, recevez des leads qualifiés et boostez votre visibilité dans les 58 wilayas.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Link href="/register?role=seller" className="btn-primary text-base px-10 py-4">
                            Créer mon profil fournisseur
                        </Link>
                        <Link href="/tarifs" className="px-10 py-4 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all font-semibold text-base">
                            Voir les tarifs →
                        </Link>
                    </div>

                    {/* STATS inside dark band */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { val: '10 000+', label: 'Acheteurs actifs' },
                            { val: '45', label: 'Leads/mois en moyenne' },
                            { val: '58', label: 'Wilayas couvertes' },
                            { val: '3x', label: 'Plus de visibilité' },
                        ].map((s, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                                <p className="text-3xl font-bold text-[#e46a33] font-['Barlow_Condensed'] mb-1">{s.val}</p>
                                <p className="text-[#8c8b8b] text-sm">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pb-20 pt-16">

                {/* AVANTAGES */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="section-title mb-4">Pourquoi rejoindre MachiNet ?</h2>
                        <p className="section-subtitle">Tout ce dont vous avez besoin pour vendre plus</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { titre: 'Visibilité nationale', desc: 'Votre catalogue visible par 10 000+ acheteurs industriels dans les 58 wilayas d\'Algérie.' },
                            { titre: 'Leads qualifiés', desc: 'Recevez uniquement des prospects avec budget défini, secteur précis et vraie intention d\'achat.' },
                            { titre: 'Badge vérifié', desc: 'Le badge de vérification booste votre crédibilité et multiplie par 3 votre taux de conversion.' },
                            { titre: 'Dashboard analytics', desc: 'Suivez vos vues, clics, leads et performances en temps réel. Optimisez votre catalogue.' },
                            { titre: 'Matching intelligent', desc: 'Notre plateforme recommande automatiquement vos machines aux acheteurs les plus pertinents.' },
                            { titre: 'Gestion simplifiée', desc: 'Gérez votre catalogue, répondez aux leads et suivez vos stats depuis votre dashboard.' },
                        ].map((a, i) => (
                            <div key={i} className="card p-6">
                                <h3 className="font-bold text-[#141313] mb-2">{a.titre}</h3>
                                <p className="text-[#8c8b8b] text-sm leading-relaxed">{a.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* COMMENT ÇA MARCHE */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="section-title mb-4">Démarrez en 3 étapes</h2>
                        <p className="section-subtitle">Simple et rapide — profil actif en moins de 24h</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { n: '1', titre: 'Créez votre profil', desc: 'Inscription en quelques minutes. Renseignez votre entreprise, secteur et coordonnées.' },
                            { n: '2', titre: 'Publiez vos machines', desc: 'Ajoutez photos, spécifications, prix et disponibilité. Notre équipe vous aide si besoin.' },
                            { n: '3', titre: 'Recevez des leads', desc: 'Les acheteurs vous contactent directement. Vous gérez tout depuis votre dashboard.' },
                        ].map((step, i) => (
                            <div key={i} className="text-center">
                                <div className="w-16 h-16 rounded-full bg-[#e46a33] flex items-center justify-center text-white font-black text-2xl mx-auto mb-6">
                                    {step.n}
                                </div>
                                <h3 className="font-bold text-[#141313] text-lg mb-3">{step.titre}</h3>
                                <p className="text-[#8c8b8b] text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* TÉMOIGNAGES */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="section-title mb-4">Ce que disent nos fournisseurs</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(dbFeedbacks.length > 0 ? dbFeedbacks.slice(0, 6) : temoignages).map((t, i) => (
                            <div key={i} className="card p-6">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(t.note || 5)].map((_, j) => <span key={j} className="w-2 h-2 rounded-full bg-[#e46a33] inline-block"></span>)}
                                </div>
                                <p className="text-[#8c8b8b] text-sm leading-relaxed mb-6 italic">"{t.texte || t.texte}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#f9f9f8] border border-[#e9e9e9] flex items-center justify-center text-[#e46a33] font-bold">
                                        {(t.nom || '?')[0]}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#141313] text-sm">{t.nom}</p>
                                        <p className="text-[#434042] text-xs">{t.poste}{t.wilaya ? ` · ${t.wilaya}` : ''}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FEEDBACK FORM */}
                <div className="mb-20 max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="section-title mb-3">Partagez votre expérience</h2>
                        <p className="section-subtitle">Votre témoignage aide d'autres fournisseurs à rejoindre MachiNet</p>
                    </div>
                    <FeedbackForm />
                </div>

                {/* FAQ */}
                <div className="mb-20 max-w-3xl mx-auto">
                    <h2 className="section-title text-center mb-12">Questions fréquentes</h2>
                    <div className="space-y-4">
                        {faqItems.map((faq, i) => (
                            <div key={i} className="card overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full px-6 py-5 text-left flex items-center justify-between"
                                >
                                    <span className="font-semibold text-[#141313] text-sm">{faq.q}</span>
                                    <span className={`text-[#e46a33] transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>▼</span>
                                </button>
                                {openFaq === i && (
                                    <div className="px-6 pb-5 border-t border-[#e9e9e9]">
                                        <p className="text-[#8c8b8b] text-sm leading-relaxed pt-4">{faq.r}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA FINAL */}
                <div className="relative rounded-2xl overflow-hidden border border-[#e9e9e9] p-12 text-center"
                    style={{ background: 'linear-gradient(135deg, #0f0a1a, #1a0a2e, #0f0a1a)' }}>
                    <h2 className="section-title mb-4">
                        Prêt à développer votre business ?
                    </h2>
                    <p className="text-[#8c8b8b] mb-8 max-w-xl mx-auto">
                        Rejoignez 500+ fournisseurs qui font confiance à MachiNet pour trouver leurs clients.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/register?role=seller" className="btn-primary text-base px-10 py-4">
                            Créer mon profil fournisseur
                        </Link>
                        <Link href="/contact" className="btn-outline text-base px-10 py-4">
                            Parler à un expert
                        </Link>
                    </div>
                    <p className="text-[#434042] text-sm mt-6">
                        Approbation requise · Badge vérifié · Support en français
                    </p>
                </div>

            </div>
            </div>
        </div>
    )
}