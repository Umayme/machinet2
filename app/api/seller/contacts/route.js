import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'seller') return NextResponse.json({ error: 'Accès interdit' }, { status: 403 })
    const user = await prisma.user.findUnique({ where: { id: session.id }, select: { approved: true } })
    if (!user?.approved) return NextResponse.json({ error: 'Compte non approuvé' }, { status: 403 })
    const contacts = await prisma.contact.findMany({ where: { machine: { sellerId: session.id } }, include: { machine: { select: { name: true, id: true } } }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ contacts })
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}
