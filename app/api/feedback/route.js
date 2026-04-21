import { NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'
import { randomBytes } from 'crypto'
import { getSession } from '@/lib/auth'

function getDb() {
  const db = new Database(path.join(process.cwd(), 'prisma', 'dev.db'))
  db.prepare(`
    CREATE TABLE IF NOT EXISTS Feedback (
      id TEXT PRIMARY KEY,
      nom TEXT NOT NULL,
      poste TEXT,
      wilaya TEXT,
      note INTEGER NOT NULL,
      texte TEXT NOT NULL,
      approved INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL
    )
  `).run()
  return db
}

export async function GET(request) {
  try {
    const session = await getSession()
    const { searchParams } = new URL(request.url)
    const adminOnly = searchParams.get('admin') === '1'

    if (adminOnly) {
      if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
      }
      const db = getDb()
      const feedbacks = db.prepare('SELECT * FROM Feedback ORDER BY createdAt DESC').all()
      db.close()
      return NextResponse.json({ feedbacks })
    }

    const db = getDb()
    const feedbacks = db.prepare('SELECT * FROM Feedback WHERE approved = 1 ORDER BY createdAt DESC').all()
    db.close()
    return NextResponse.json({ feedbacks })
  } catch (error) {
    console.error('Feedback GET error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { nom, poste, wilaya, note, texte } = await request.json()
    if (!nom || !note || !texte) {
      return NextResponse.json({ error: 'Nom, note et avis sont requis' }, { status: 400 })
    }
    if (note < 1 || note > 5) {
      return NextResponse.json({ error: 'Note invalide' }, { status: 400 })
    }

    const id = 'f' + randomBytes(16).toString('hex')
    const db = getDb()
    db.prepare('INSERT INTO Feedback (id, nom, poste, wilaya, note, texte, approved, createdAt) VALUES (?, ?, ?, ?, ?, ?, 0, ?)').run(
      id, nom, poste || null, wilaya || null, note, texte, new Date().toISOString()
    )
    db.close()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feedback POST error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    const { id, approved } = await request.json()
    const db = getDb()
    db.prepare('UPDATE Feedback SET approved = ? WHERE id = ?').run(approved ? 1 : 0, id)
    db.close()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feedback PATCH error:', error)
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
    db.prepare('DELETE FROM Feedback WHERE id = ?').run(id)
    db.close()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feedback DELETE error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
