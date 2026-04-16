import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    if (session.role !== 'consultant') {
      return NextResponse.json({ error: 'Accès interdit' }, { status: 403 })
    }

    // Check if consultant is approved
    const users = await prisma.$queryRawUnsafe(
      `SELECT approved FROM User WHERE id = ?`,
      session.id
    )
    const user = users[0]

    if (!user || !Boolean(user.approved)) {
      return NextResponse.json({ error: 'Compte non approuvé' }, { status: 403 })
    }

    // Get consultant's bookings
    const bookings = await prisma.$queryRawUnsafe(
      `SELECT * FROM Consultation WHERE consultantId = ? ORDER BY createdAt DESC`,
      session.id
    )

    return NextResponse.json({ bookings: bookings || [] })
  } catch (error) {
    console.error('Consultant bookings error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'consultant') {
      return NextResponse.json({ error: 'Accès interdit' }, { status: 403 })
    }

    const { id, status } = await request.json()
    if (!id || !status) {
      return NextResponse.json({ error: 'ID et statut requis' }, { status: 400 })
    }

    const allowed = ['confirmed', 'completed', 'cancelled']
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
    }

    // Verify the booking belongs to this consultant
    const bookings = await prisma.$queryRawUnsafe(
      `SELECT id, consultantId FROM Consultation WHERE id = ?`,
      id
    )
    const booking = bookings[0]
    if (!booking) {
      return NextResponse.json({ error: 'Consultation introuvable' }, { status: 404 })
    }
    if (booking.consultantId !== session.id) {
      return NextResponse.json({ error: 'Accès interdit' }, { status: 403 })
    }

    await prisma.$executeRawUnsafe(
      `UPDATE Consultation SET status = ? WHERE id = ?`,
      status, id
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update booking error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
