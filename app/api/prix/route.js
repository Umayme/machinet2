import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'

export async function GET() {
  try {
    const rows = await prisma.prixMarche.findMany({ orderBy: [{ secteur: 'asc' }, { nom: 'asc' }] })
    const grouped = {}
    for (const row of rows) {
      if (!grouped[row.secteur]) grouped[row.secteur] = []
      grouped[row.secteur].push(row)
    }
    const result = Object.entries(grouped).map(([secteur, machines]) => ({ secteur, machines }))
    return NextResponse.json({ data: result, count: rows.length })
  } catch (error) {
    console.error('Prix GET error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const { secteur, nom, min, max, tendance, pct } = await request.json()
    if (!secteur || !nom || !min || !max) return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    const id = 'p' + randomBytes(12).toString('hex')
    await prisma.prixMarche.create({ data: { id, secteur, nom, min, max, tendance: tendance||'→', pct: pct||'stable' } })
    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('Prix POST error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const { id, secteur, nom, min, max, tendance, pct } = await request.json()
    await prisma.prixMarche.update({ where: { id }, data: { secteur, nom, min, max, tendance: tendance||'→', pct: pct||'stable' } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Prix PATCH error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const { id } = await request.json()
    await prisma.prixMarche.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Prix DELETE error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
