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
    const users = db.prepare(
      `SELECT id, email, name, role, company, wilaya, phone, sector, createdAt
       FROM User
       WHERE approved = 0 AND role IN ('seller', 'consultant')
       ORDER BY createdAt DESC`
    ).all()
    db.close()

    return NextResponse.json({ users: users || [] })
  } catch (error) {
    console.error('Pending error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
