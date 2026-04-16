import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db')

const ADMIN_EMAIL = 'oumayma.melakhessou@gmail.com'
const ADMIN_PASSWORD = 'Admin@Machinet2024'
const ADMIN_NAME = 'Oumayma Melakhessou'

const db = new Database(dbPath)

const existing = db.prepare('SELECT id, email, role FROM "User" WHERE email = ?').get(ADMIN_EMAIL)

if (existing) {
  db.prepare('UPDATE "User" SET role = ? WHERE email = ?').run('admin', ADMIN_EMAIL)
  console.log(`✓ Updated existing user to admin: ${ADMIN_EMAIL}`)
} else {
  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10)
  const id = crypto.randomUUID()
  db.prepare(`
    INSERT INTO "User" (id, email, password, name, role, createdAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, ADMIN_EMAIL, hashed, ADMIN_NAME, 'admin', new Date().toISOString())
  console.log(`✓ Admin account created: ${ADMIN_EMAIL}`)
  console.log(`  Password: ${ADMIN_PASSWORD}`)
}

db.close()
console.log('Done.')
