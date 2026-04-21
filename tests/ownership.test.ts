import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the db module before importing ensureChatOwnership
const selectMock = vi.fn();
vi.mock("@/lib/db", () => ({
  db: {
    select: (..._args: unknown[]) => ({
      from: () => ({
        where: () => ({
          limit: async () => selectMock(),
        }),
      }),
    }),
  },
}));

// Silence logger in tests
vi.mock("@/lib/logger", () => ({
  logger: { error: () => {}, warn: () => {}, info: () => {}, debug: () => {} },
}));

import { ensureChatOwnership } from "@/lib/services/auth/chat-authorization";
import { AuthorizationError, NotFoundError } from "@/lib/errors";

beforeEach(() => {
  selectMock.mockReset();
});

describe("ensureChatOwnership", () => {
  it("passes silently when the user owns the chat", async () => {
    selectMock.mockResolvedValue([{ id: "c1", userId: "u1" }]);
    await expect(ensureChatOwnership("c1", "u1")).resolves.toBeUndefined();
  });

  it("throws NotFoundError (404) when no row exists", async () => {
    selectMock.mockResolvedValue([]);
    await expect(ensureChatOwnership("missing", "u1")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("throws AuthorizationError (403) when a different user owns it", async () => {
    selectMock.mockResolvedValue([{ id: "c1", userId: "other" }]);
    const err = await ensureChatOwnership("c1", "u1").catch((e) => e);
    expect(err).toBeInstanceOf(AuthorizationError);
    expect(err.statusCode).toBe(403);
  });

  it("wraps DB errors in AuthorizationError(500) and never leaks internals", async () => {
    selectMock.mockRejectedValue(new Error("connection refused"));
    const err = await ensureChatOwnership("c1", "u1").catch((e) => e);
    expect(err).toBeInstanceOf(AuthorizationError);
    expect(err.statusCode).toBe(500);
    expect(err.message).not.toContain("connection refused");
  });

  it("uses strict equality on userId (no prefix matching)", async () => {
    selectMock.mockResolvedValue([{ id: "c1", userId: "u10" }]);
    const err = await ensureChatOwnership("c1", "u1").catch((e) => e);
    expect(err).toBeInstanceOf(AuthorizationError);
  });
});
