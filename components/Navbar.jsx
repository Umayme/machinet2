'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navLinks = [
  { label: 'Marché', href: '/marche' },
  { label: 'Catalogue', href: '/catalogue' },
  { label: 'IA & Bots', href: '/ia-bots' },
  {
    label: 'Solutions',
    dropdown: [
      { href: '/acheteurs', label: 'Acheteurs', desc: 'Sourcer des machines' },
      { href: '/vendeurs', label: 'Vendeurs', desc: 'Publier votre catalogue' },
      { href: '/consulting', label: 'Consulting', desc: 'Conseil industriel' },
    ],
  },
  {
    label: 'Plateforme',
    dropdown: [
      { href: '/couverture', label: 'Couverture', desc: '69 wilayas couvertes' },
      { href: '/tarifs', label: 'Tarifs', desc: 'Plans et abonnements' },
      { href: '/about', label: 'À propos', desc: 'Notre équipe' },
    ],
  },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [user, setUser] = useState(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setOpenDropdown(null)
    setUserMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => setUser(d.user || null))
      .catch(() => setUser(null))
  }, [pathname])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/')
  }

  const dashboardLink = () => {
    if (!user) return '/login'
    if (user.role === 'seller') return '/dashboard'
    if (user.role === 'consultant') return '/consultant-dashboard'
    return '/catalogue'
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-md border-b border-purple-900/30' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link href="/" className="flex items-center group">
          <span className="logo-text text-3xl text-white group-hover:opacity-80 transition-opacity">MACHINET</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) =>
            link.dropdown ? (
              <div key={link.label} className="relative">
                <button
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-purple-900/20 rounded-lg transition-all duration-200 flex items-center gap-1"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                  onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                >
                  {link.label}
                  <svg className="w-3 h-3 text-gray-600 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {openDropdown === link.label && (
                  <div
                    className="absolute top-full left-0 mt-1 w-52 bg-black/95 border border-purple-900/40 rounded-xl p-2 shadow-xl shadow-purple-900/20"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {link.dropdown.map((item) => (
                      <Link key={item.href} href={item.href} className="block px-3 py-2.5 rounded-lg hover:bg-purple-900/20 group">
                        <p className="text-white text-sm font-medium group-hover:text-purple-300 transition-colors">{item.label}</p>
                        <p className="text-gray-600 text-xs mt-0.5">{item.desc}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={link.href} href={link.href}
                className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${pathname === link.href ? 'text-purple-300 bg-purple-900/20' : 'text-gray-400 hover:text-white hover:bg-purple-900/20'}`}>
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-900/20 border border-purple-800/30 hover:bg-purple-900/40 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-purple-700 flex items-center justify-center text-white font-bold text-xs">
                  {(user.name || 'U')[0].toUpperCase()}
                </div>
                <span className="text-white text-sm font-medium max-w-[100px] truncate">{user.name?.split(' ')[0]}</span>
                <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {userMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-black/95 border border-purple-900/40 rounded-xl p-2 shadow-xl z-50">
                  <div className="px-3 py-2 border-b border-purple-900/20 mb-1">
                    <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                    <p className="text-gray-600 text-xs truncate">{user.email}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                      user.role === 'seller' ? 'bg-purple-900/30 text-purple-400' :
                      user.role === 'consultant' ? 'bg-cyan-900/30 text-cyan-400' :
                      'bg-blue-900/30 text-blue-400'
                    }`}>{user.role}</span>
                  </div>
                  {(user.role === 'seller' || user.role === 'consultant') && (
                    <Link href={dashboardLink()} className="block px-3 py-2 rounded-lg hover:bg-purple-900/20 text-gray-300 text-sm hover:text-white transition-colors">
                      Mon dashboard
                    </Link>
                  )}
                  <Link href="/catalogue" className="block px-3 py-2 rounded-lg hover:bg-purple-900/20 text-gray-300 text-sm hover:text-white transition-colors">
                    Catalogue
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-900/20 text-red-500 text-sm transition-colors mt-1">
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">
                Connexion
              </Link>
              <Link href="/register" className="btn-primary text-sm py-2 px-5">
                Commencer gratuitement
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-gray-400 hover:text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/98 border-t border-purple-900/30 px-6 py-4">
          {navLinks.map((link) =>
            link.dropdown ? (
              <div key={link.label}>
                <p className="px-4 py-2 text-xs text-purple-500 uppercase tracking-wider font-semibold">{link.label}</p>
                {link.dropdown.map((item) => (
                  <Link key={item.href} href={item.href}
                    className="block px-4 py-2.5 text-gray-400 hover:text-white hover:bg-purple-900/20 rounded-lg transition-all ml-2">
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link key={link.href} href={link.href}
                className="block px-4 py-3 text-gray-400 hover:text-white hover:bg-purple-900/20 rounded-lg transition-all">
                {link.label}
              </Link>
            )
          )}
          <div className="pt-3 mt-2 border-t border-purple-900/20 space-y-2">
            {user ? (
              <>
                <div className="px-4 py-2">
                  <p className="text-white text-sm font-semibold">{user.name}</p>
                  <p className="text-gray-500 text-xs">{user.role} · {user.email}</p>
                </div>
                {(user.role === 'seller' || user.role === 'consultant') && (
                  <Link href={dashboardLink()} className="block px-4 py-2 text-purple-400 text-sm">Mon dashboard</Link>
                )}
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-500 text-sm">Déconnexion</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-center py-2 text-gray-400">Connexion</Link>
                <Link href="/register" className="btn-primary w-full text-center justify-center">Commencer gratuitement</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
