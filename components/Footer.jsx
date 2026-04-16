import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-purple-900/20 bg-black mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          <div>
            <div className="mb-4">
              <img src="/logo.svg" alt="MachiNet" className="h-8 w-auto" />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              La 1ère plateforme B2B intelligente dédiée aux machines industrielles en Algérie.
            </p>
            <div className="flex gap-3">
              {[['L', '#'], ['F', '#'], ['W', '#']].map(([s, href]) => (
                <a key={s} href={href} className="w-9 h-9 rounded-lg bg-purple-900/20 border border-purple-900/30 flex items-center justify-center text-gray-500 hover:text-purple-400 hover:border-purple-500/50 transition-all text-xs font-bold">
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Plateforme</h4>
            <ul className="space-y-2">
              {[
                ['/catalogue', 'Catalogue machines'],
                ['/marche', 'Marché & prix'],
                ['/ia-bots', 'IA & MachiBot'],
                ['/couverture', '58 wilayas'],
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
            <h4 className="text-white font-semibold mb-4 text-sm">Contact</h4>
            <ul className="space-y-3">
              <li className="text-gray-500 text-sm">machinetdz@gmail.com</li>
              <li className="text-gray-500 text-sm">+213 659 132 072</li>
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
