import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import Database from 'better-sqlite3'
import path from 'path'

function getDb() {
  return new Database(path.join(process.cwd(), 'prisma', 'dev.db'))
}

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    if (session.role !== 'consultant') {
      return NextResponse.json({ error: 'Accès interdit' }, { status: 403 })
    }

    const db = getDb()
    const user = db.prepare('SELECT approved FROM User WHERE id = ?').get(session.id)
    if (!user || !Boolean(user.approved)) {
      db.close()
      return NextResponse.json({ error: 'Compte non approuvé' }, { status: 403 })
    }

    const bookings = db.prepare(
      'SELECT * FROM Consultation WHERE consultantId = ? ORDER BY createdAt DESC'
    ).all(session.id)
    db.close()

    return NextResponse.json({ bookings: bookings || [] })
  } catch (error) {
    console.error('Consultant bookings error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'consultant') {
      return NextResponse.json({ error: 'Accès interdit' }, { status: 403 })
    }

    const { id, status } = await request.json()
    if (!id || !status) return NextResponse.json({ error: 'ID et statut requis' }, { status: 400 })

    const allowed = ['confirmed', 'completed', 'cancelled']
    if (!allowed.includes(status)) return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })

    const db = getDb()
    const booking = db.prepare('SELECT id, consultantId FROM Consultation WHERE id = ?').get(id)
    if (!booking) { db.close(); return NextResponse.json({ error: 'Consultation introuvable' }, { status: 404 }) }
    if (booking.consultantId !== session.id) { db.close(); return NextResponse.json({ error: 'Accès interdit' }, { status: 403 }) }

    db.prepare('UPDATE Consultation SET status = ? WHERE id = ?').run(status, id)
    db.close()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update booking error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
