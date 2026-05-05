import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const consultations = await prisma.consultation.findMany({
      include: { consultant: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ consultations })
  } catch (error) {
    console.error('Admin consultations error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const { id, status, consultantId, notes, scheduledAt } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    const data = {}
    if (status !== undefined) data.status = status
    if (consultantId !== undefined) data.consultantId = consultantId
    if (notes !== undefined) data.notes = notes
    if (scheduledAt !== undefined) data.scheduledAt = scheduledAt ? new Date(scheduledAt) : null
    await prisma.consultation.update({ where: { id }, data })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update consultation error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
