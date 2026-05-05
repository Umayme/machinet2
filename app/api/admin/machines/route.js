import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const machines = await prisma.machine.findMany({
      include: { seller: { select: { name: true, email: true, company: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ machines })
  } catch (error) {
    console.error('Admin machines error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
