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
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const db = getDb()
    const consultations = db.prepare(`
      SELECT c.*, u.name as consultantName, u.email as consultantEmail
      FROM Consultation c
      LEFT JOIN User u ON u.id = c.consultantId
      ORDER BY c.createdAt DESC
    `).all()
    db.close()

    const formatted = (consultations || []).map(c => ({
      id: c.id,
      clientName: c.clientName,
      clientEmail: c.clientEmail,
      clientPhone: c.clientPhone,
      subject: c.subject,
      message: c.message,
      status: c.status,
      scheduledAt: c.scheduledAt,
      notes: c.notes,
      createdAt: c.createdAt,
      consultantId: c.consultantId,
      consultant: c.consultantName ? { name: c.consultantName, email: c.consultantEmail } : null,
    }))

    return NextResponse.json({ consultations: formatted })
  } catch (error) {
    console.error('Admin consultations error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id, status, consultantId, notes, scheduledAt } = await request.json()
    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    }

    const db = getDb()
    const parts = []
    const values = []

    if (status) { parts.push('status = ?'); values.push(status) }
    if (consultantId !== undefined) { parts.push('consultantId = ?'); values.push(consultantId) }
    if (notes !== undefined) { parts.push('notes = ?'); values.push(notes) }
    if (scheduledAt !== undefined) { parts.push('scheduledAt = ?'); values.push(scheduledAt) }

    if (parts.length > 0) {
      values.push(id)
      db.prepare(`UPDATE Consultation SET ${parts.join(', ')} WHERE id = ?`).run(...values)
    }
    db.close()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update consultation error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
