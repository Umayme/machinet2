'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const suggestionsInitiales = [
    "Quelle machine pour une laiterie 500L/jour ?",
    "Quel tracteur pour 50 hectares de céréales ?",
    "Budget pelle hydraulique pour chantier BTP ?",
    "Machine emballage sachets plastique ?",
    "Différence entre neuf et occasion pour IAA ?",
]

const reponsesAuto = [
    {
        keywords: ['laiterie', 'yaourt', 'lait', 'dairy'],
        reponse: `Pour une laiterie de 500L/jour, voici mes recommandations :

**Équipements essentiels :**
- Pasteurisateur 500–1000L/h : 800 000 – 1 500 000 DZD
- Tank de stockage inox 1000L : 350 000 – 600 000 DZD  
- Ligne conditionnement yaourt : 2 500 000 – 5 000 000 DZD
- Chambre froide 20m² : 600 000 – 1 200 000 DZD

**Conseil :** Pour démarrer, privilégiez le pasteurisateur + tank de stockage en premier. Budget minimum recommandé : 4–6M DZD pour une ligne complète opérationnelle.

Voulez-vous que je vous mette en contact avec des fournisseurs vérifiés pour ces équipements ?`
    },
    {
        keywords: ['tracteur', 'agricole', 'hectare', 'céréale'],
        reponse: `Pour 50 hectares de céréales, voici ce que je recommande :

**Tracteur adapté :**
- Puissance recommandée : 75–100 CV
- Modèles courants en Algérie : John Deere 5075E, New Holland T4, Massey Ferguson 5711
- Prix neuf : 2 500 000 – 4 500 000 DZD
- Prix occasion (-3 ans) : 1 500 000 – 2 800 000 DZD

**Équipements complémentaires :**
- Charrue 3 socs : 280 000 – 450 000 DZD
- Semoir céréales : 350 000 – 700 000 DZD

**Conseil :** Pour 50 ha, un tracteur 75CV est suffisant. Optez pour une occasion récente (<3 ans) pour économiser 40% sur le budget.`
    },
    {
        keywords: ['pelle', 'excavateur', 'btp', 'chantier'],
        reponse: `Pour une pelle hydraulique BTP, voici les fourchettes de prix en Algérie :

**Par catégorie :**
- Mini-pelle 3–6T : 3 500 000 – 6 000 000 DZD
- Pelle 13–20T (standard) : 8 000 000 – 15 000 000 DZD
- Grande pelle 25–35T : 18 000 000 – 35 000 000 DZD

**Marques disponibles en Algérie :**
Caterpillar, Komatsu, Volvo, Hyundai, XCMG (Chine)

**Conseil :** Pour un usage chantier standard, la pelle 13–20T est la plus polyvalente. XCMG offre le meilleur rapport qualité/prix pour les budgets serrés.

Quel est votre budget approximatif ?`
    },
]

