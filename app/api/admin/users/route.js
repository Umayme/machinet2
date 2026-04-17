import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import Database from 'better-sqlite3'
import path from 'path'

function getDb() {
  return new Database(path.join(process.cwd(), 'prisma', 'dev.db'))
}

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const db = getDb()
    const users = db.prepare(`
      SELECT u.id, u.email, u.name, u.company, u.wilaya, u.role,
             u.approved, u.approvedAt, u.phone, u.sector, u.createdAt,
             COUNT(m.id) as machineCount
      FROM User u
      LEFT JOIN Machine m ON m.sellerId = u.id
      GROUP BY u.id
      ORDER BY u.createdAt DESC
    `).all()
    db.close()

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
