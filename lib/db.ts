import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { sql } from "drizzle-orm";
import { env } from "./env";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  // Add connection timeout and retry settings
  connectionTimeoutMillis: 10000, // 10 seconds
  idleTimeoutMillis: 30000, // 30 seconds
  max: 20, // Maximum number of connections
});

// Test database connection on startup
pool.on("connect", () => {
  console.log("✅ Database connection established");
});

pool.on("error", (err) => {
  console.error("❌ Database connection error:", err);
});

pool.on("remove", () => {
  console.log("Database connection removed from pool");
});

export const db = drizzle(pool);

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
