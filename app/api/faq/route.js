import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')
    const adminMode = searchParams.get('admin') === '1'
    const session = await getSession()
    if (adminMode) {
      if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
      const faqs = await prisma.faq.findMany({ orderBy: [{ page: 'asc' }, { ordre: 'asc' }] })
      return NextResponse.json({ faqs })
    }
    const where = { active: true }
    if (page) where.page = page
    const faqs = await prisma.faq.findMany({ where, orderBy: { ordre: 'asc' } })
    return NextResponse.json({ faqs })
  } catch (error) {
    console.error('FAQ GET error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const { question, reponse, page, ordre, active } = await request.json()
    if (!question || !reponse || !page) return NextResponse.json({ error: 'Question, réponse et page requis' }, { status: 400 })
    const id = 'faq' + randomBytes(12).toString('hex')
    await prisma.faq.create({ data: { id, question, reponse, page, ordre: ordre ?? 0, active: active !== false } })
    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error('FAQ POST error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const { id, question, reponse, page, ordre, active } = await request.json()
    await prisma.faq.update({ where: { id }, data: { question, reponse, page, ordre: ordre ?? 0, active: !!active } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('FAQ PATCH error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const { id } = await request.json()
    await prisma.faq.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('FAQ DELETE error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
