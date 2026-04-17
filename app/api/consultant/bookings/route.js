import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import Database from 'better-sqlite3'
import path from 'path'

function getDb() { return new Database(path.join(process.cwd(), 'prisma', 'dev.db')) }

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'consultant') return NextResponse.json({ error: 'Accès interdit' }, { status: 403 })
    const db = getDb()
    const user = db.prepare('SELECT approved FROM User WHERE id = ?').get(session.id)
    if (!user || !user.approved) { db.close(); return NextResponse.json({ error: 'Compte non approuvé' }, { status: 403 }) }
    const bookings = db.prepare('SELECT * FROM Consultation WHERE consultantId = ? ORDER BY createdAt DESC').all(session.id)
    db.close()
    return NextResponse.json({ bookings: bookings || [] })
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}

export async function PUT(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'consultant') return NextResponse.json({ error: 'Accès interdit' }, { status: 403 })
    const { id, status } = await request.json()
    if (!id || !['confirmed','completed','cancelled'].includes(status)) return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 })
    const db = getDb()
    const booking = db.prepare('SELECT consultantId FROM Consultation WHERE id = ?').get(id)
    if (!booking) { db.close(); return NextResponse.json({ error: 'Consultation introuvable' }, { status: 404 }) }
    if (booking.consultantId !== session.id) { db.close(); return NextResponse.json({ error: 'Accès interdit' }, { status: 403 }) }
    db.prepare('UPDATE Consultation SET status = ? WHERE id = ?').run(status, id)
    db.close()
    return NextResponse.json({ success: true })
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}
