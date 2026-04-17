import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import Database from 'better-sqlite3'
import path from 'path'

function getDb() { return new Database(path.join(process.cwd(), 'prisma', 'dev.db')) }

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'seller') return NextResponse.json({ error: 'Accès interdit' }, { status: 403 })
    const db = getDb()
    const user = db.prepare('SELECT approved FROM User WHERE id = ?').get(session.id)
    if (!user || !user.approved) { db.close(); return NextResponse.json({ error: 'Compte non approuvé' }, { status: 403 }) }
    const contacts = db.prepare(`
      SELECT c.id, c.name, c.email, c.phone, c.message, c.status, c.createdAt,
             m.name as machineName, m.id as machineId
      FROM Contact c JOIN Machine m ON m.id = c.machineId
      WHERE m.sellerId = ? ORDER BY c.createdAt DESC
    `).all(session.id)
    db.close()
    return NextResponse.json({ contacts: contacts || [] })
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}
