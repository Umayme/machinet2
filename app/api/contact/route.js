import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendContactNotification } from '@/lib/email'

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const contacts = await prisma.contact.findMany({ include: { machine: { select: { name: true } } }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ contacts })
  } catch (e) { return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}

export async function POST(request) {
  try {
    const { name, email, phone, message, machineId } = await request.json()
    if (!name || !email || !message) return NextResponse.json({ error: 'Nom, email et message sont requis' }, { status: 400 })
    const session = await getSession()
    const contact = await prisma.contact.create({ data: { name, email, phone: phone || null, message, machineId: machineId || null, userId: session?.id || null } })
    try { await sendContactNotification({ name, email, phone: phone||'', message, machineId }) } catch {}
    return NextResponse.json({ success: true, id: contact.id }, { status: 201 })
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}
