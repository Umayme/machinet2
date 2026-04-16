import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Use raw SQL to get approved field + machine count
    const users = await prisma.$queryRawUnsafe(`
      SELECT u.id, u.email, u.name, u.company, u.wilaya, u.role,
             u.approved, u.approvedAt, u.phone, u.sector, u.createdAt,
             COUNT(m.id) as machineCount
      FROM User u
      LEFT JOIN Machine m ON m.sellerId = u.id
      GROUP BY u.id
      ORDER BY u.createdAt DESC
    `)

    // Normalize data
    const normalized = (users || []).map(u => ({
      ...u,
      approved: Boolean(u.approved),
      _count: { machines: Number(u.machineCount || 0) },
    }))

    return NextResponse.json({ users: normalized })
  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
