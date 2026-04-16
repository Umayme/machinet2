import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const wilaya = searchParams.get('wilaya') || ''
    const condition = searchParams.get('condition') || ''
    const minPrice = parseInt(searchParams.get('minPrice') || '0')
    const maxPrice = parseInt(searchParams.get('maxPrice') || '999999999')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    const where = {
      active: true,
      seller: { approved: true }, // only show listings from approved sellers
      ...(q && {
        OR: [
          { name: { contains: q } },
          { description: { contains: q } },
          { category: { contains: q } },
        ],
      }),
      ...(category && { category }),
      ...(wilaya && { wilaya }),
      ...(condition && { condition }),
      price: { gte: minPrice, lte: maxPrice },
    }

    const [machines, total] = await Promise.all([
      prisma.machine.findMany({
        where,
        include: { seller: { select: { name: true, company: true, wilaya: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.machine.count({ where }),
    ])

    return NextResponse.json({ machines, total, page, pages: Math.ceil(total / limit) })
  } catch (error) {
    console.error('Machines GET error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Only approved sellers can create listings
    if (session.role !== 'seller') {
      return NextResponse.json({ error: 'Compte vendeur requis' }, { status: 403 })
    }
    const me = await prisma.user.findUnique({
      where: { id: session.id },
      select: { approved: true },
    })
    if (!me?.approved) {
      return NextResponse.json(
        { error: 'Votre compte vendeur n\'est pas encore approuvé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, category, price, condition, wilaya, description, specs, photos } = body

    if (!name || !category || !price || !condition || !wilaya) {
      return NextResponse.json(
        { error: 'Nom, catégorie, prix, état et wilaya sont requis' },
        { status: 400 }
      )
    }

    const priceInt = parseInt(price)
    if (!Number.isFinite(priceInt) || priceInt <= 0) {
      return NextResponse.json({ error: 'Prix invalide' }, { status: 400 })
    }

    const machine = await prisma.machine.create({
      data: {
        name,
        category,
        price: priceInt,
        condition,
        wilaya,
        description: description || null,
        specs: specs ? JSON.stringify(specs) : null,
        photos: photos ? JSON.stringify(photos) : null,
        sellerId: session.id,
      },
    })

    return NextResponse.json({ success: true, machine }, { status: 201 })
  } catch (error) {
    console.error('Machine POST error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
