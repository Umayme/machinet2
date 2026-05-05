import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'

export async function GET(request) {
  try {
    const session = await getSession()
    const { searchParams } = new URL(request.url)
    const adminOnly = searchParams.get('admin') === '1'
    if (adminOnly) {
      if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
      const feedbacks = await prisma.feedback.findMany({ orderBy: { createdAt: 'desc' } })
      return NextResponse.json({ feedbacks })
    }
    const feedbacks = await prisma.feedback.findMany({ where: { approved: true }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ feedbacks })
  } catch (error) {
    console.error('Feedback GET error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { nom, poste, wilaya, note, texte } = await request.json()
    if (!nom || !note || !texte) return NextResponse.json({ error: 'Nom, note et avis sont requis' }, { status: 400 })
    if (note < 1 || note > 5) return NextResponse.json({ error: 'Note invalide' }, { status: 400 })
    const id = 'f' + randomBytes(16).toString('hex')
    await prisma.feedback.create({ data: { id, nom, poste: poste||null, wilaya: wilaya||null, note, texte } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feedback POST error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const { id, approved } = await request.json()
    await prisma.feedback.update({ where: { id }, data: { approved: !!approved } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feedback PATCH error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const { id } = await request.json()
    await prisma.feedback.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feedback DELETE error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
