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
  const isSupabase = connectionString.includes('supabase.co')
  const isDirectConnection = isSupabase && connectionString.includes(':5432')
  const isPoolerConnection = isSupabase && (connectionString.includes(':6543') || connectionString.includes('pgbouncer=true'))
  
  if (isDirectConnection) {
    console.error(
      '❌ ERROR: Using direct Supabase connection (port 5432). This will NOT work on Vercel/serverless.\n' +
      'Please update your DATABASE_URL in Vercel to use the Connection Pooler URL (port 6543).\n' +
      'Get it from: Supabase Dashboard → Settings → Database → Connection pooling'
    )
  }

  // Build connection string with proper SSL and pooler settings
  let finalConnectionString = connectionString
  
  // For connection pooler, ensure pgbouncer mode is enabled
  if (isPoolerConnection && !connectionString.includes('pgbouncer=true')) {
    finalConnectionString = connectionString.includes('?')
      ? `${connectionString}&pgbouncer=true`
      : `${connectionString}?pgbouncer=true`
  }
  
  // Explicitly set SSL mode to avoid warnings (for Supabase/Neon)
  // This prevents the pg library warning about SSL mode semantics
  if ((isSupabase || connectionString.includes('neon.tech')) && !finalConnectionString.includes('sslmode=')) {
    finalConnectionString = finalConnectionString.includes('?')
      ? `${finalConnectionString}&sslmode=require`
      : `${finalConnectionString}?sslmode=require`
  }

  // For Prisma 7, use the adapter with a connection pool
  // Configure pool for serverless environments (Vercel, Supabase)
  const poolConfig: ConstructorParameters<typeof Pool>[0] = {
    connectionString: finalConnectionString,
    max: 1, // Serverless environments should use 1 connection per instance
    min: 0, // Allow pool to close all connections when idle
    idleTimeoutMillis: 20000, // Close idle connections after 20 seconds
    connectionTimeoutMillis: 30000, // Increased timeout for initial connection
    // SSL is handled via connection string sslmode parameter, not here
  }

  const pool = new Pool(poolConfig)
  
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

