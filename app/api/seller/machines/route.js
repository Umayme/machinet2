import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import Database from 'better-sqlite3'
import path from 'path'

function getDb() { return new Database(path.join(process.cwd(), 'prisma', 'dev.db')) }

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    if (session.role !== 'seller' && session.role !== 'admin') return NextResponse.json({ error: 'Accès interdit' }, { status: 403 })
    const db = getDb()
    const user = db.prepare('SELECT approved, role FROM User WHERE id = ?').get(session.id)
    if (!user || (!user.approved && user.role !== 'admin')) { db.close(); return NextResponse.json({ error: 'Compte non approuvé' }, { status: 403 }) }
    const machines = db.prepare(`
      SELECT m.*, COUNT(c.id) as contactCount FROM Machine m
      LEFT JOIN Contact c ON c.machineId = m.id
      WHERE m.sellerId = ? GROUP BY m.id ORDER BY m.createdAt DESC
    `).all(session.id)
    db.close()
    return NextResponse.json({ machines: machines.map(m => ({ ...m, verified: Boolean(m.verified), active: Boolean(m.active), contacts: Array(Number(m.contactCount||0)).fill({}) })) })
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}
