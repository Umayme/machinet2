import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import Database from 'better-sqlite3'
import path from 'path'

function getDb() { return new Database(path.join(process.cwd(), 'prisma', 'dev.db')) }

export async function PUT(request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
    const { name, phone, company, wilaya, sector, avatar } = await request.json()
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: 'Nom trop court' }, { status: 400 })
    }
    const db = getDb()
    // Ensure avatar column exists
    try { db.prepare('ALTER TABLE User ADD COLUMN avatar TEXT').run() } catch {}
    db.prepare(`
      UPDATE User SET name=?, phone=?, company=?, wilaya=?, sector=?, avatar=? WHERE id=?
    `).run(name.trim(), phone || null, company || null, wilaya || null, sector || null, avatar || null, session.id)
    const user = db.prepare('SELECT id, email, name, role, approved, company, wilaya, phone, avatar FROM User WHERE id = ?').get(session.id)
    db.close()
    return NextResponse.json({ success: true, user: { ...user, approved: Boolean(user.approved) } })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
