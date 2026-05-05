import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const { clientName, clientEmail, clientPhone, subject, message } = await request.json()
    if (!clientName || !clientEmail || !subject) return NextResponse.json({ error: 'Nom, email et sujet sont requis' }, { status: 400 })
    const consultation = await prisma.consultation.create({ data: { clientName, clientEmail, clientPhone: clientPhone || null, subject, message: message || null } })
    return NextResponse.json({ success: true, id: consultation.id }, { status: 201 })
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}
