import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const subscribers = await prisma.newsletter.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ subscribers })
  } catch (error) {
    console.error('Newsletter admin GET error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
