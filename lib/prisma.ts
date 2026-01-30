import { PrismaClient } from '@/app/generated/prisma/client'
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

  // Validate connection string format for Supabase
  // Supabase connection pooler should use port 6543
  if (connectionString.includes('supabase.co') && !connectionString.includes(':6543')) {
    console.warn(
      '⚠️  Warning: Using direct Supabase connection. For Vercel/serverless, use the Connection Pooler URL (port 6543) instead of direct connection (port 5432).'
    )
  }

  // For Prisma 7, use the adapter with a connection pool
  // Configure pool for serverless environments (Vercel, Supabase)
  const pool = new Pool({
    connectionString,
    max: 1, // Serverless environments should use 1 connection per instance
    min: 0, // Allow pool to close all connections when idle
    idleTimeoutMillis: 20000, // Close idle connections after 20 seconds
    connectionTimeoutMillis: 20000, // Timeout after 20 seconds if connection can't be established
    // Add SSL for Supabase connections
    ssl: connectionString.includes('supabase.co') || connectionString.includes('neon.tech')
      ? { rejectUnauthorized: false }
      : undefined,
  })
  
  const adapter = new PrismaPg(pool)
  
  const client = new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

  // In production (serverless), don't cache the client globally
  // Each serverless function should create its own instance
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client
  }

  return client
}

export const prisma = getPrismaClient()

