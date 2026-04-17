import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import Database from 'better-sqlite3'
import path from 'path'
import { randomBytes } from 'crypto'

function getDb() {
  return new Database(path.join(process.cwd(), 'prisma', 'dev.db'))
}
function cuid() {
  return 'c' + randomBytes(16).toString('hex')
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const wilaya = searchParams.get('wilaya') || ''
    const condition = searchParams.get('condition') || ''
    const minPrice = parseInt(searchParams.get('minPrice') || '0')
    const maxPrice = parseInt(searchParams.get('maxPrice') || '999999999')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    const db = getDb()

    // Build WHERE clauses
    const conditions = [
      'm.active = 1',
      'u.approved = 1',
      'm.price >= ?', 'm.price <= ?',
    ]
    const params = [minPrice, maxPrice]

    if (q) {
      conditions.push('(m.name LIKE ? OR m.description LIKE ? OR m.category LIKE ?)')
      params.push(`%${q}%`, `%${q}%`, `%${q}%`)
    }
    if (category) { conditions.push('m.category = ?'); params.push(category) }
    if (wilaya) { conditions.push('m.wilaya = ?'); params.push(wilaya) }
    if (condition) { conditions.push('m.condition = ?'); params.push(condition) }

    const where = conditions.join(' AND ')

    const machines = db.prepare(`
      SELECT m.*, u.name as sellerName, u.company as sellerCompany, u.wilaya as sellerWilaya
      FROM Machine m
      JOIN User u ON u.id = m.sellerId
      WHERE ${where}
      ORDER BY m.createdAt DESC
      LIMIT ? OFFSET ?
    `).all(...params, limit, skip)

    const total = db.prepare(`
      SELECT COUNT(*) as cnt FROM Machine m JOIN User u ON u.id = m.sellerId WHERE ${where}
    `).get(...params).cnt

    db.close()

    const formatted = machines.map(m => ({
      ...m,
      active: Boolean(m.active),
      verified: Boolean(m.verified),
      seller: { name: m.sellerName, company: m.sellerCompany, wilaya: m.sellerWilaya },
    }))

    return NextResponse.json({ machines: formatted, total, page, pages: Math.ceil(total / limit) })
  } catch (error) {
    console.error('Machines GET error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    if (session.role !== 'seller') return NextResponse.json({ error: 'Compte vendeur requis' }, { status: 403 })

    const db = getDb()
    const user = db.prepare('SELECT approved FROM User WHERE id = ?').get(session.id)
    db.close()

    if (!user?.approved) {
      return NextResponse.json({ error: "Votre compte vendeur n'est pas encore approuvé" }, { status: 403 })
    }

    const { name, category, price, condition, wilaya, description, specs, photos } = await request.json()
    if (!name || !category || !price || !condition || !wilaya) {
      return NextResponse.json({ error: 'Nom, catégorie, prix, état et wilaya sont requis' }, { status: 400 })
    }

    const priceInt = parseInt(price)
    if (!Number.isFinite(priceInt) || priceInt <= 0) {
      return NextResponse.json({ error: 'Prix invalide' }, { status: 400 })
    }

    const id = cuid()
    const now = new Date().toISOString()
    const db2 = getDb()
    db2.prepare(`
      INSERT INTO Machine (id, name, category, price, condition, wilaya, description, specs, photos, sellerId, verified, active, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1, ?)
    `).run(id, name, category, priceInt, condition, wilaya,
      description || null,
      specs ? JSON.stringify(specs) : null,
      photos ? JSON.stringify(photos) : null,
      session.id, now)
    db2.close()

    return NextResponse.json({ success: true, machine: { id, name, category, price: priceInt, condition, wilaya } }, { status: 201 })
  } catch (error) {
    console.error('Machine POST error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
