import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'

export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({ where: { active: true }, orderBy: { ordre: 'asc' } })
    return NextResponse.json({ members })
  } catch (error) {
    console.error('Team GET error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const { nom, titre, bio, wilaya, avatar, ordre, active } = await request.json()
    if (!nom || !titre) return NextResponse.json({ error: 'Nom et titre requis' }, { status: 400 })
    const id = 't' + randomBytes(12).toString('hex')
    await prisma.teamMember.create({ data: { id, nom, titre, bio: bio||'', wilaya: wilaya||'', avatar: avatar||null, ordre: ordre??0, active: active !== false } })
    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Team POST error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const { id, nom, titre, bio, wilaya, avatar, ordre, active } = await request.json()
    await prisma.teamMember.update({ where: { id }, data: { nom, titre, bio: bio||'', wilaya: wilaya||'', avatar: avatar||null, ordre: ordre??0, active: !!active } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Team PATCH error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const { id } = await request.json()
    await prisma.teamMember.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Team DELETE error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
