import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { DatabaseError } from "@/lib/errors";

// Extract the transaction type from db.transaction
type TransactionType = Parameters<Parameters<typeof db.transaction>[0]>[0];

/**
 * Executes a function within a database transaction
 * @param callback - Function to execute within the transaction
 * @returns The result of the callback function
 * @throws DatabaseError if the transaction fails
 */
export async function withTransaction<T>(
  callback: (tx: TransactionType) => Promise<T>
): Promise<T> {
  try {
    // Drizzle ORM with node-postgres supports transactions
    // The transaction will automatically rollback on error
    return await db.transaction(async (tx) => {
      return await callback(tx);
    });
  } catch (error) {
    logger.error("Transaction failed", error);
    throw new DatabaseError("Database transaction failed", error);
  }
}

/**
 * Retries a database operation with exponential backoff
 * @param operation - Function to retry
 * @param maxRetries - Maximum number of retries (default: 3)
 * @param initialDelay - Initial delay in milliseconds (default: 100)
 * @returns The result of the operation
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 100
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt);
        logger.warn(`Operation failed, retrying in ${delay}ms`, {
          attempt: attempt + 1,
          maxRetries,
          error,
        });
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
