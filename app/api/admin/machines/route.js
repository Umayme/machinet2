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
    const machines = db.prepare(`
      SELECT m.*, u.name as sellerName, u.email as sellerEmail, u.company as sellerCompany
      FROM Machine m
      LEFT JOIN User u ON u.id = m.sellerId
      ORDER BY m.createdAt DESC
    `).all()
    db.close()

    const formatted = machines.map(m => ({
      ...m,
      verified: Boolean(m.verified),
      active: Boolean(m.active),
      seller: { name: m.sellerName, email: m.sellerEmail, company: m.sellerCompany },
    }))

    return NextResponse.json({ machines: formatted })
  } catch (error) {
    console.error('Admin machines error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
