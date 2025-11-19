# Redis and Database Configuration Setup

## Environment Variables Required

Create a `.env.local` file in your project root with the following variables:

```bash
# Redis Configuration (Upstash)
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token-here

# Database Configuration (Supabase)
DATABASE_URL=postgresql://username:password@host:port/database

# AI Configuration
TOGETHER_AI_MODEL=your-model-name
TOGETHER_AI_API_KEY=your-together-ai-api-key
```

## How to Get Redis Credentials

1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a new Redis database or select an existing one
3. Copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from your database details

## How to Get Database Credentials

1. Go to [Supabase Console](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings > Database
4. Copy the connection string from "Connection string" section
5. The format should be: `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres`

## Important Notes

- The `UPSTASH_REDIS_REST_URL` should be in the format: `https://your-instance.upstash.io`
- The `UPSTASH_REDIS_REST_TOKEN` is your authentication token
- The `DATABASE_URL` should be a valid PostgreSQL connection string
- Make sure your `.env.local` file is in the project root directory
- Restart your development server after adding environment variables

## Troubleshooting

### Redis Connection Issues

If you see the error `getaddrinfo ENOTFOUND enough-crayfish-53569.upstash.io`:

1. Check that your `.env.local` file exists and has the correct values
2. Verify that the Redis instance is active in your Upstash console
3. Ensure there are no typos in the hostname
4. Try pinging the hostname to verify DNS resolution

### Database Connection Issues

If you see the error `getaddrinfo ENOTFOUND db.qzefoorlyfytdktgaxba.supabase.co`:

1. Check that your `DATABASE_URL` is correct in `.env.local`
2. Verify that your Supabase project is active and not paused
3. Ensure the database password is correct
4. Check if your IP is whitelisted in Supabase (if you have IP restrictions)

## Testing Connections

### Test Redis Connection

```typescript
import { testRedisConnection } from "@/lib/redis";

// Test the connection
const isConnected = await testRedisConnection();
console.log("Redis connected:", isConnected);
```

### Test Database Connection

```typescript
import { db } from "@/lib/db";

// Test the connection
try {
  const result = await db.execute(sql`SELECT 1 as test`);
  console.log("Database connected:", result);
} catch (error) {
  console.error("Database connection failed:", error);
}
```

## Common Issues and Solutions

1. **Environment variables not loading**: Make sure the file is named `.env.local` (not `.env`)
2. **Database connection timeout**: Check your Supabase project status and connection limits
3. **Redis connection refused**: Verify your Upstash Redis instance is active
4. **Permission denied**: Check if your database user has the necessary permissions
