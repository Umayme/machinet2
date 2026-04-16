import { NextResponse } from 'next/server'

// Paths that require an authenticated session (cookie presence).
// Full role + approval checks happen in each API route / page itself.
const PROTECTED_API_PREFIXES = [
  '/api/admin',
  '/api/seller',
  '/api/consultant',
]

const PROTECTED_PAGE_PREFIXES = [
  '/dashboard',
  '/consultant-dashboard',
  '/machinetdz-admin-2026',
  '/mon-compte',
]

export function middleware(request) {
  const { pathname } = request.nextUrl
  const hasToken = Boolean(request.cookies.get('auth_token')?.value)

  if (PROTECTED_API_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (!hasToken) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
  }

  if (PROTECTED_PAGE_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (!hasToken) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/admin/:path*',
    '/api/seller/:path*',
    '/api/consultant/:path*',
    '/dashboard/:path*',
    '/consultant-dashboard/:path*',
    '/machinetdz-admin-2026/:path*',
    '/mon-compte/:path*',
  ],
}
