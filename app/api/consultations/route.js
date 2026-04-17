import { NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'
import { randomBytes } from 'crypto'

function getDb() {
  return new Database(path.join(process.cwd(), 'prisma', 'dev.db'))
}
function cuid() {
  return 'c' + randomBytes(16).toString('hex')
}

export async function POST(request) {
  try {
    const { clientName, clientEmail, clientPhone, subject, message } = await request.json()
    if (!clientName || !clientEmail || !subject) {
      return NextResponse.json({ error: 'Nom, email et sujet sont requis' }, { status: 400 })
    }

    const id = cuid()
    const now = new Date().toISOString()
    const db = getDb()
    db.prepare(
      `INSERT INTO Consultation (id, clientName, clientEmail, clientPhone, subject, message, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`
    ).run(id, clientName, clientEmail, clientPhone || null, subject, message || null, now)
    db.close()

    return NextResponse.json({ success: true, id }, { status: 201 })
  } catch (error) {
    console.error('Consultation POST error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
