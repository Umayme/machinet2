import { NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

function getDb() { return new Database(path.join(process.cwd(), 'prisma', 'dev.db')) }

export async function GET() {
  try {
    const db = getDb()
    // Count approved sellers per wilaya
    const rows = db.prepare(`
      SELECT wilaya, COUNT(*) as count
      FROM User
      WHERE role = 'seller' AND approved = 1 AND wilaya IS NOT NULL AND wilaya != ''
      GROUP BY wilaya
    `).all()
    db.close()
    const result = {}
    for (const row of rows) {
      result[row.wilaya] = row.count
    }
    return NextResponse.json({ wilayaCounts: result })
  } catch (error) {
    console.error('Wilayas stats error:', error)
    return NextResponse.json({ wilayaCounts: {} })
  }
}
