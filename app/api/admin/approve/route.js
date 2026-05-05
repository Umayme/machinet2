import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const { userId, action } = await request.json()
    if (!userId || !['approve', 'reject'].includes(action)) return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 })
    if (action === 'approve') {
      await prisma.user.update({ where: { id: userId }, data: { approved: true, approvedAt: new Date() } })
      return NextResponse.json({ success: true, message: 'Utilisateur approuvé' })
    } else {
      await prisma.user.delete({ where: { id: userId } })
      return NextResponse.json({ success: true, message: 'Demande rejetée' })
    }
  } catch (error) {
    console.error('Approve error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