export default function AdvisorPage() {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: `Bonjour ! Je suis l'IA Advisor de MachiNet.

Je suis spécialisé dans les machines industrielles en Algérie. Je peux vous aider à :
- Trouver la machine adaptée à votre activité
- Estimer les prix du marché algérien
- Comparer neuf vs occasion
- Identifier les bons fournisseurs

**Posez-moi votre question en français ou en arabe !**`
        }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const getReponse = (question) => {
        const q = question.toLowerCase()
        for (const r of reponsesAuto) {
            if (r.keywords.some(k => q.includes(k))) {
                return r.reponse
            }
        }
        return `Merci pour votre question sur **"${question}"**.

Je recherche les informations dans notre base de données algérienne...

**Ce que je peux vous dire :**
- Ce type de machine est disponible chez plusieurs fournisseurs vérifiés sur MachiNet
- Les prix varient selon la marque, la capacité et l'état (neuf/occasion)
- Des fournisseurs sont disponibles dans votre région

**Recommandation :**
Consultez notre catalogue avec ce terme de recherche, ou contactez notre équipe pour un conseil personnalisé.

Voulez-vous que je vous aide à affiner votre recherche ?`
    }

    const sendMessage = async (text) => {
        const question = text || input
        if (!question.trim()) return

        setMessages(prev => [...prev, { role: 'user', content: question }])
        setInput('')
        setLoading(true)

        await new Promise(r => setTimeout(r, 1200))

        const reponse = getReponse(question)
        setMessages(prev => [...prev, { role: 'assistant', content: reponse }])
        setLoading(false)
    }

    const formatMessage = (text) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br/>')
    }

    return (
        <div className="min-h-screen flex flex-col">

            {/* HERO — dark band */}
            <div className="bg-[#141313] pt-20 pb-10">
              <div className="max-w-4xl mx-auto w-full px-6 text-center">
                <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-6 py-3 mb-5">
                    <div className="w-8 h-8 rounded-xl bg-[#e46a33] flex items-center justify-center"><span className="text-white font-black text-xs">AI</span></div>
                    <div className="text-left">
                        <p className="text-white font-bold text-sm">IA Advisor MachiNet</p>
                        <p className="text-green-400 text-xs">● En ligne — Répond en quelques secondes</p>
                    </div>
                </div>
                <h1 className="hero-title text-white mb-2">Votre conseiller<br/><span style={{color:'#e46a33'}}>machines IA</span></h1>
                <p className="text-[#8c8b8b] text-lg">Spécialisé dans le marché algérien · Sans inscription</p>
              </div>
            </div>

            <div className="max-w-4xl mx-auto w-full px-6 flex flex-col flex-1 py-8">

                {/* CHAT BOX */}
                <div className="card flex flex-col flex-1" style={{ minHeight: '500px' }}>

                    {/* MESSAGES */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: '500px' }}>
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-5 py-4 ${msg.role === 'user'
                                        ? 'bg-[#e46a33] text-white rounded-br-none'
                                        : 'bg-white/5 border border-[#e9e9e9] text-gray-200 rounded-bl-none'
                                    }`}>
                                    {msg.role === 'assistant' && (
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[#e46a33] text-xs font-black">AI</span>
                                            <span className="text-[#e46a33] text-xs font-semibold">IA Advisor</span>
                                        </div>
                                    )}
                                    <div
                                        className="text-sm leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                                    />
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 border border-[#e9e9e9] rounded-2xl rounded-bl-none px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#e46a33] text-xs font-black">AI</span>
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-[#e46a33] rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-[#e46a33] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-[#e46a33] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* SUGGESTIONS */}
                    {messages.length === 1 && (
                        <div className="px-6 pb-4">
                            <p className="text-[#434042] text-xs mb-3">Suggestions :</p>
                            <div className="flex flex-wrap gap-2">
                                {suggestionsInitiales.map((s, i) => (
                                    <button
                                        key={i}
                                        onClick={() => sendMessage(s)}
                                        className="px-3 py-2 bg-[#f9f9f8] border border-[#e9e9e9] rounded-lg text-[#8c8b8b] hover:text-[#e46a33] hover:border-[#e9e9e9] text-xs transition-all"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* INPUT */}
                    <div className="p-4 border-t border-[#e9e9e9]">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="Posez votre question en français ou en arabe..."
                                className="input-dark flex-1"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            />
                            <button
                                onClick={() => sendMessage()}
                                disabled={loading || !input.trim()}
                                className="btn-primary px-6 py-3 disabled:opacity-50"
                            >
                                Envoyer →
                            </button>
                        </div>
                        <p className="text-[#8c8b8b] text-xs mt-2 text-center">
                            IA basée sur les données du marché algérien · Pour un conseil expert:{' '}
                            <Link href="/contact" className="text-[#e46a33] hover:text-[#e46a33]">contactez notre équipe</Link>
                        </p>