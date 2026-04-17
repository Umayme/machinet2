import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import Database from 'better-sqlite3'
import path from 'path'

function getDb() {
  return new Database(path.join(process.cwd(), 'prisma', 'dev.db'))
}

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ user: null }, { status: 200 })

    const db = getDb()
    const user = db.prepare(
      'SELECT id, email, name, role, approved, company, wilaya, phone FROM User WHERE id = ?'
    ).get(session.id)
    db.close()

    if (!user) return NextResponse.json({ user: null }, { status: 200 })

    return NextResponse.json({
      user: { ...user, approved: Boolean(user.approved) }
    })
  } catch (error) {
    console.error('Me error:', error)
    return NextResponse.json({ user: null }, { status: 200 })
  }
}
