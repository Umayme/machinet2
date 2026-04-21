import { NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'
import { randomBytes } from 'crypto'
import { getSession } from '@/lib/auth'

function getDb() {
  const db = new Database(path.join(process.cwd(), 'prisma', 'dev.db'))
  db.prepare(`
    CREATE TABLE IF NOT EXISTS ConsultingPackage (
      id TEXT PRIMARY KEY,
      titre TEXT NOT NULL,
      prix TEXT NOT NULL,
      duree TEXT NOT NULL,
      desc TEXT,
      inclus TEXT,
      badge TEXT,
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
    const packages = db.prepare('SELECT * FROM ConsultingPackage WHERE active = 1 ORDER BY ordre ASC').all()
    db.close()
    return NextResponse.json({ packages: packages.map(p => ({ ...p, inclus: p.inclus ? JSON.parse(p.inclus) : [] })) })
  } catch (error) {
    console.error('Packages GET error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    const { titre, prix, duree, desc, inclus, badge, ordre, active } = await request.json()
    if (!titre || !prix) return NextResponse.json({ error: 'Titre et prix requis' }, { status: 400 })
    const id = 'cp' + randomBytes(12).toString('hex')
    const db = getDb()
    db.prepare('INSERT INTO ConsultingPackage (id, titre, prix, duree, desc, inclus, badge, ordre, active, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
      id, titre, prix, duree || '', desc || '', JSON.stringify(inclus || []), badge || null, ordre ?? 0, active !== false ? 1 : 0, new Date().toISOString()
    )
    db.close()
    return NextResponse.json({ success: true, id })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    const { id, titre, prix, duree, desc, inclus, badge, ordre, active } = await request.json()
    const db = getDb()
    db.prepare('UPDATE ConsultingPackage SET titre=?, prix=?, duree=?, desc=?, inclus=?, badge=?, ordre=?, active=? WHERE id=?').run(
      titre, prix, duree || '', desc || '', JSON.stringify(inclus || []), badge || null, ordre ?? 0, active ? 1 : 0, id
    )
    db.close()
    return NextResponse.json({ success: true })
  } catch (error) {
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
    db.prepare('DELETE FROM ConsultingPackage WHERE id = ?').run(id)
    db.close()
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
