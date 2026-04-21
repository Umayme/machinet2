import { NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'
import { randomBytes } from 'crypto'
import { getSession } from '@/lib/auth'

function getDb() {
  const db = new Database(path.join(process.cwd(), 'prisma', 'dev.db'))
  db.prepare(`
    CREATE TABLE IF NOT EXISTS BlogPost (
      id TEXT PRIMARY KEY,
      titre TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      categorie TEXT NOT NULL,
      contenu TEXT,
      desc TEXT,
      image TEXT,
      tags TEXT,
      temps TEXT DEFAULT '5 min',
      published INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `).run()
  return db
}

export async function GET(request) {
  try {
    const session = await getSession()
    const { searchParams } = new URL(request.url)
    const adminMode = searchParams.get('admin') === '1'
    const cat = searchParams.get('categorie')
    const slug = searchParams.get('slug')

    const db = getDb()

    if (slug) {
      const post = db.prepare('SELECT * FROM BlogPost WHERE slug = ?').get(slug)
      db.close()
      if (!post) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
      return NextResponse.json({ post: { ...post, tags: post.tags ? JSON.parse(post.tags) : [] } })
    }

    if (adminMode) {
      if (!session || session.role !== 'admin') {
        db.close()
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
      }
      const posts = db.prepare('SELECT * FROM BlogPost ORDER BY createdAt DESC').all()
      db.close()
      return NextResponse.json({ posts: posts.map(p => ({ ...p, tags: p.tags ? JSON.parse(p.tags) : [] })) })
    }

    let query = 'SELECT * FROM BlogPost WHERE published = 1'
    const params = []
    if (cat) { query += ' AND categorie = ?'; params.push(cat) }
    query += ' ORDER BY createdAt DESC'
    const posts = db.prepare(query).all(...params)
    db.close()
    return NextResponse.json({ posts: posts.map(p => ({ ...p, tags: p.tags ? JSON.parse(p.tags) : [] })) })
  } catch (error) {
    console.error('Blog GET error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    const { titre, categorie, contenu, desc, image, tags, temps, published } = await request.json()
    if (!titre || !categorie) {
      return NextResponse.json({ error: 'Titre et catégorie requis' }, { status: 400 })
    }
    const id = 'b' + randomBytes(16).toString('hex')
    const slug = titre.toLowerCase()
      .replace(/[àâä]/g, 'a').replace(/[éèêë]/g, 'e').replace(/[îï]/g, 'i')
      .replace(/[ôö]/g, 'o').replace(/[ùûü]/g, 'u').replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + id.slice(1, 7)
    const now = new Date().toISOString()
    const db = getDb()
    db.prepare(`
      INSERT INTO BlogPost (id, titre, slug, categorie, contenu, desc, image, tags, temps, published, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, titre, slug, categorie, contenu || '', desc || '', image || null, JSON.stringify(tags || []), temps || '5 min', published ? 1 : 0, now, now)
    db.close()
    return NextResponse.json({ success: true, id, slug })
  } catch (error) {
    console.error('Blog POST error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    const { id, titre, categorie, contenu, desc, image, tags, temps, published } = await request.json()
    const db = getDb()
    db.prepare(`
      UPDATE BlogPost SET titre=?, categorie=?, contenu=?, desc=?, image=?, tags=?, temps=?, published=?, updatedAt=?
      WHERE id=?
    `).run(titre, categorie, contenu || '', desc || '', image || null, JSON.stringify(tags || []), temps || '5 min', published ? 1 : 0, new Date().toISOString(), id)
    db.close()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Blog PATCH error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    const { id } = await request.json()
    const db = getDb()
    db.prepare('DELETE FROM BlogPost WHERE id = ?').run(id)
    db.close()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Blog DELETE error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
