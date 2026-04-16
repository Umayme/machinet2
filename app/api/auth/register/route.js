import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { signToken } from '@/lib/auth'
import { sendWelcomeEmail } from '@/lib/email'
import { randomBytes } from 'crypto'

function cuid() {
  // simple cuid-like ID
  return 'c' + randomBytes(16).toString('hex')
}

export async function POST(request) {
  try {
    const { email, password, name, phone, company, wilaya, sector, role } =
      await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, mot de passe et nom sont requis' },
        { status: 400 }
      )
    }

    // Validate role — only buyer/seller allowed at public registration.
    // Consultant and admin roles are granted by existing admins only.
    const validRoles = ['buyer', 'seller']
    const userRole = validRoles.includes(role) ? role : 'buyer'

    // Minimum password strength
    if (typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: 'Un compte avec cet email existe déjà' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const now = new Date().toISOString()
    const id = cuid()

    // Buyers are auto-approved; sellers and consultants need admin approval
    const approved = userRole === 'buyer' ? 1 : 0

    // Use raw SQL to insert with the new approved field
    await prisma.$executeRawUnsafe(
      `INSERT INTO User (id, email, password, name, phone, company, wilaya, sector, role, approved, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id, email, hashedPassword, name,
      phone || null, company || null, wilaya || null, sector || null,
      userRole, approved, now
    )

    const token = signToken({ id, email, role: userRole })

    // Send welcome email (non-blocking)
    sendWelcomeEmail({ name, email, role: userRole }).catch(err =>
      console.error('Welcome email failed:', err.message)
    )

    const response = NextResponse.json({
      success: true,
      user: { id, email, name, role: userRole, approved: Boolean(approved) },
    })

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
