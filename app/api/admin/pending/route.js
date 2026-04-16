import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const users = await prisma.$queryRawUnsafe(
      `SELECT id, email, name, role, company, wilaya, phone, sector, createdAt
       FROM User
       WHERE approved = 0 AND role IN ('seller', 'consultant')
       ORDER BY createdAt DESC`
    )

    return NextResponse.json({ users: users || [] })
  } catch (error) {
    console.error('Pending error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
