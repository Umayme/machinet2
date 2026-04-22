'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const botResponses = {
  default: "Je suis MachiBot, votre conseiller en machines industrielles algériennes. Posez-moi une question sur :\n- **Quel type de machine acheter** pour votre activité\n- **Les prix du marché** en Algérie\n- **Comment vendre** vos machines\n- **Les démarches d'importation**",
  keywords: {
    laiterie: "Pour une **laiterie** ou unité de production laitière, voici ce que je recommande :\n\n**Machines essentielles :**\n• Pasteurisateur HTST (72°C, 15 sec) — 800K à 2,2M DZD\n• Tank de stockage inox 2000-5000L — 400K à 1,2M DZD\n• Homogénéisateur — 600K à 1,5M DZD\n• Ligne de conditionnement — 2M à 5M DZD\n\n**Budget estimé :** 4M à 12M DZD selon la capacité\n\nVoulez-vous que je vous montre des vendeurs disponibles ?",
    yaourt: "Pour une **unité de production de yaourt**, voici les équipements clés :\n\n• Cuve de fermentation inox — 300K à 800K DZD\n• Ligne de conditionnement yaourt — 2M à 6M DZD\n• Chambre de fermentation — 500K à 1,5M DZD\n• Système CIP (nettoyage) — 400K à 900K DZD\n\n**Conseil :** Privilégiez les équipements avec SAV en Algérie.",
    tracteur: "Pour un **tracteur agricole** en Algérie :\n\n**Par puissance et usage :**\n• 45-65CV : maraîchage, vergers — 1,5M à 2,5M DZD\n• 75-100CV : céréales, polyculture — 2,1M à 4M DZD\n• 120-180CV : grandes surfaces — 4,5M à 9M DZD\n\n**Marques disponibles :** John Deere, New Holland, Massey Ferguson, Deutz-Fahr\n\n**Occasion vs Neuf :** L'occasion (<2000h) peut vous faire économiser 30-40%.",
    pelle: "Pour une **pelle hydraulique** :\n\n**Par tonnage :**\n• Mini-pelle (1,5-6T) : travaux urbains — 2,5M à 5M DZD\n• Pelle 13-16T : polyvalente — 6M à 10M DZD\n• Pelle 20-25T : grands chantiers — 8,5M à 14M DZD\n• Pelle 30-50T : mines, projets majeurs — 18M à 35M DZD\n\n**Top marques :** Caterpillar, Komatsu, Volvo, Hyundai\n\nLocation disponible à partir de 150 000 DZD/mois.",
    grue: "Pour une **grue** en Algérie :\n\n• Grue mobile 25-35T : 12M à 22M DZD (location: 80K-120K DZD/jour)\n• Grue mobile 50T : 20M à 35M DZD\n• Grue à tour 6-8T portée 50m : 8M à 15M DZD\n\n**Recommandation :** Pour un projet <6 mois, préférez la location.",
    prix: "Voici les **fourchettes de prix actuelles** sur le marché algérien :\n\n• Pelle 20T : 8,5M – 14M DZD\n• Tracteur 75CV : 2,1M – 4M DZD\n• Ligne IAA standard : 3M – 8M DZD\n• Pasteurisateur 1000L/h : 800K – 2,2M DZD\n\nConsultez notre page [Marché](/marche) pour tous les prix.",
    import: "Pour **importer une machine** en Algérie :\n\n**Documents requis :**\n• Registre de commerce\n• Carte fiscale (NIF)\n• Attestation bancaire\n• Proforma du fournisseur étranger\n\n**Droits de douane :** Variables selon la nomenclature douanière (DA/AT/TVA)\n\n**Conseil :** Faites appel à nos experts en [Consulting](/consulting) pour un accompagnement complet.",
    vendre: "Pour **vendre vos machines** sur MachiNet :\n\n**Étapes :**\n1. Créez votre compte vendeur\n2. Publiez vos annonces avec photos et specs\n3. Recevez des demandes d'acheteurs qualifiés\n4. Gérez vos leads depuis votre dashboard\n\n**Plans disponibles :**\n• Starter : 3 annonces\n• Pro (15K DZD/mois) : illimité + badge vérifié\n\nCommencez sur [/register](/register?role=seller)",
    budget: "Pour définir votre **budget d'investissement** en machines :\n\n**Règle générale :**\n• ROI attendu en 18-36 mois pour machines productives\n• Prévoir 15-20% pour installation, formation, SAV\n• Budget import : ajouter 25-35% (transport + douane + transit)\n\nUtilisez notre [calculateur ROI](/guides) pour une estimation précise.",
  }
}

