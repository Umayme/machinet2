import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'

export async function GET() {
  try {
    const packages = await prisma.consultingPackage.findMany({ where: { active: true }, orderBy: { ordre: 'asc' } })
    return NextResponse.json({ packages: packages.map(p => ({ ...p, inclus: p.inclus ? JSON.parse(p.inclus) : [] })) })
  } catch (error) {
    console.error('Packages GET error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const { titre, prix, duree, desc, inclus, badge, ordre, active } = await request.json()
    if (!titre || !prix) return NextResponse.json({ error: 'Titre et prix requis' }, { status: 400 })
    const id = 'cp' + randomBytes(12).toString('hex')
    await prisma.consultingPackage.create({ data: { id, titre, prix, duree: duree||'', desc: desc||null, inclus: JSON.stringify(inclus||[]), badge: badge||null, ordre: ordre??0, active: active !== false } })
    return NextResponse.json({ success: true, id })
  } catch (error) { return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}

export async function PATCH(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const { id, titre, prix, duree, desc, inclus, badge, ordre, active } = await request.json()
    await prisma.consultingPackage.update({ where: { id }, data: { titre, prix, duree: duree||'', desc: desc||null, inclus: JSON.stringify(inclus||[]), badge: badge||null, ordre: ordre??0, active: !!active } })
    return NextResponse.json({ success: true })
  } catch (error) { return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}

export async function DELETE(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const { id } = await request.json()
    await prisma.consultingPackage.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) { return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}
