import { neon } from "@neondatabase/serverless"

export const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null

// Helper function to check if database is connected
export async function checkDatabaseConnection() {
  if (!sql) {
    console.warn("DATABASE_URL not set - using local data")
    return false
  }
  try {
    await sql`SELECT 1`
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}

// Helper to check if DB is available
export function isDatabaseAvailable() {
  return !!process.env.DATABASE_URL && sql !== null
}

export function getDb() {
  if (!process.env.DATABASE_URL) {
    return null
  }
  return sql
}
