import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import Database from 'better-sqlite3'
import path from 'path'

function getDb() { return new Database(path.join(process.cwd(), 'prisma', 'dev.db')) }

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ user: null })
    const db = getDb()
    try { db.prepare('ALTER TABLE User ADD COLUMN avatar TEXT').run() } catch {}
    const user = db.prepare('SELECT id, email, name, role, approved, company, wilaya, phone, avatar FROM User WHERE id = ?').get(session.id)
    db.close()
    if (!user) return NextResponse.json({ user: null })
    return NextResponse.json({ user: { ...user, approved: Boolean(user.approved) } })
  } catch (e) { return NextResponse.json({ user: null }) }
}
