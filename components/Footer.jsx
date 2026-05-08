import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-[#e9e9e9] bg-[#f9f9f8] mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <img src="/images/logobo.png" alt="MachiNet" className="h-10 w-auto" />
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
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-[#8c8b8b]">
                <svg className="w-4 h-4 text-[#e46a33] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <a href="mailto:machinetdz@gmail.com" className="hover:text-[#e46a33] transition-colors">machinetdz@gmail.com</a>
              </li>
              <li className="flex items-center gap-2 text-[#8c8b8b]">
                <svg className="w-4 h-4 text-[#25D366] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <a href="https://wa.me/213659132072" target="_blank" rel="noopener noreferrer" className="hover:text-[#e46a33] transition-colors">+213 659 132 072</a>
              </li>
              <li className="flex items-center gap-2 text-[#8c8b8b]">
                <svg className="w-4 h-4 text-[#e46a33] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>Imama, Tlemcen — Algérie</span>
              </li>
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