function getBotResponse(input) {
  const lower = input.toLowerCase()
  for (const [key, response] of Object.entries(botResponses.keywords)) {
    if (lower.includes(key)) return response
  }
  if (lower.includes('bonjour') || lower.includes('salam') || lower.includes('hello')) {
    return "Bonjour ! Je suis **MachiBot**, votre assistant IA pour les machines industrielles en Algérie.\n\nJe peux vous aider à :\n• Trouver la machine adaptée à votre activité\n• Connaître les prix du marché\n• Comprendre les démarches d'achat/import\n• Contacter les bons vendeurs\n\nQue cherchez-vous ?"
  }
  return `Je comprends votre question sur "${input}".\n\nPour vous aider au mieux, pourriez-vous me préciser :\n• **Votre secteur d'activité** (IAA, BTP, Agricole...)\n• **Votre budget approximatif**\n• **Votre wilaya**\n\nOu consultez directement notre [catalogue](/catalogue) ou nos [guides](/guides).`
}

const suggestions = [
  "Quelle machine pour une laiterie ?",
  "Prix d'un tracteur 75CV en Algérie",
  "Comment importer une machine ?",
  "Je veux vendre mes machines",
  "Prix d'une pelle hydraulique 20T",
  "Budget pour une unité IAA",
]

const fonctionnalites = [
  { icon: 'IA', titre: 'IA Recommandations', desc: 'Analyse votre activité et recommande les machines les mieux adaptées à votre budget.' },
  { icon: 'Prix', titre: 'Estimation de prix', desc: 'Prix du marché algérien en temps réel. Évitez les surprises et négociez mieux.' },
  { icon: 'Match', titre: 'Matching vendeurs', desc: 'Identifie les vendeurs les plus proches et les mieux adaptés à vos besoins.' },
  { icon: 'Specs', titre: 'Specs techniques', desc: 'Explique les spécifications techniques pour vous aider à faire le bon choix.' },
  { icon: 'Import', titre: 'Guide import', desc: 'Accompagne les démarches d\'importation de machines depuis l\'étranger.' },
  { icon: 'ROI', titre: 'Analyse ROI', desc: 'Calcule le retour sur investissement estimé pour chaque machine envisagée.' },
]

