import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const rows = await prisma.user.groupBy({ by: ['wilaya'], where: { role: 'seller', approved: true, wilaya: { not: null } }, _count: { wilaya: true } })
    const result = {}
    for (const row of rows) { if (row.wilaya) result[row.wilaya] = row._count.wilaya }
    return NextResponse.json({ wilayaCounts: result })
  } catch (error) {
    console.error('Wilayas stats error:', error)
    return NextResponse.json({ wilayaCounts: {} })
  }
}
