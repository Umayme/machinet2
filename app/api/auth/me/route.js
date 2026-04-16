import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    // Use raw SQL to include the new approved/approvedAt fields
    const users = await prisma.$queryRawUnsafe(
      `SELECT id, email, name, role, approved, company, wilaya, phone FROM User WHERE id = ?`,
      session.id
    )

    const user = users[0]
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    return NextResponse.json({
      user: {
        ...user,
        approved: Boolean(user.approved), // SQLite stores booleans as 0/1
      }
    })
  } catch (error) {
    console.error('Me error:', error)
    return NextResponse.json({ user: null }, { status: 200 })
  }
}
