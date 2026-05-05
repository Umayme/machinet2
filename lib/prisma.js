import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPostgres } from '@prisma/adapter-pg'

const adapter = new PrismaPostgres({
  connectionString: process.env.DATABASE_URL,
})

const globalForPrisma = globalThis

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
