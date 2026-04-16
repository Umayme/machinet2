import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { userId, action } = await request.json()
    if (!userId || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 })
    }

    if (action === 'approve') {
      const now = new Date().toISOString()
      await prisma.$executeRawUnsafe(
        `UPDATE User SET approved = 1, approvedAt = ? WHERE id = ?`,
        now, userId
      )
      return NextResponse.json({ success: true, message: 'Utilisateur approuvé' })
    } else {
      // Reject: delete the user account
      await prisma.user.delete({ where: { id: userId } })
      return NextResponse.json({ success: true, message: 'Demande rejetée' })
    }
  } catch (error) {
    console.error('Approve error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
