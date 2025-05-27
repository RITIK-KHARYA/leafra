// db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL!); // ⬅️ Supabase connection URL
export const db = drizzle(client);
