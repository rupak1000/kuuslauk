import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Helper to check if Prisma/DB is available
export function getPrisma(): PrismaClient | null {
  if (!process.env.DATABASE_URL) {
    return null
  }
  return prisma
}
