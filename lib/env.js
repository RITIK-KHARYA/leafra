"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
var zod_1 = require("zod");
var envSchema = zod_1.z.object({
    // Database
    DATABASE_URL: zod_1.z
        .string()
        .url("DATABASE_URL must be a valid PostgreSQL connection string"),
    // Pinecone
    PINECONE_API_KEY: zod_1.z.string().min(1, "PINECONE_API_KEY is required"),
    // TogetherAI
    TOGETHER_AI_API_KEY: zod_1.z.string().min(1, "TOGETHER_AI_API_KEY is required"),
    TOGETHER_AI_MODEL: zod_1.z.string().min(1, "TOGETHER_AI_MODEL is required"),
    // Redis (Upstash) - Optional but recommended
    UPSTASH_REDIS_REST_URL: zod_1.z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: zod_1.z.string().optional(),
    // OAuth Providers - Optional
    GOOGLE_CLIENT_ID: zod_1.z.string().optional(),
    GOOGLE_CLIENT_SECRET: zod_1.z.string().optional(),
    GITHUB_CLIENT_ID: zod_1.z.string().optional(),
    GITHUB_CLIENT_SECRET: zod_1.z.string().optional(),
    DISCORD_CLIENT_ID: zod_1.z.string().optional(),
    DISCORD_CLIENT_SECRET: zod_1.z.string().optional(),
    // Next.js Public Variables
    NEXT_PUBLIC_BASE_URL: zod_1.z
        .string()
        .url()
        .optional()
        .default("http://localhost:3000"),
    // Node Environment
    NODE_ENV: zod_1.z
        .enum(["development", "production", "test"])
        .optional()
        .default("development"),
});
function getEnv() {
    // Lazy validation - only validate when accessed, not on import
    var validatedEnv = null;
    var validateEnv = function () {
        if (validatedEnv)
            return validatedEnv;
        try {
            validatedEnv = envSchema.parse(process.env);
            return validatedEnv;
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                var missingVars = error.errors.map(function (err) { return "".concat(err.path.join("."), ": ").concat(err.message); });
                throw new Error("\u274C Invalid environment variables:\n".concat(missingVars.join("\n"), "\n\nPlease check your .env.local file."));
            }
            throw error;
        }
    };
    // Return a proxy that validates on first access
    return new Proxy({}, {
        get: function (target, prop) {
            return validateEnv()[prop];
        },
    });
}
exports.env = getEnv();
