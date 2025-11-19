import { Redis } from "@upstash/redis";

// Check if environment variables are set
if (
  !process.env.UPSTASH_REDIS_REST_URL ||
  !process.env.UPSTASH_REDIS_REST_TOKEN
) {
  console.warn(
    "Redis environment variables are not set. Redis functionality will be limited."
  );
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// Function to test Redis connection
export async function testRedisConnection() {
  try {
    await redis.set("test", "test");
    const result = await redis.get("test");
    await redis.del("test");
    return result === "test";
  } catch (error) {
    console.error("Redis connection test failed:", error);
    return false;
  }
}

// Function to get Redis client with connection check
export async function getRedisClient() {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    throw new Error("Redis environment variables are not configured");
  }
  return redis;
}

export default redis;

