import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request, { params }) {
  try {
    const machine = await prisma.machine.findUnique({
      where: { id: params.id },
      include: {
        seller: {
          select: { name: true, company: true, wilaya: true, phone: true, email: true },
        },
      },
    })

    if (!machine) {
      return NextResponse.json({ error: 'Machine introuvable' }, { status: 404 })
    }

    return NextResponse.json({ machine })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const machine = await prisma.machine.findUnique({ where: { id: params.id } })
    if (!machine) {
      return NextResponse.json({ error: 'Machine introuvable' }, { status: 404 })
    }

    if (machine.sellerId !== session.id && session.role !== 'admin') {
      return NextResponse.json({ error: 'Accès interdit' }, { status: 403 })
    }

    const body = await request.json()
    const updated = await prisma.machine.update({
      where: { id: params.id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.category && { category: body.category }),
        ...(body.price !== undefined && (() => {
          const p = parseInt(body.price)
          if (!Number.isFinite(p) || p <= 0) throw new Error('Prix invalide')
          return { price: p }
        })()),
        ...(body.condition && { condition: body.condition }),
        ...(body.wilaya && { wilaya: body.wilaya }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.specs !== undefined && { specs: JSON.stringify(body.specs) }),
        ...(body.active !== undefined && { active: body.active }),
        ...(session.role === 'admin' && body.verified !== undefined && { verified: body.verified }),
      },
    })

    return NextResponse.json({ success: true, machine: updated })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const machine = await prisma.machine.findUnique({ where: { id: params.id } })
    if (!machine) {
      return NextResponse.json({ error: 'Machine introuvable' }, { status: 404 })
    }

    if (machine.sellerId !== session.id && session.role !== 'admin') {
      return NextResponse.json({ error: 'Accès interdit' }, { status: 403 })
    }

    await prisma.machine.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
