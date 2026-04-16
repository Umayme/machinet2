import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'seller') {
      return NextResponse.json({ error: 'Accès interdit' }, { status: 403 })
    }

    const users = await prisma.$queryRawUnsafe(
      `SELECT approved FROM User WHERE id = ?`,
      session.id
    )
    const user = users[0]
    if (!user || !Boolean(user.approved)) {
      return NextResponse.json({ error: 'Compte non approuvé' }, { status: 403 })
    }

    const contacts = await prisma.$queryRawUnsafe(`
      SELECT c.id, c.name, c.email, c.phone, c.message, c.status, c.createdAt,
             m.name as machineName, m.id as machineId
      FROM Contact c
      JOIN Machine m ON m.id = c.machineId
      WHERE m.sellerId = ?
      ORDER BY c.createdAt DESC
    `, session.id)

    return NextResponse.json({ contacts: contacts || [] })
  } catch (error) {
    console.error('Seller contacts error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
