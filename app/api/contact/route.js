import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import Database from 'better-sqlite3'
import path from 'path'
import { randomBytes } from 'crypto'

function getDb() { return new Database(path.join(process.cwd(), 'prisma', 'dev.db')) }
function cuid() { return 'c' + randomBytes(16).toString('hex') }

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const db = getDb()
    const contacts = db.prepare(`
      SELECT c.*, m.name as machineName FROM Contact c
      LEFT JOIN Machine m ON m.id = c.machineId
      ORDER BY c.createdAt DESC
    `).all()
    db.close()
    return NextResponse.json({ contacts: contacts || [] })
  } catch (e) { return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}

export async function POST(request) {
  try {
    const { name, email, phone, message, machineId } = await request.json()
    if (!name || !email || !message) return NextResponse.json({ error: 'Nom, email et message sont requis' }, { status: 400 })
    const session = await getSession()
    const id = cuid()
    const now = new Date().toISOString()
    const db = getDb()
    db.prepare(`INSERT INTO Contact (id, name, email, phone, message, machineId, userId, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, 'new', ?)`
    ).run(id, name, email, phone||null, message, machineId||null, session?.id||null, now)
    db.close()
    return NextResponse.json({ success: true, id }, { status: 201 })
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}
