import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// These tests prove that the env schema no longer requires LLM / embedding
// API keys at boot, and that the feature-scoped `requireEnv` guard throws a
// useful error when actually reached.

const REQUIRED_KEYS = ["DATABASE_URL", "PINECONE_API_KEY"] as const;
const FEATURE_KEYS = [
  "PREM_API_KEY",
  "DEEPSEEK_API_KEY",
  "GEMINI_AI_API_KEY",
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
    process.env.PINECONE_API_KEY = "pk_123";

    const { env } = await import("../lib/env");

    expect(env.DATABASE_URL).toBe("postgres://u:p@localhost:5432/db");
    expect(env.PREM_API_KEY).toBeUndefined();
    expect(env.DEEPSEEK_API_KEY).toBeUndefined();
    expect(env.GEMINI_AI_API_KEY).toBeUndefined();
  });

  it("still throws when a required key is missing", async () => {
    for (const k of [...REQUIRED_KEYS, ...FEATURE_KEYS]) delete process.env[k];
    process.env.PINECONE_API_KEY = "pk_123";

    const { env } = await import("../lib/env");

    expect(() => env.DATABASE_URL).toThrow(/DATABASE_URL/);
  });
});

describe("env - requireEnv guard", () => {
  it("returns the value when the feature key is set", async () => {
    process.env.DATABASE_URL = "postgres://u:p@localhost:5432/db";
    process.env.PINECONE_API_KEY = "pk_123";
    process.env.DEEPSEEK_API_KEY = "ds_abc";

    const { requireEnv } = await import("../lib/env");

    expect(requireEnv("DEEPSEEK_API_KEY", "chat")).toBe("ds_abc");
  });

  it("throws a feature-scoped error when the feature key is missing", async () => {
    process.env.DATABASE_URL = "postgres://u:p@localhost:5432/db";
    process.env.PINECONE_API_KEY = "pk_123";
    delete process.env.DEEPSEEK_API_KEY;

    const { requireEnv } = await import("../lib/env");

    expect(() => requireEnv("DEEPSEEK_API_KEY", "chat streaming")).toThrow(
      /DEEPSEEK_API_KEY.*chat streaming/
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
