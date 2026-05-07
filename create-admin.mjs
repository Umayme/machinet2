import { PrismaClient } from './app/generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = 'admin@machinetdz.com'
  const password = 'MachiNet2026!'

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    // update role to admin just in case
    await prisma.user.update({ where: { email }, data: { role: 'admin', approved: true } })
    console.log('✅ Admin already exists — role confirmed:', email)
  } else {
    await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
        name: 'Admin MachiNet',
        role: 'admin',
        approved: true,
      }
    })
    console.log('✅ Admin created!')
  }

  console.log('\n─────────────────────────────')
  console.log('  URL   : /machinetdz-admin-2026')
  console.log('  Email :', email)
  console.log('  Pass  :', password)
  console.log('─────────────────────────────')
}

main()
  .catch(e => { console.error('❌', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
