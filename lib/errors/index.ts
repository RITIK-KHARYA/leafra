/**
 * Base error class for application errors
 */
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Database operation errors
 */
export class DatabaseError extends AppError {
  constructor(message: string, public originalError?: unknown) {
    super(message, 500, "DATABASE_ERROR");
  }
}

/**
 * Authorization/permission errors
 */
export class AuthorizationError extends AppError {
  constructor(message: string = "Unauthorized", statusCode: number = 403) {
    super(message, statusCode, "AUTHORIZATION_ERROR");
  }
}

/**
 * Validation errors
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    public details?: unknown,
    statusCode: number = 400
  ) {
    super(message, statusCode, "VALIDATION_ERROR");
  }
}

/**
 * Not found errors
 */
export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}

