import { NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'
import { sendNewsletterWelcome } from '@/lib/email'

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

export async function POST(request) {
  try {
    const { email } = await request.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    const db = getDb()
    try {
      db.prepare('INSERT INTO Newsletter (email, createdAt) VALUES (?, ?)').run(email, new Date().toISOString())
    } catch (e) {
      if (e.message.includes('UNIQUE')) {
        return NextResponse.json({ error: 'Cet email est déjà inscrit' }, { status: 409 })
      }
      throw e
    } finally {
      db.close()
    }

    try {
      await sendNewsletterWelcome({ email })
    } catch {}

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Not allowed' }, { status: 405 })
}
