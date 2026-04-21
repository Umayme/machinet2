'use client'
import { useState } from 'react'
import Link from 'next/link'

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subStatus, setSubStatus] = useState('')

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) { setSubStatus('ok'); setEmail('') }
      else setSubStatus(data.error || 'Erreur')
    } catch { setSubStatus('Erreur réseau') }
  }

  return (
    <footer className="border-t border-purple-900/20 bg-black mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

          <div>
            <div className="mb-4">
              <span className="logo-text text-2xl"><span className="text-white">MACH</span><span className="text-purple-400">NET</span></span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              La plateforme B2B dédiée aux machines industrielles en Algérie.
            </p>
            <div className="flex gap-3">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-purple-900/20 border border-purple-900/30 flex items-center justify-center text-gray-500 hover:text-purple-400 hover:border-purple-500/50 transition-all">
                <LinkedInIcon />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-purple-900/20 border border-purple-900/30 flex items-center justify-center text-gray-500 hover:text-purple-400 hover:border-purple-500/50 transition-all">
                <FacebookIcon />
              </a>
              <a href="https://wa.me/213659132072" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-purple-900/20 border border-purple-900/30 flex items-center justify-center text-gray-500 hover:text-purple-400 hover:border-purple-500/50 transition-all">
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Plateforme</h4>
            <ul className="space-y-2">
              {[
                ['/catalogue', 'Catalogue machines'],
                ['/marche', 'Marché & prix'],
                ['/ia-bots', 'IA & MachiBot'],
                ['/couverture', '69 wilayas'],
                ['/tarifs', 'Nos tarifs'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-gray-500 hover:text-purple-400 text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Solutions</h4>
            <ul className="space-y-2">
              {[
                ['/acheteurs', 'Pour les acheteurs'],
                ['/vendeurs', 'Pour les vendeurs'],
                ['/consulting', 'Consulting industriel'],
                ['/about', 'À propos'],
                ['/guides', 'Guides & Ressources'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-gray-500 hover:text-purple-400 text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Newsletter</h4>
            <p className="text-gray-500 text-sm mb-3">Actualités marché & nouvelles machines</p>
            {subStatus === 'ok' ? (
              <p className="text-green-400 text-sm">Inscription confirmée !</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.com" className="input-dark h-9 text-sm" />
                <button type="submit" className="btn-primary text-sm py-2 justify-center">S'inscrire</button>
                {subStatus && subStatus !== 'ok' && <p className="text-red-400 text-xs">{subStatus}</p>}
              </form>
            )}
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:machinetdz@gmail.com" className="text-gray-500 hover:text-purple-400 text-sm transition-colors">
                  machinetdz@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+213659132072" className="text-gray-500 hover:text-purple-400 text-sm transition-colors">
                  +213 659 132 072
                </a>
              </li>
              <li className="text-gray-500 text-sm">Algérie</li>
            </ul>
            <div className="mt-6 p-3 rounded-lg bg-purple-900/10 border border-purple-900/20">
              <p className="text-gray-500 text-xs">Réponse sous 24h</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-purple-900/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">© 2026 MachiNet. Tous droits réservés. Algérie.</p>
          <div className="flex gap-6">
            {['Mentions légales', 'Confidentialité', 'CGU'].map(l => (
              <a key={l} href="#" className="text-gray-600 hover:text-purple-400 text-sm transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
