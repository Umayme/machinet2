import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    if (session.role !== 'seller' && session.role !== 'admin') {
      return NextResponse.json({ error: 'Accès interdit' }, { status: 403 })
    }

    // Check if seller is approved using raw SQL
    const users = await prisma.$queryRawUnsafe(
      `SELECT approved, role FROM User WHERE id = ?`,
      session.id
    )
    const user = users[0]

    if (!user || (!Boolean(user.approved) && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Compte non approuvé' }, { status: 403 })
    }

    // Get seller's own machines only with contact count
    const machines = await prisma.$queryRawUnsafe(`
      SELECT m.*, COUNT(c.id) as contactCount
      FROM Machine m
      LEFT JOIN Contact c ON c.machineId = m.id
      WHERE m.sellerId = ?
      GROUP BY m.id
      ORDER BY m.createdAt DESC
    `, session.id)

    // Format response
    const formatted = (machines || []).map(m => ({
      ...m,
      verified: Boolean(m.verified),
      active: Boolean(m.active),
      contacts: Array(Number(m.contactCount || 0)).fill({}),
    }))

    return NextResponse.json({ machines: formatted })
  } catch (error) {
    console.error('Seller machines error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
