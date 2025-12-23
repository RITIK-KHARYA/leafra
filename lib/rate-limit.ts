import { getRedisClient } from "./integrations/redis";
import { env } from "./env";
import { logger } from "./logger";

interface RateLimitConfig {
  maxRequests: number;
  windowSeconds: number;
}

class RateLimiter {
  private prefix: string;
  private config: RateLimitConfig;

  constructor(prefix: string, config: RateLimitConfig) {
    this.prefix = prefix;
    this.config = config;
  }

  async check(
    identifier: string
  ): Promise<{ success: boolean; remaining: number; reset: number }> {
    if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
      // If Redis is not configured, allow all requests
      return {
        success: true,
        remaining: this.config.maxRequests,
        reset: Date.now() + this.config.windowSeconds * 1000,
      };
    }

    try {
      const redis = await getRedisClient();
      const key = `${this.prefix}:${identifier}`;
      const windowStart = Math.floor(
        Date.now() / (this.config.windowSeconds * 1000)
      );
      const windowKey = `${key}:${windowStart}`;

      // Get current count
      const count = (await redis.get<number>(windowKey)) || 0;

      if (count >= this.config.maxRequests) {
        const reset = (windowStart + 1) * this.config.windowSeconds * 1000;
        return { success: false, remaining: 0, reset };
      }

      // Increment count
      await redis.incr(windowKey);
      await redis.expire(windowKey, this.config.windowSeconds);

      return {
        success: true,
        remaining: this.config.maxRequests - count - 1,
        reset: (windowStart + 1) * this.config.windowSeconds * 1000,
      };
    } catch (error) {
      // On error, log and decide behavior based on environment
      // In production, we might want to fail-closed, but for development
      // failing open prevents blocking legitimate requests during Redis issues
      logger.error("Rate limit check failed", error, {
        prefix: this.prefix,
        identifier,
      });
      
      // Fail-open: Allow request but log warning
      // This prevents Redis outages from blocking all requests
      // In production, consider implementing a circuit breaker pattern
      logger.warn("Rate limiting unavailable, allowing request", {
        prefix: this.prefix,
        identifier,
      });
      
      return {
        success: true,
        remaining: this.config.maxRequests,
        reset: Date.now() + this.config.windowSeconds * 1000,
      };
    }
  }
}

// Rate limiter for chat API (10 requests per 60 seconds)
export const chatRateLimiter = new RateLimiter("ratelimit:chat", {
  maxRequests: 10,
  windowSeconds: 60,
});

// Rate limiter for file upload (5 requests per 60 seconds)
export const uploadRateLimiter = new RateLimiter("ratelimit:upload", {
  maxRequests: 5,
  windowSeconds: 60,
});

// Rate limiter for general API (20 requests per 60 seconds)
export const apiRateLimiter = new RateLimiter("ratelimit:api", {
  maxRequests: 20,
  windowSeconds: 60,
});
