import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'
import { sendWelcomeEmail } from '@/lib/email'
import { randomBytes } from 'crypto'
import Database from 'better-sqlite3'
import path from 'path'

function getDb() { return new Database(path.join(process.cwd(), 'prisma', 'dev.db')) }
function cuid() { return 'c' + randomBytes(16).toString('hex') }

export async function POST(request) {
  try {
    const { email, password, name, phone, company, wilaya, sector, role } = await request.json()
    if (!email || !password || !name) return NextResponse.json({ error: 'Email, mot de passe et nom sont requis' }, { status: 400 })
    if (typeof password !== 'string' || password.length < 8) return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 8 caractères' }, { status: 400 })

    const validRoles = ['buyer', 'seller', 'consultant']
    const userRole = validRoles.includes(role) ? role : 'buyer'

    const db = getDb()
    const existing = db.prepare('SELECT id FROM User WHERE email = ?').get(email)
    if (existing) { db.close(); return NextResponse.json({ error: 'Un compte avec cet email existe déjà' }, { status: 400 }) }

    const hashedPassword = await bcrypt.hash(password, 10)
    const now = new Date().toISOString()
    const id = cuid()
    const approved = userRole === 'buyer' ? 1 : 0

    db.prepare(`INSERT INTO User (id, email, password, name, phone, company, wilaya, sector, role, approved, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, email, hashedPassword, name, phone||null, company||null, wilaya||null, sector||null, userRole, approved, now)
    db.close()

    sendWelcomeEmail({ name, email, role: userRole }).catch(() => {})
    const token = signToken({ id, email, role: userRole })
    const response = NextResponse.json({ success: true, user: { id, email, name, role: userRole, approved: Boolean(approved) } })
    response.cookies.set('auth_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60*60*24*7 })
    return response
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}
