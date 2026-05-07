'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Marché', href: '/marche' },
  { label: 'Catalogue', href: '/catalogue' },
  { label: 'IA & Bots', href: '/ia-bots' },
  {
    label: 'Solutions',
    dropdown: [
      { href: '/acheteurs', label: 'Acheteurs', desc: 'Sourcer des machines' },
      { href: '/vendeurs', label: 'Vendeurs', desc: 'Publier votre catalogue' },
      { href: '/experts', label: 'Experts', desc: 'Services industriels' },
    ],
  },
  { label: 'À propos', href: '/about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [user, setUser] = useState(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const isHero = pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
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
    if (user.role === 'consultant' || user.role === 'expert') return '/consultant-dashboard'
    return '/catalogue'
  }

  // On hero page before scroll: dark bg, white text. After scroll or non-hero: white bg, dark text
  const isDark = isHero && !scrolled
  const navBg = scrolled ? 'glass' : (isHero ? 'bg-[#141313]/30 backdrop-blur-sm' : 'bg-white border-b border-[#e9e9e9]')
  const textColor = isDark ? 'text-white/80 hover:text-white' : 'text-[#434042] hover:text-[#141313]'
  const activeColor = isDark ? 'text-white' : 'text-[#141313]'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 group">
          <img
            src="/images/logo.png"
            alt="MachiNet"
            className={`h-7 w-auto transition-opacity group-hover:opacity-80 ${isDark ? 'brightness-0 invert' : ''}`}
          />
          <span className="logo-text text-xl tracking-widest">
            <span className={isDark ? 'text-white' : 'text-[#141313]'}>MACHI</span><span style={{color:'#e46a33'}}>NET</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) =>
            link.dropdown ? (
              <div key={link.label} className="relative">
                <button
                  className={`px-3 py-2 text-sm rounded-md transition-all duration-200 flex items-center gap-1 ${textColor}`}
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                  onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                >
                  {link.label}
                  <svg className="w-3 h-3 opacity-50 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDropdown === link.label && (
                  <div
                    className="absolute top-full left-0 mt-1 w-52 bg-white border border-[#e9e9e9] rounded-xl p-2 shadow-lg shadow-black/8"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {link.dropdown.map((item) => (
                      <Link key={item.href} href={item.href} className="block px-3 py-2.5 rounded-lg hover:bg-[#f9f9f8] group">
                        <p className="text-[#141313] text-sm font-medium">{item.label}</p>
                        <p className="text-[#8c8b8b] text-xs mt-0.5">{item.desc}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={link.href} href={link.href}
                className={`px-3 py-2 text-sm rounded-md transition-all duration-200 ${pathname === link.href ? activeColor + ' font-semibold' : textColor}`}>
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
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                  isDark
                    ? 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
                    : 'bg-[#f9f9f8] border-[#e9e9e9] hover:border-[#8c8b8b] text-[#141313]'
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-[#e46a33] flex items-center justify-center text-white font-bold text-xs overflow-hidden">
                  {user.avatar
                    ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    : (user.name || 'U')[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium max-w-[100px] truncate">{user.name?.split(' ')[0]}</span>
                <svg className="w-3 h-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {userMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-[#e9e9e9] rounded-xl p-2 shadow-xl z-50">
                  <div className="px-3 py-2 border-b border-[#e9e9e9] mb-1">
                    <p className="text-[#141313] text-sm font-semibold truncate">{user.name}</p>
                    <p className="text-[#8c8b8b] text-xs truncate">{user.email}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block bg-[#f9f9f8] text-[#434042] border border-[#e9e9e9]">
                      {user.role === 'consultant' ? 'expert' : user.role}
                    </span>
                  </div>
                  {(user.role === 'seller' || user.role === 'consultant') && (
                    <Link href={dashboardLink()} className="block px-3 py-2 rounded-lg hover:bg-[#f9f9f8] text-[#434042] text-sm hover:text-[#141313] transition-colors">
                      Mon dashboard
                    </Link>
                  )}
                  <Link href="/catalogue" className="block px-3 py-2 rounded-lg hover:bg-[#f9f9f8] text-[#434042] text-sm hover:text-[#141313] transition-colors">
                    Catalogue
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-500 text-sm transition-colors mt-1">
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className={`text-sm transition-colors px-3 py-2 ${textColor}`}>
                Connexion
              </Link>
              <Link href="/register" className="btn-primary text-sm py-2 px-5">
                S'inscrire
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className={`md:hidden p-2 rounded-lg transition-colors ${isDark ? 'text-white hover:bg-white/10' : 'text-[#434042] hover:bg-[#f9f9f8]'}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <div className="space-y-1.5 w-5">
            <span className={`block w-full h-0.5 bg-current rounded transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-full h-0.5 bg-current rounded transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-full h-0.5 bg-current rounded transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#e9e9e9] px-4 py-3">
          {navLinks.map((link) =>
            link.dropdown ? (
              <div key={link.label}>
                <p className="px-3 py-1.5 text-xs text-[#8c8b8b] uppercase tracking-wider font-semibold mt-2">{link.label}</p>
                {link.dropdown.map((item) => (
                  <Link key={item.href} href={item.href}
                    className="block px-3 py-2.5 text-[#434042] hover:text-[#141313] hover:bg-[#f9f9f8] rounded-lg transition-all text-sm ml-2">
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link key={link.href} href={link.href}
                className={`block px-3 py-2.5 rounded-lg transition-all text-sm ${pathname === link.href ? 'text-[#141313] font-semibold bg-[#f9f9f8]' : 'text-[#434042] hover:text-[#141313] hover:bg-[#f9f9f8]'}`}>
                {link.label}
              </Link>
            )
          )}
          <div className="pt-3 mt-2 border-t border-[#e9e9e9] space-y-2">
            {user ? (
              <>
                <div className="px-3 py-2">
                  <p className="text-[#141313] text-sm font-semibold">{user.name}</p>
                  <p className="text-[#8c8b8b] text-xs">{user.role === 'consultant' ? 'expert' : user.role} · {user.email}</p>
                </div>
                {(user.role === 'seller' || user.role === 'consultant') && (
                  <Link href={dashboardLink()} className="block px-3 py-2 text-[#434042] text-sm rounded-lg hover:bg-[#f9f9f8]">Mon dashboard</Link>
                )}
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-red-500 text-sm">Déconnexion</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-center py-2.5 text-[#434042] text-sm">Connexion</Link>
                <Link href="/register" className="btn-primary w-full justify-center text-sm">S'inscrire</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
