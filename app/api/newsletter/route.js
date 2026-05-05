import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendNewsletterWelcome } from '@/lib/email'

export async function POST(request) {
  try {
    const { email } = await request.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    try {
      await prisma.newsletter.create({ data: { email } })
    } catch (e) {
      if (e.code === 'P2002') return NextResponse.json({ error: 'Cet email est déjà inscrit' }, { status: 409 })
      throw e
    }
    try { await sendNewsletterWelcome({ email }) } catch {}
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Not allowed' }, { status: 405 })
}
