import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { sql } from "drizzle-orm";
import { env } from "./env";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  // Enhanced connection settings for better reliability
  connectionTimeoutMillis: 30000, // 30 seconds (further increased)
  idleTimeoutMillis: 60000, // 60 seconds (further increased)
  max: 20, // Maximum number of connections
  min: 2, // Minimum number of connections to maintain
  // Keep connections alive to prevent timeouts
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000, // 10 seconds delay
  // Query timeout to prevent hanging queries
  query_timeout: 45000, // 45 seconds
  statement_timeout: 45000, // 45 seconds for individual statements
  // Allow multiple statements in one query (useful for transactions)
  allowExitOnIdle: true,
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
