import { PrismaClient } from '../app/generated/prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getPrismaClient() {
  // In development, clear cache if schema changed (force restart dev server)
  if (process.env.NODE_ENV !== 'production' && globalForPrisma.prisma) {
    // Check if we need to recreate client (schema might have changed)
    // For now, return cached client - restart dev server to pick up schema changes
    return globalForPrisma.prisma
  }

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  // For Prisma 7, use the adapter with a connection pool
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  
  const client = new PrismaClient({ adapter })

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client
  }

  return client
}

export const prisma = getPrismaClient()

