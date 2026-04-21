import { NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'
import { randomBytes } from 'crypto'
import { getSession } from '@/lib/auth'

function getDb() {
  const db = new Database(path.join(process.cwd(), 'prisma', 'dev.db'))
  db.prepare(`
    CREATE TABLE IF NOT EXISTS PrixMarche (
      id TEXT PRIMARY KEY,
      secteur TEXT NOT NULL,
      nom TEXT NOT NULL,
      min TEXT NOT NULL,
      max TEXT NOT NULL,
      tendance TEXT NOT NULL DEFAULT '→',
      pct TEXT NOT NULL DEFAULT 'stable',
      updatedAt TEXT NOT NULL
    )
  `).run()
  return db
}

export async function GET() {
  try {
    const db = getDb()
    const rows = db.prepare('SELECT * FROM PrixMarche ORDER BY secteur, nom ASC').all()
    db.close()
    // Group by secteur
    const grouped = {}
    for (const row of rows) {
      if (!grouped[row.secteur]) grouped[row.secteur] = []
      grouped[row.secteur].push(row)
    }
    const result = Object.entries(grouped).map(([secteur, machines]) => ({ secteur, machines }))
    return NextResponse.json({ data: result, count: rows.length })
  } catch (error) {
    console.error('Prix GET error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    const { secteur, nom, min, max, tendance, pct } = await request.json()
    if (!secteur || !nom || !min || !max) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }
    const id = 'p' + randomBytes(12).toString('hex')
    const db = getDb()
    db.prepare('INSERT INTO PrixMarche (id, secteur, nom, min, max, tendance, pct, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
      id, secteur, nom, min, max, tendance || '→', pct || 'stable', new Date().toISOString()
    )
    db.close()
    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Prix POST error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    const { id, secteur, nom, min, max, tendance, pct } = await request.json()
    const db = getDb()
    db.prepare('UPDATE PrixMarche SET secteur=?, nom=?, min=?, max=?, tendance=?, pct=?, updatedAt=? WHERE id=?').run(
      secteur, nom, min, max, tendance || '→', pct || 'stable', new Date().toISOString(), id
    )
    db.close()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Prix PATCH error:', error)
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
    db.prepare('DELETE FROM PrixMarche WHERE id = ?').run(id)
    db.close()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Prix DELETE error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
