import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-[#e9e9e9] bg-[#f9f9f8] mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <img src="/images/logo.png" alt="MachiNet" className="h-8 w-auto" />
              <span className="logo-text text-xl">
                <span className="text-[#141313]">MACHI</span><span style={{color:'#e46a33'}}>NET</span>
              </span>
            </div>
            <p className="text-[#8c8b8b] text-sm leading-relaxed mb-5">
              La plateforme B2B dédiée aux machines industrielles en Algérie.
            </p>
            <div className="flex gap-2">
              {[
                { href: 'https://linkedin.com', icon: 'in' },
                { href: 'https://facebook.com', icon: 'f' },
                { href: 'https://wa.me/213659132072', icon: 'wa' },
              ].map(s => (
                <a key={s.icon} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white border border-[#e9e9e9] flex items-center justify-center text-[#434042] hover:text-[#e46a33] hover:border-[#e46a33] transition-all text-xs font-bold uppercase">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Plateforme */}
          <div>
            <h4 className="text-[#141313] font-semibold mb-4 text-sm">Plateforme</h4>
            <ul className="space-y-2">
              {[
                ['/catalogue', 'Catalogue machines'],
                ['/marche', 'Marché & prix'],
                ['/ia-bots', 'IA & MachiBot'],
                ['/tarifs', 'Nos tarifs'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-[#8c8b8b] hover:text-[#141313] text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-[#141313] font-semibold mb-4 text-sm">Solutions</h4>
            <ul className="space-y-2">
              {[
                ['/acheteurs', 'Pour les acheteurs'],
                ['/vendeurs', 'Pour les vendeurs'],
                ['/experts', 'Services Experts'],
                ['/about', 'À propos'],
                ['/guides', 'Guides & Ressources'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-[#8c8b8b] hover:text-[#141313] text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#141313] font-semibold mb-4 text-sm">Contact</h4>
            <ul className="space-y-2 text-[#8c8b8b] text-sm">
              <li>machinet60@gmail.com</li>
              <li>+213 659 132 072</li>
              <li>Algérie</li>
            </ul>
            <div className="mt-5">
              <p className="text-[#8c8b8b] text-xs mb-2">Newsletter</p>
              <div className="flex gap-2">
                <input type="email" placeholder="votre@email.com" className="input-dark text-xs py-2 px-3 h-9 flex-1" />
                <button className="btn-primary text-xs py-2 px-3 h-9 rounded-md whitespace-nowrap">S'abonner</button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#e9e9e9] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#8c8b8b] text-xs">© 2026 MachiNet. Tous droits réservés. Algérie</p>
          <div className="flex gap-5">
            <Link href="/mentions-legales" className="text-[#8c8b8b] hover:text-[#141313] text-xs transition-colors">Mentions légales</Link>
            <Link href="/confidentialite" className="text-[#8c8b8b] hover:text-[#141313] text-xs transition-colors">Confidentialité</Link>
            <Link href="/cgu" className="text-[#8c8b8b] hover:text-[#141313] text-xs transition-colors">CGU</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
