import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { randomBytes } from 'crypto'

function cuid() {
  return 'c' + randomBytes(16).toString('hex')
}

export async function POST(request) {
  try {
    const { clientName, clientEmail, clientPhone, subject, message } = await request.json()

    if (!clientName || !clientEmail || !subject) {
      return NextResponse.json(
        { error: 'Nom, email et sujet sont requis' },
        { status: 400 }
      )
    }

    const id = cuid()
    const now = new Date().toISOString()

    await prisma.$executeRawUnsafe(
      `INSERT INTO Consultation (id, clientName, clientEmail, clientPhone, subject, message, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`,
      id, clientName, clientEmail, clientPhone || null, subject, message || null, now
    )

    return NextResponse.json({ success: true, id }, { status: 201 })
  } catch (error) {
    console.error('Consultation POST error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
