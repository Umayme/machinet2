'use client'
import { usePathname } from 'next/navigation'
import Footer from './Footer'

export default function ConditionalFooter() {
  const pathname = usePathname()
  if (
    pathname.startsWith('/machinetdz-admin-2026') ||
    pathname.startsWith('/consultant-dashboard') ||
    pathname.startsWith('/dashboard')
  ) return null
  return <Footer />
}
