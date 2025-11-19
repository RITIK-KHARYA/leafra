// db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";

// Validate database URL
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set!");
  console.log("Please add DATABASE_URL to your .env.local file");
  console.log("Format: postgresql://username:password@host:port/database");
  throw new Error("DATABASE_URL is required");
}

const client = postgres(process.env.DATABASE_URL, {
  // Add connection timeout and retry settings
  connect_timeout: 10, // 10 seconds
  idle_timeout: 30, // 30 seconds
  max: 20, // Maximum number of connections
});

export const db = drizzle(client);

// Function to test database connection
export async function testDatabaseConnection() {
  try {
    const result = await db.execute(sql`SELECT 1 as test`);
    console.log("✅ Database connection test successful:", result);
    return true;
  } catch (error) {
    console.error("❌ Database connection test failed:", error);
    return false;
  }
}
