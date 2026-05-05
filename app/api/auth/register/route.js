import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'
import { sendWelcomeEmail } from '@/lib/email'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const { email, password, name, phone, company, wilaya, sector, role } = await request.json()
    if (!email || !password || !name) return NextResponse.json({ error: 'Email, mot de passe et nom sont requis' }, { status: 400 })
    if (typeof password !== 'string' || password.length < 8) return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 8 caractères' }, { status: 400 })
    const validRoles = ['buyer', 'seller', 'consultant']
    const userRole = validRoles.includes(role) ? role : 'buyer'
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'Un compte avec cet email existe déjà' }, { status: 400 })
    const hashedPassword = await bcrypt.hash(password, 10)
    const approved = userRole === 'buyer'
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, phone: phone || null, company: company || null, wilaya: wilaya || null, sector: sector || null, role: userRole, approved },
    })
    sendWelcomeEmail({ name, email, role: userRole }).catch(() => {})
    const token = signToken({ id: user.id, email: user.email, role: user.role })
    const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role, approved: user.approved } })
    response.cookies.set('auth_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60*60*24*7 })
    return response
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }) }
}
