import { NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'
import { randomBytes } from 'crypto'
import { getSession } from '@/lib/auth'

function getDb() {
  const db = new Database(path.join(process.cwd(), 'prisma', 'dev.db'))
  db.prepare(`
    CREATE TABLE IF NOT EXISTS FAQ (
      id TEXT PRIMARY KEY,
      question TEXT NOT NULL,
      reponse TEXT NOT NULL,
      page TEXT NOT NULL,
      ordre INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL
    )
  `).run()
  return db
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')
    const adminMode = searchParams.get('admin') === '1'
    const session = await getSession()

    const db = getDb()

    if (adminMode) {
      if (!session || session.role !== 'admin') {
        db.close()
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
      }
      const faqs = db.prepare('SELECT * FROM FAQ ORDER BY page, ordre ASC').all()
      db.close()
      return NextResponse.json({ faqs })
    }

    let query = 'SELECT * FROM FAQ WHERE active = 1'
    const params = []
    if (page) { query += ' AND page = ?'; params.push(page) }
    query += ' ORDER BY ordre ASC'
    const faqs = db.prepare(query).all(...params)
    db.close()
    return NextResponse.json({ faqs })
  } catch (error) {
    console.error('FAQ GET error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    const { question, reponse, page, ordre, active } = await request.json()
    if (!question || !reponse || !page) {
      return NextResponse.json({ error: 'Question, réponse et page requis' }, { status: 400 })
    }
    const id = 'faq' + randomBytes(12).toString('hex')
    const db = getDb()
    db.prepare('INSERT INTO FAQ (id, question, reponse, page, ordre, active, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
      id, question, reponse, page, ordre ?? 0, active !== false ? 1 : 0, new Date().toISOString()
    )
    db.close()
    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('FAQ POST error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    const { id, question, reponse, page, ordre, active } = await request.json()
    const db = getDb()
    db.prepare('UPDATE FAQ SET question=?, reponse=?, page=?, ordre=?, active=? WHERE id=?').run(
      question, reponse, page, ordre ?? 0, active ? 1 : 0, id
    )
    db.close()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('FAQ PATCH error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    const { id } = await request.json()
    const db = getDb()
    db.prepare('DELETE FROM FAQ WHERE id = ?').run(id)
    db.close()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('FAQ DELETE error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
