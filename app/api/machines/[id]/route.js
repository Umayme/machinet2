import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import Database from 'better-sqlite3'
import path from 'path'

function getDb() { return new Database(path.join(process.cwd(), 'prisma', 'dev.db')) }

export async function GET(request, { params }) {
  try {
    const db = getDb()
    const machine = db.prepare(`
      SELECT m.*, u.name as sellerName, u.company as sellerCompany, u.wilaya as sellerWilaya, u.phone as sellerPhone
      FROM Machine m JOIN User u ON u.id = m.sellerId
      WHERE m.id = ? AND m.active = 1
    `).get(params.id)
    db.close()
    if (!machine) return NextResponse.json({ error: 'Annonce introuvable' }, { status: 404 })
    return NextResponse.json({ machine: { ...machine, verified: Boolean(machine.verified), active: Boolean(machine.active), seller: { name: machine.sellerName, company: machine.sellerCompany, wilaya: machine.sellerWilaya, phone: machine.sellerPhone } } })
  } catch (e) { return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}

export async function PUT(request, { params }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const db = getDb()
    const machine = db.prepare('SELECT sellerId FROM Machine WHERE id = ?').get(params.id)
    if (!machine) { db.close(); return NextResponse.json({ error: 'Introuvable' }, { status: 404 }) }
    if (machine.sellerId !== session.id && session.role !== 'admin') { db.close(); return NextResponse.json({ error: 'Interdit' }, { status: 403 }) }
    const body = await request.json()
    const fields = ['name','category','price','condition','wilaya','description','specs','photos','active','verified']
    const parts = [], vals = []
    fields.forEach(f => { if (body[f] !== undefined) { parts.push(`${f} = ?`); vals.push(body[f]) } })
    if (parts.length) { vals.push(params.id); db.prepare(`UPDATE Machine SET ${parts.join(', ')} WHERE id = ?`).run(...vals) }
    db.close()
    return NextResponse.json({ success: true })
  } catch (e) { return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const db = getDb()
    const machine = db.prepare('SELECT sellerId FROM Machine WHERE id = ?').get(params.id)
    if (!machine) { db.close(); return NextResponse.json({ error: 'Introuvable' }, { status: 404 }) }
    if (machine.sellerId !== session.id && session.role !== 'admin') { db.close(); return NextResponse.json({ error: 'Interdit' }, { status: 403 }) }
    db.prepare('DELETE FROM Machine WHERE id = ?').run(params.id)
    db.close()
    return NextResponse.json({ success: true })
  } catch (e) { return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}
