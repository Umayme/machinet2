import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const users = await prisma.user.findMany({
      include: { _count: { select: { machines: true } } },
      orderBy: { createdAt: 'desc' },
    })
    const normalized = users.map(({ password, ...u }) => u)
    return NextResponse.json({ users: normalized })
  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
