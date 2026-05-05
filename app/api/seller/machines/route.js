import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    if (session.role !== 'seller' && session.role !== 'admin') return NextResponse.json({ error: 'Accès interdit' }, { status: 403 })
    const user = await prisma.user.findUnique({ where: { id: session.id }, select: { approved: true, role: true } })
    if (!user || (!user.approved && user.role !== 'admin')) return NextResponse.json({ error: 'Compte non approuvé' }, { status: 403 })
    const machines = await prisma.machine.findMany({ where: { sellerId: session.id }, include: { _count: { select: { contacts: true } } }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ machines: machines.map(m => ({ ...m, contacts: Array(m._count.contacts).fill({}) })) })
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}
