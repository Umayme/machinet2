import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'consultant') return NextResponse.json({ error: 'Accès interdit' }, { status: 403 })
    const user = await prisma.user.findUnique({ where: { id: session.id }, select: { approved: true } })
    if (!user?.approved) return NextResponse.json({ error: 'Compte non approuvé' }, { status: 403 })
    const bookings = await prisma.consultation.findMany({ where: { consultantId: session.id }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ bookings })
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}

export async function PUT(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'consultant') return NextResponse.json({ error: 'Accès interdit' }, { status: 403 })
    const { id, status } = await request.json()
    if (!id || !['confirmed','completed','cancelled'].includes(status)) return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 })
    const booking = await prisma.consultation.findUnique({ where: { id }, select: { consultantId: true } })
    if (!booking) return NextResponse.json({ error: 'Consultation introuvable' }, { status: 404 })
    if (booking.consultantId !== session.id) return NextResponse.json({ error: 'Accès interdit' }, { status: 403 })
    await prisma.consultation.update({ where: { id }, data: { status } })
    return NextResponse.json({ success: true })
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}
