import { describe, it, expect } from "vitest";
import {
  AppError,
  AuthorizationError,
  DatabaseError,
  NotFoundError,
  ValidationError,
} from "@/lib/errors";

describe("error hierarchy", () => {
  it("AppError defaults to 500 and carries name", () => {
    const e = new AppError("boom");
    expect(e.statusCode).toBe(500);
    expect(e.name).toBe("AppError");
    expect(e).toBeInstanceOf(Error);
  });

  it("AuthorizationError defaults to 403", () => {
    const e = new AuthorizationError();
    expect(e.statusCode).toBe(403);
    expect(e.code).toBe("AUTHORIZATION_ERROR");
  });

  it("AuthorizationError accepts a custom 500 for DB failures", () => {
    const e = new AuthorizationError("DB blew up", 500);
    expect(e.statusCode).toBe(500);
  });

  it("NotFoundError is always 404", () => {
    const e = new NotFoundError("chat");
    expect(e.statusCode).toBe(404);
    expect(e.code).toBe("NOT_FOUND");
  });

  it("ValidationError carries details payload", () => {
    const e = new ValidationError("nope", { field: "chatId" });
    expect(e.statusCode).toBe(400);
    expect(e.details).toEqual({ field: "chatId" });
  });

  it("DatabaseError preserves originalError for debugging", () => {
    const cause = new Error("pg: connection refused");
    const e = new DatabaseError("tx failed", cause);
    expect(e.originalError).toBe(cause);
    expect(e.statusCode).toBe(500);
  });

  it("instanceof chain is correct for narrowing in API handlers", () => {
    const a = new AuthorizationError();
    const n = new NotFoundError();
    const v = new ValidationError("x");
    expect(a instanceof AppError).toBe(true);
    expect(n instanceof AppError).toBe(true);
    expect(v instanceof AppError).toBe(true);
    expect(a instanceof NotFoundError).toBe(false);
    expect(n instanceof AuthorizationError).toBe(false);
  });
});
