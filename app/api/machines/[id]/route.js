import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import Database from 'better-sqlite3'
import path from 'path'

function getDb() {
  return new Database(path.join(process.cwd(), 'prisma', 'dev.db'))
}

export async function GET(request, { params }) {
  try {
    const db = getDb()
    const machine = db.prepare(`
      SELECT m.*, u.name as sellerName, u.company as sellerCompany,
             u.wilaya as sellerWilaya, u.phone as sellerPhone, u.email as sellerEmail
      FROM Machine m
      LEFT JOIN User u ON u.id = m.sellerId
      WHERE m.id = ?
    `).get(params.id)
    db.close()

    if (!machine) return NextResponse.json({ error: 'Machine introuvable' }, { status: 404 })

    return NextResponse.json({
      machine: {
        ...machine,
        active: Boolean(machine.active),
        verified: Boolean(machine.verified),
        seller: {
          name: machine.sellerName, company: machine.sellerCompany,
          wilaya: machine.sellerWilaya, phone: machine.sellerPhone, email: machine.sellerEmail,
        },
      }
    })
  } catch (error) {
    console.error('Machine GET error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const db = getDb()
    const machine = db.prepare('SELECT id, sellerId FROM Machine WHERE id = ?').get(params.id)
    if (!machine) { db.close(); return NextResponse.json({ error: 'Machine introuvable' }, { status: 404 }) }
    if (machine.sellerId !== session.id && session.role !== 'admin') {
      db.close()
      return NextResponse.json({ error: 'Accès interdit' }, { status: 403 })
    }

    const body = await request.json()
    const parts = []
    const values = []

    if (body.name) { parts.push('name = ?'); values.push(body.name) }
    if (body.category) { parts.push('category = ?'); values.push(body.category) }
    if (body.price !== undefined) {
      const p = parseInt(body.price)
      if (!Number.isFinite(p) || p <= 0) { db.close(); return NextResponse.json({ error: 'Prix invalide' }, { status: 400 }) }
      parts.push('price = ?'); values.push(p)
    }
    if (body.condition) { parts.push('condition = ?'); values.push(body.condition) }
    if (body.wilaya) { parts.push('wilaya = ?'); values.push(body.wilaya) }
    if (body.description !== undefined) { parts.push('description = ?'); values.push(body.description) }
    if (body.specs !== undefined) { parts.push('specs = ?'); values.push(JSON.stringify(body.specs)) }
    if (body.active !== undefined) { parts.push('active = ?'); values.push(body.active ? 1 : 0) }
    if (session.role === 'admin' && body.verified !== undefined) { parts.push('verified = ?'); values.push(body.verified ? 1 : 0) }

    if (parts.length > 0) {
      values.push(params.id)
      db.prepare(`UPDATE Machine SET ${parts.join(', ')} WHERE id = ?`).run(...values)
    }
    db.close()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Machine PUT error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const db = getDb()
    const machine = db.prepare('SELECT id, sellerId FROM Machine WHERE id = ?').get(params.id)
    if (!machine) { db.close(); return NextResponse.json({ error: 'Machine introuvable' }, { status: 404 }) }
    if (machine.sellerId !== session.id && session.role !== 'admin') {
      db.close()
      return NextResponse.json({ error: 'Accès interdit' }, { status: 403 })
    }

    db.prepare('DELETE FROM Machine WHERE id = ?').run(params.id)
    db.close()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Machine DELETE error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
