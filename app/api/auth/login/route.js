import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 })
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })
    const token = signToken({ id: user.id, email: user.email, role: user.role })
    const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role, approved: user.approved } })
    response.cookies.set('auth_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60*60*24*7 })
    return response
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}
