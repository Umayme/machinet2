import { defineConfig } from 'prisma/config'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load .env manually so DATABASE_URL is available at config evaluation time
try {
  const env = readFileSync(resolve(process.cwd(), '.env'), 'utf-8')
  for (const line of env.split('\n')) {
    const match = line.match(/^([^#=][^=]*)=["']?(.+?)["']?\s*$/)
    if (match) process.env[match[1].trim()] = match[2].trim()
  }
} catch {}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL!,
  },
})
