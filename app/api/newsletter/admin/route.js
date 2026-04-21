import { NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'
import { getSession } from '@/lib/auth'

function getDb() {
  const db = new Database(path.join(process.cwd(), 'prisma', 'dev.db'))
  db.prepare(`
    CREATE TABLE IF NOT EXISTS Newsletter (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      createdAt TEXT NOT NULL
    )
  `).run()
  return db
}

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    const db = getDb()
    const subscribers = db.prepare('SELECT * FROM Newsletter ORDER BY createdAt DESC').all()
    db.close()
    return NextResponse.json({ subscribers })
  } catch (error) {
    console.error('Newsletter admin GET error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
