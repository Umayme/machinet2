import { PrismaClient } from './app/generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = 'machinetdz@gmail.com'

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    console.log('❌ User not found:', email)
    return
  }

  await prisma.user.update({
    where: { email },
    data: { role: 'admin', approved: true }
  })

  console.log('✅ Done!')
  console.log('─────────────────────────────')
  console.log('  URL   : /machinetdz-admin-2026')
  console.log('  Email :', email)
  console.log('  Pass  : (your existing password)')
  console.log('─────────────────────────────')
}

main()
  .catch(e => { console.error('❌', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
