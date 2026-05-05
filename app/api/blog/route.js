import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'

export async function GET(request) {
  try {
    const session = await getSession()
    const { searchParams } = new URL(request.url)
    const adminMode = searchParams.get('admin') === '1'
    const cat = searchParams.get('categorie')
    const slug = searchParams.get('slug')

    if (slug) {
      const post = await prisma.blogPost.findUnique({ where: { slug } })
      if (!post) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
      return NextResponse.json({ post: { ...post, tags: post.tags ? JSON.parse(post.tags) : [] } })
    }
    if (adminMode) {
      if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
      const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
      return NextResponse.json({ posts: posts.map(p => ({ ...p, tags: p.tags ? JSON.parse(p.tags) : [] })) })
    }
    const where = { published: true }
    if (cat) where.categorie = cat
    const posts = await prisma.blogPost.findMany({ where, orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ posts: posts.map(p => ({ ...p, tags: p.tags ? JSON.parse(p.tags) : [] })) })
  } catch (error) {
    console.error('Blog GET error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const { titre, categorie, contenu, desc, image, tags, temps, published } = await request.json()
    if (!titre || !categorie) return NextResponse.json({ error: 'Titre et catégorie requis' }, { status: 400 })
    const id = 'b' + randomBytes(16).toString('hex')
    const slug = titre.toLowerCase().replace(/[àâä]/g,'a').replace(/[éèêë]/g,'e').replace(/[îï]/g,'i').replace(/[ôö]/g,'o').replace(/[ùûü]/g,'u').replace(/[ç]/g,'c').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') + '-' + id.slice(1,7)
    await prisma.blogPost.create({ data: { id, titre, slug, categorie, contenu: contenu||'', desc: desc||'', image: image||null, tags: JSON.stringify(tags||[]), temps: temps||'5 min', published: !!published } })
    return NextResponse.json({ success: true, id, slug })
  } catch (error) {
    console.error('Blog POST error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const { id, titre, categorie, contenu, desc, image, tags, temps, published } = await request.json()
    await prisma.blogPost.update({ where: { id }, data: { titre, categorie, contenu: contenu||'', desc: desc||'', image: image||null, tags: JSON.stringify(tags||[]), temps: temps||'5 min', published: !!published } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Blog PATCH error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const { id } = await request.json()
    await prisma.blogPost.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Blog DELETE error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
