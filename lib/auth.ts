import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db"; // your drizzle instance
import { user } from "@/lib/db/schema";
import { session } from "@/lib/db/schema";
import { account } from "@/lib/db/schema";
import { verification } from "@/lib/db/schema";
import { env } from "./env";

const socialProviders: Record<
  string,
  { clientId: string; clientSecret: string }
> = {};

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  };
}

if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
  };
}

if (env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET) {
  socialProviders.discord = {
    clientId: env.DISCORD_CLIENT_ID,
    clientSecret: env.DISCORD_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: {
      user: user,
      session: session,
      verification: verification,
      account: account,
    },
  }),
  baseURL: env.NEXT_PUBLIC_BASE_URL,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  socialProviders:
    Object.keys(socialProviders).length > 0 ? socialProviders : undefined,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
    // Add session expiration to prevent stale sessions
    expiresIn: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },
  // Add rate limiting to prevent database overload
  rateLimit: {
    window: 10 * 60 * 1000, // 10 minutes
    max: 100, // max requests per window
  },
});
