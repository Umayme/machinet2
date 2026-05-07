import pg from 'pg'
import bcrypt from 'bcryptjs'
import { readFileSync } from 'fs'

// Load .env manually
try {
  const env = readFileSync('.env', 'utf8')
  env.split('\n').forEach(line => {
    const m = line.match(/^([^=]+)=["']?([^"'\n]+)["']?/)
    if (m) process.env[m[1].trim()] = m[2].trim()
  })
} catch {}

const { Pool } = pg
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const email = 'machinetdz@gmail.com'
const newPassword = 'MachiNet2026'

const hash = await bcrypt.hash(newPassword, 10)
const { rows } = await pool.query('SELECT id FROM "User" WHERE email = $1', [email])

if (rows.length === 0) {
  const { randomUUID } = await import('crypto')
  await pool.query(
    `INSERT INTO "User" (id, email, password, name, role, approved, "createdAt") VALUES ($1,$2,$3,'Admin MachiNet','admin',true,NOW())`,
    [randomUUID(), email, hash]
  )
  console.log('Created admin user')
} else {
  await pool.query(
    `UPDATE "User" SET password=$1, role='admin', approved=true WHERE email=$2`,
    [hash, email]
  )
  console.log('Updated existing user')
}

console.log('Done!')
console.log('Email   :', email)
console.log('Password: MachiNet2026')
await pool.end()
