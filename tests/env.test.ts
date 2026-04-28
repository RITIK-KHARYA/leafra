import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// These tests prove that the env schema no longer requires LLM / embedding
// API keys at boot, and that the feature-scoped `requireEnv` guard throws a
// useful error when actually reached.

const REQUIRED_KEYS = ["DATABASE_URL"] as const;
const FEATURE_KEYS = [
  "GEMINI_AI_API_KEY",
  "SUPERMEMORY_API_KEY",
] as const;

let originalEnv: NodeJS.ProcessEnv;

beforeEach(() => {
  originalEnv = { ...process.env };
  vi.resetModules();
});

afterEach(() => {
  process.env = originalEnv;
  vi.resetModules();
});

describe("env schema - boot-time validation", () => {
  it("accepts a config that has only the required keys (no LLM keys)", async () => {
    for (const k of FEATURE_KEYS) delete process.env[k];
    process.env.DATABASE_URL = "postgres://u:p@localhost:5432/db";

    const { env } = await import("../lib/env");

    expect(env.DATABASE_URL).toBe("postgres://u:p@localhost:5432/db");
    expect(env.GEMINI_AI_API_KEY).toBeUndefined();
    expect(env.SUPERMEMORY_API_KEY).toBeUndefined();
  });

  it("treats declared-but-empty feature keys (e.g. GEMINI_AI_API_KEY=) as unset", async () => {
    // Simulates the realistic case: a user copies .env.example and leaves
    // the feature-gated keys empty. dotenv loads them as "" - the schema
    // must NOT treat that as a min(1) violation.
    process.env.DATABASE_URL = "postgres://u:p@localhost:5432/db";
    process.env.GEMINI_AI_API_KEY = "";
    process.env.SUPERMEMORY_API_KEY = "";
    process.env.UPSTASH_REDIS_REST_URL = "";
    process.env.UPSTASH_REDIS_REST_TOKEN = "";
    process.env.GOOGLE_CLIENT_ID = "";
    process.env.GOOGLE_CLIENT_SECRET = "";

    const { env } = await import("../lib/env");

    expect(() => env.DATABASE_URL).not.toThrow();
    expect(env.GEMINI_AI_API_KEY).toBeUndefined();
    expect(env.SUPERMEMORY_API_KEY).toBeUndefined();
    expect(env.UPSTASH_REDIS_REST_URL).toBeUndefined();
    expect(env.GOOGLE_CLIENT_ID).toBeUndefined();
  });

  it("still throws when a required key is missing", async () => {
    for (const k of [...REQUIRED_KEYS, ...FEATURE_KEYS]) delete process.env[k];

    const { env } = await import("../lib/env");

    expect(() => env.DATABASE_URL).toThrow(/DATABASE_URL/);
  });
});

describe("env - requireEnv guard", () => {
  it("returns the value when the feature key is set", async () => {
    process.env.DATABASE_URL = "postgres://u:p@localhost:5432/db";
    process.env.GEMINI_AI_API_KEY = "gm_abc";
    process.env.SUPERMEMORY_API_KEY = "sm_test";

    const { requireEnv } = await import("../lib/env");

    expect(requireEnv("GEMINI_AI_API_KEY", "chat")).toBe("gm_abc");
    expect(requireEnv("SUPERMEMORY_API_KEY", "supermemory")).toBe("sm_test");
  });

  it("throws a feature-scoped error when the feature key is missing", async () => {
    process.env.DATABASE_URL = "postgres://u:p@localhost:5432/db";
    delete process.env.GEMINI_AI_API_KEY;
    delete process.env.SUPERMEMORY_API_KEY;

    const { requireEnv } = await import("../lib/env");

    expect(() => requireEnv("GEMINI_AI_API_KEY", "chat streaming")).toThrow(
      /GEMINI_AI_API_KEY.*chat streaming/
    );
    expect(() => requireEnv("SUPERMEMORY_API_KEY", "supermemory")).toThrow(
      /SUPERMEMORY_API_KEY.*supermemory/
    );
  });
});

describe("logger - boot without feature keys", () => {
  it("importing logger does not trigger full env validation", async () => {
    for (const k of [...REQUIRED_KEYS, ...FEATURE_KEYS]) delete process.env[k];

    // If logger still read env.NODE_ENV at class-field-init time, the env
    // proxy would parse the whole schema and throw for DATABASE_URL.
    const { logger } = await import("../lib/logger");

    expect(() => logger.info("hello")).not.toThrow();
  });
});
