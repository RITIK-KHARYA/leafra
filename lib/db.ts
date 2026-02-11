import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { sql } from "drizzle-orm";
import { env } from "./env";

const isProduction = env.NODE_ENV === "production";
const isDevelopment = env.NODE_ENV === "development";

// Environment-specific connection pool settings
const poolConfig = isProduction
  ? {
      // Production: Optimized for performance and reliability
      connectionTimeoutMillis: 30000, // 30 seconds
      idleTimeoutMillis: 60000, // 60 seconds
      max: 20, // Maximum number of connections (higher for production)
      min: 5, // Minimum connections to maintain (higher for production)
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000, // 10 seconds
      query_timeout: 45000, // 45 seconds
      statement_timeout: 45000, // 45 seconds
      allowExitOnIdle: false, // Keep connections alive in production
    }
  : {
      // Development: More relaxed settings for easier debugging
      connectionTimeoutMillis: 10000, // 10 seconds (faster failure in dev)
      idleTimeoutMillis: 30000, // 30 seconds (shorter timeout in dev)
      max: 10, // Fewer connections needed in development
      min: 1, // Minimum connections (lower for dev)
      keepAlive: true,
      keepAliveInitialDelayMillis: 5000, // 5 seconds
      query_timeout: 30000, // 30 seconds (shorter in dev)
      statement_timeout: 30000, // 30 seconds
      allowExitOnIdle: true, // Allow exit on idle in development
    };

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ...poolConfig,
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
