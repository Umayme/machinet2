import { NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'
import { randomBytes } from 'crypto'
import { getSession } from '@/lib/auth'

function getDb() {
  const db = new Database(path.join(process.cwd(), 'prisma', 'dev.db'))
  db.prepare(`
    CREATE TABLE IF NOT EXISTS TeamMember (
      id TEXT PRIMARY KEY,
      nom TEXT NOT NULL,
      titre TEXT NOT NULL,
      bio TEXT,
      wilaya TEXT,
      avatar TEXT,
      ordre INTEGER NOT NULL DEFAULT 0,
      active INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL
    )
  `).run()
  return db
}

export async function GET() {
  try {
    const db = getDb()
    const members = db.prepare('SELECT * FROM TeamMember WHERE active = 1 ORDER BY ordre ASC').all()
    db.close()
    return NextResponse.json({ members })
  } catch (error) {
    console.error('Team GET error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    const { nom, titre, bio, wilaya, avatar, ordre, active } = await request.json()
    if (!nom || !titre) return NextResponse.json({ error: 'Nom et titre requis' }, { status: 400 })
    const id = 't' + randomBytes(12).toString('hex')
    const db = getDb()
    db.prepare('INSERT INTO TeamMember (id, nom, titre, bio, wilaya, avatar, ordre, active, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
      id, nom, titre, bio || '', wilaya || '', avatar || null, ordre ?? 0, active !== false ? 1 : 0, new Date().toISOString()
    )
    db.close()
    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Team POST error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    const { id, nom, titre, bio, wilaya, avatar, ordre, active } = await request.json()
    const db = getDb()
    db.prepare('UPDATE TeamMember SET nom=?, titre=?, bio=?, wilaya=?, avatar=?, ordre=?, active=? WHERE id=?').run(
      nom, titre, bio || '', wilaya || '', avatar || null, ordre ?? 0, active ? 1 : 0, id
    )
    db.close()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Team PATCH error:', error)
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
    db.prepare('DELETE FROM TeamMember WHERE id = ?').run(id)
    db.close()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Team DELETE error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
