import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

function getSecret() {
  const s = process.env.JWT_SECRET
  if (!s) throw new Error('JWT_SECRET env var is required')
  return s
}

export function signToken(payload) {
  return jwt.sign(payload, getSecret(), { expiresIn: '7d' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, getSecret())
  } catch {
    return null
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  if (!token) return null
  return verifyToken(token)
}
