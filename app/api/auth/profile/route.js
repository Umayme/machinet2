import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
    const { name, phone, company, wilaya, sector, avatar } = await request.json()
    if (!name || name.trim().length < 2) return NextResponse.json({ error: 'Nom trop court' }, { status: 400 })
    const user = await prisma.user.update({
      where: { id: session.id },
      data: { name: name.trim(), phone: phone || null, company: company || null, wilaya: wilaya || null, sector: sector || null, avatar: avatar || null },
      select: { id: true, email: true, name: true, role: true, approved: true, company: true, wilaya: true, phone: true, avatar: true },
    })
    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
