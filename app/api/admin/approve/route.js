import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import Database from 'better-sqlite3'
import path from 'path'

function getDb() {
  return new Database(path.join(process.cwd(), 'prisma', 'dev.db'))
}

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

    const db = getDb()
    if (action === 'approve') {
      const now = new Date().toISOString()
      db.prepare(`UPDATE User SET approved = 1, approvedAt = ? WHERE id = ?`).run(now, userId)
      db.close()
      return NextResponse.json({ success: true, message: 'Utilisateur approuvé' })
    } else {
      db.prepare(`DELETE FROM User WHERE id = ?`).run(userId)
      db.close()
      return NextResponse.json({ success: true, message: 'Demande rejetée' })
    }
  } catch (error) {
    console.error('Approve error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
