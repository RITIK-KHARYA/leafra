import { describe, it, expect, vi } from "vitest";
import { withRetry } from "@/lib/db/transactions";

describe("withRetry", () => {
  it("returns value on first success (no retries)", async () => {
    const op = vi.fn().mockResolvedValue(42);
    const out = await withRetry(op, 3, 1);
    expect(out).toBe(42);
    expect(op).toHaveBeenCalledTimes(1);
  });

  it("retries and eventually succeeds", async () => {
    let calls = 0;
    const op = vi.fn(async () => {
      calls++;
      if (calls < 3) throw new Error("transient");
      return "ok";
    });
    const out = await withRetry(op, 3, 1);
    expect(out).toBe("ok");
    expect(op).toHaveBeenCalledTimes(3);
  });

  it("re-throws the last error after exhausting retries", async () => {
    const err = new Error("permanent");
    const op = vi.fn().mockRejectedValue(err);
    await expect(withRetry(op, 2, 1)).rejects.toBe(err);
    // maxRetries = 2 → initial call + 2 retries = 3 total
    expect(op).toHaveBeenCalledTimes(3);
  });

  it("uses exponential backoff between attempts", async () => {
    const op = vi.fn().mockRejectedValue(new Error("x"));
    const t0 = Date.now();
    await withRetry(op, 2, 25).catch(() => {});
    const elapsed = Date.now() - t0;
    // 25 + 50 = 75ms minimum of real delay
    expect(elapsed).toBeGreaterThanOrEqual(70);
  });

  it("handles concurrent retry chains independently", async () => {
    const a = vi
      .fn()
      .mockRejectedValueOnce(new Error("a"))
      .mockResolvedValue("A");
    const b = vi
      .fn()
      .mockRejectedValueOnce(new Error("b"))
      .mockResolvedValue("B");
    const [ra, rb] = await Promise.all([withRetry(a, 2, 1), withRetry(b, 2, 1)]);
    expect(ra).toBe("A");
    expect(rb).toBe("B");
    expect(a).toHaveBeenCalledTimes(2);
    expect(b).toHaveBeenCalledTimes(2);
  });
});
