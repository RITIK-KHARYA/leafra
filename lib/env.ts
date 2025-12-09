import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z
    .string()
    .url("DATABASE_URL must be a valid PostgreSQL connection string"),

  // Pinecone
  PINECONE_API_KEY: z.string().min(1, "PINECONE_API_KEY is required"),

  // TogetherAI
  TOGETHER_AI_API_KEY: z.string().min(1, "TOGETHER_AI_API_KEY is required"),
  TOGETHER_AI_MODEL: z.string().min(1, "TOGETHER_AI_MODEL is required"),

  // Redis (Upstash) - Optional but recommended
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // OAuth Providers - Optional
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  DISCORD_CLIENT_ID: z.string().optional(),
  DISCORD_CLIENT_SECRET: z.string().optional(),

  // Next.js Public Variables
  NEXT_PUBLIC_BASE_URL: z
    .string()
    .url()
    .optional()
    .default("http://localhost:3000"),

  // Node Environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .optional()
    .default("development"),
});

function getEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );
      throw new Error(
        `❌ Invalid environment variables:\n${missingVars.join(
          "\n"
        )}\n\nPlease check your .env.local file.`
      );
    }
    throw error;
  }
}

export const env = getEnv();
