import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request, { params }) {
  try {
    const machine = await prisma.machine.findFirst({ where: { id: params.id, active: true }, include: { seller: { select: { name: true, company: true, wilaya: true, phone: true } } } })
    if (!machine) return NextResponse.json({ error: 'Annonce introuvable' }, { status: 404 })
    return NextResponse.json({ machine })
  } catch (e) { return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}

export async function PUT(request, { params }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const machine = await prisma.machine.findUnique({ where: { id: params.id }, select: { sellerId: true } })
    if (!machine) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
    if (machine.sellerId !== session.id && session.role !== 'admin') return NextResponse.json({ error: 'Interdit' }, { status: 403 })
    const body = await request.json()
    const allowed = ['name','category','price','condition','wilaya','description','specs','photos','active','verified']
    const data = {}
    allowed.forEach(f => { if (body[f] !== undefined) data[f] = body[f] })
    await prisma.machine.update({ where: { id: params.id }, data })
    return NextResponse.json({ success: true })
  } catch (e) { return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const machine = await prisma.machine.findUnique({ where: { id: params.id }, select: { sellerId: true } })
    if (!machine) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
    if (machine.sellerId !== session.id && session.role !== 'admin') return NextResponse.json({ error: 'Interdit' }, { status: 403 })
    await prisma.machine.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (e) { return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}
