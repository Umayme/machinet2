import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const users = await prisma.user.findMany({
      where: { approved: false, role: { in: ['seller', 'consultant'] } },
      select: { id: true, email: true, name: true, role: true, company: true, wilaya: true, phone: true, sector: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ users })
  } catch (error) {
    console.error('Pending error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