export default function IABotsPage() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: botResponses.default, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const sendMessage = async (text) => {
    const userText = text || input.trim()
    if (!userText) return

    setInput('')
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => [...prev, { role: 'user', text: userText, time }])
    setLoading(true)

    await new Promise(r => setTimeout(r, 800 + Math.random() * 600))

    const response = getBotResponse(userText)
    setLoading(false)
    setMessages(prev => [...prev, {
      role: 'bot',
      text: response,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }])
  }

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-purple-300">$1</strong>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-purple-400 hover:text-purple-300 underline">$1</a>')
      .replace(/\n/g, '<br/>')
      .replace(/^• /gm, '&bull; ')
  }

  return (
    <div className="min-h-screen pt-20">

      {/* HERO */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="mb-4 inline-block"><div className="w-16 h-16 rounded-xl bg-purple-700/30 border border-purple-600/40 flex items-center justify-center mx-auto"><span className="text-purple-300 font-black text-lg">AI</span></div></div>
          <h1 className="section-title text-5xl mb-4">MachiBot — Votre IA industrielle</h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            Posez vos questions sur les machines, prix et démarches en Algérie.
            Réponse instantanée, 24h/24.
          </p>
        </div>

        {/* CHAT DEMO */}
        <div className="max-w-3xl mx-auto">
          <div className="card overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-purple-900/30 flex items-center gap-3"
              style={{ background: 'linear-gradient(135deg, #0f0a1a, #1a0a2e)' }}>
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-purple-700/30 border border-purple-600/40 flex items-center justify-center"><span className="text-purple-300 font-black text-sm">AI</span></div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-black"></span>
              </div>
              <div>
                <p className="text-white font-bold">MachiBot</p>
                <p className="text-green-400 text-xs">En ligne · Répond instantanément</p>
              </div>
              <div className="ml-auto flex gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
                  {msg.role === 'bot' && (
                    <div className="w-8 h-8 rounded-xl bg-purple-700/30 border border-purple-600/40 flex items-center justify-center flex-shrink-0 mt-1"><span className="text-purple-300 font-black text-xs">AI</span></div>
                  )}
                  <div className={`max-w-[80%] ${msg.role === 'user'
                    ? 'bg-purple-700 text-white rounded-2xl rounded-tr-sm'
                    : 'bg-white/5 border border-purple-900/30 rounded-2xl rounded-tl-sm'} px-4 py-3`}>
                    <div className="text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />
                    <p className="text-xs text-gray-500 mt-2">{msg.time}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-700/30 border border-purple-600/40 flex items-center justify-center flex-shrink-0"><span className="text-purple-300 font-black text-xs">AI</span></div>
                  <div className="bg-white/5 border border-purple-900/30 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            <div className="px-6 py-3 border-t border-purple-900/20 overflow-x-auto">
              <div className="flex gap-2 flex-nowrap">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s)}
                    className="px-3 py-1.5 bg-purple-900/20 border border-purple-700/30 rounded-full text-purple-300 text-xs whitespace-nowrap hover:bg-purple-700/30 transition-all flex-shrink-0">
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="px-6 py-4 border-t border-purple-900/30">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Posez votre question à MachiBot..."
                  className="input-dark flex-1 h-12"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="btn-primary px-5 h-12 disabled:opacity-50 disabled:cursor-not-allowed">
                  Envoyer
                </button>
              </div>
            </div>
          </div>
          <p className="text-center text-gray-600 text-xs mt-3">
            MachiBot est un assistant IA à titre indicatif. Pour des conseils personnalisés, consultez notre équipe d'<Link href="/consulting" className="text-purple-400 hover:underline">experts</Link>.
          </p>
        </div>
      </section>

      {/* FONCTIONNALITÉS */}
      <section className="py-20 bg-gradient-to-b from-black via-purple-950/5 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Ce que MachiBot peut faire pour vous</h2>
            <p className="section-subtitle">Un expert industriel disponible 24h/24</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fonctionnalites.map((f, i) => (
              <div key={i} className="card p-6">
                <div className="w-10 h-10 rounded-xl bg-purple-700/30 border border-purple-600/40 flex items-center justify-center mb-3"><span className="text-purple-300 font-black text-xs">{f.icon}</span></div>
                <h3 className="text-white font-bold mb-2">{f.titre}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA CONSULTING */}
      <section className="py-20 max-w-4xl mx-auto px-6 text-center">
        <div className="card p-12">
          <h2 className="text-3xl font-black text-white mb-4">Besoin d'un expert humain ?</h2>
          <p className="text-gray-400 mb-8">Pour des projets complexes, nos consultants industriels vous accompagnent de A à Z.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/consulting" className="btn-primary">Consulter un expert</Link>
            <Link href="/catalogue" className="btn-outline">Voir le catalogue</Link>
          </div>
        </div>
      </section>

    </div>
  )
}
