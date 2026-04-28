import { z } from "zod";

// dotenv loads declared-but-empty `.env` lines (e.g. `GEMINI_AI_API_KEY=`) as
// the empty string. For optional schemas, we want that to behave the same
// as "not set" rather than trigger `.min(1)` validation failures.
const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === "" ? undefined : v), schema);

const envSchema = z.object({
  // Database (required - app cannot start without it)
  DATABASE_URL: z
    .string()
    .url("DATABASE_URL must be a valid PostgreSQL connection string"),

  // Pinecone (required - retrieval is core)w
  PINECONE_API_KEY: z.string().min(1, "PINECONE_API_KEY is required"),

  // LLM / embedding providers are optional at boot because the app can
  // render marketing / auth / dashboard pages without them. They are
  // asserted at their call sites (chat route, worker, pinecone query)
  // with clear, feature-specific error messages.
  //
  // NOTE on `emptyToUndefined`: users will often follow `.env.example` and
  // leave these keys declared but empty (e.g. `GEMINI_AI_API_KEY=`). dotenv
  // loads those as `""`, which `z.string().min(1)` would reject. The
  // preprocess step coerces `""` to `undefined` so they're treated as
  // "not set" rather than "invalid".
  GEMINI_AI_API_KEY: emptyToUndefined(z.string().min(1).optional()),

  // Redis (Upstash) - Optional
  UPSTASH_REDIS_REST_URL: emptyToUndefined(z.string().url().optional()),
  UPSTASH_REDIS_REST_TOKEN: emptyToUndefined(z.string().optional()),

  // OAuth Providers - Optional
  GOOGLE_CLIENT_ID: emptyToUndefined(z.string().optional()),
  GOOGLE_CLIENT_SECRET: emptyToUndefined(z.string().optional()),
  GITHUB_CLIENT_ID: emptyToUndefined(z.string().optional()),
  GITHUB_CLIENT_SECRET: emptyToUndefined(z.string().optional()),
  DISCORD_CLIENT_ID: emptyToUndefined(z.string().optional()),
  DISCORD_CLIENT_SECRET: emptyToUndefined(z.string().optional()),

  // Next.js Public Variables
  NEXT_PUBLIC_BASE_URL: z
    .string()
    .url()
    .optional()
    .default(
      process.env.NODE_ENV === "production"
        ? "https://leafra-eight.vercel.app"
        : "http://localhost:3000"
    ),

  // Node Environment
  NODE_ENV: z.enum(["development", "production", "test"]).optional().default("development"),
});

type Env = z.infer<typeof envSchema>;

function getEnv(): Env {
  let validatedEnv: Env | null = null;

  const validateEnv = (): Env => {
    if (validatedEnv) return validatedEnv;

    const result = envSchema.safeParse(process.env);
    if (result.success) {
      validatedEnv = result.data;
      return validatedEnv;
    }

    const missingVars = result.error.errors.map(
      (err) => `${err.path.join(".")}: ${err.message}`
    );
    throw new Error(
      `Invalid environment variables:\n${missingVars.join(
        "\n"
      )}\n\nPlease check your .env.local file against .env.example.`
    );
  };

  return new Proxy({} as Env, {
    get(_target, prop) {
      return validateEnv()[prop as keyof Env];
    },
  });
}

export const env = getEnv();

/**
 * Assert that an optional env var is present. Use this at the entry point
 * of any feature that requires the value, so the user gets a clear,
 * feature-scoped error instead of a cryptic boot-time failure.
 */
export function requireEnv<K extends keyof Env>(
  key: K,
  feature: string
): NonNullable<Env[K]> {
  const value = env[key];
  if (value === undefined || value === null || value === "") {
    throw new Error(
      `Missing required env var ${String(
        key
      )} for ${feature}. Set it in .env.local (see .env.example).`
    );
  }
  return value as NonNullable<Env[K]>;
}
