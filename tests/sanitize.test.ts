import { describe, it, expect } from "vitest";
import {
  sanitizeText,
  sanitizeHtml,
  sanitizeUrl,
  trySanitizeUrl,
  sanitizeFilename,
  sanitizeRedisKey,
  sanitizeUuid,
  zSanitizedText,
} from "@/lib/security/sanitize";
import { ValidationError } from "@/lib/errors";

describe("sanitizeText", () => {
  it("trims whitespace", () => {
    expect(sanitizeText("   hi   ")).toBe("hi");
  });
  it("returns empty string on non-string input", () => {
    expect(sanitizeText(null)).toBe("");
    expect(sanitizeText(undefined)).toBe("");
    expect(sanitizeText(42)).toBe("");
  });
  it("strips zero-width + bidi-override chars used in homograph attacks", () => {
    // U+202E = right-to-left override (used to spoof filenames)
    const evil = "user\u202Enigelgn\u202D@evil.com";
    expect(sanitizeText(evil)).toBe("usernigelgn@evil.com");
  });
  it("strips null bytes and control chars", () => {
    expect(sanitizeText("a\u0000b\u0007c\u001Bd")).toBe("abcd");
  });
  it("normalizes NFKC (homoglyph collapse)", () => {
    // ﬁ ligature → "fi"
    expect(sanitizeText("of\uFB01ce")).toBe("office");
  });
  it("caps length to maxLen", () => {
    const raw = "a".repeat(100_000);
    expect(sanitizeText(raw).length).toBe(10_000);
    expect(sanitizeText(raw, { maxLen: 5 })).toBe("aaaaa");
  });
  it("collapses newlines when allowNewlines=false", () => {
    expect(sanitizeText("a\nb\r\nc", { allowNewlines: false })).toBe("a b c");
  });
  it("preserves newlines by default", () => {
    expect(sanitizeText("a\nb")).toBe("a\nb");
  });
});

describe("sanitizeHtml", () => {
  it("strips <script> tags and their contents", () => {
    const out = sanitizeHtml("<b>hi</b><script>alert(1)</script>");
    expect(out).toContain("<b>hi</b>");
    expect(out).not.toContain("<script");
    expect(out).not.toContain("alert");
  });
  it("strips event handlers", () => {
    const out = sanitizeHtml('<a href="/" onclick="evil()">x</a>');
    expect(out).not.toMatch(/onclick/i);
  });
  it("strips javascript: href", () => {
    const out = sanitizeHtml('<a href="javascript:alert(1)">x</a>');
    expect(out).not.toMatch(/javascript:/i);
  });
  it("strips style attribute (css-injection vector)", () => {
    const out = sanitizeHtml('<p style="background:url(javascript:x)">hi</p>');
    expect(out).not.toMatch(/style/i);
    expect(out).not.toMatch(/javascript/i);
  });
  it("strips iframe/object/embed tags", () => {
    const out = sanitizeHtml("<iframe src='x'></iframe><object></object>");
    expect(out).not.toMatch(/<iframe/i);
    expect(out).not.toMatch(/<object/i);
  });
  it("preserves allowlisted formatting", () => {
    const out = sanitizeHtml("<p><strong>bold</strong><em>em</em></p>");
    expect(out).toContain("<strong>bold</strong>");
    expect(out).toContain("<em>em</em>");
  });
  it("returns empty string on non-string input", () => {
    expect(sanitizeHtml(null)).toBe("");
    expect(sanitizeHtml(123)).toBe("");
  });
});

describe("sanitizeUrl", () => {
  it("accepts http / https", () => {
    expect(sanitizeUrl("http://example.com/")).toBe("http://example.com/");
    expect(sanitizeUrl("https://utfs.io/f/abc")).toBe("https://utfs.io/f/abc");
  });
  it.each([
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "file:///etc/passwd",
    "vbscript:msgbox(1)",
    "about:blank",
  ])("rejects dangerous scheme: %s", (u) => {
    expect(() => sanitizeUrl(u)).toThrow(ValidationError);
  });
  it("rejects protocol-relative URLs", () => {
    expect(() => sanitizeUrl("//evil.com/")).toThrow(ValidationError);
  });
  it("rejects relative URLs", () => {
    expect(() => sanitizeUrl("/just/a/path")).toThrow(ValidationError);
  });
  it("rejects URLs longer than 2048 chars", () => {
    expect(() => sanitizeUrl("https://a.co/" + "x".repeat(3000))).toThrow();
  });
  it("rejects non-string input", () => {
    expect(() => sanitizeUrl(null)).toThrow(ValidationError);
    expect(() => sanitizeUrl(42)).toThrow(ValidationError);
  });
  it("trySanitizeUrl returns null on rejection (non-throwing)", () => {
    expect(trySanitizeUrl("javascript:alert(1)")).toBe(null);
    expect(trySanitizeUrl("https://ok.example.com/")).toBe(
      "https://ok.example.com/",
    );
  });
});

describe("sanitizeFilename", () => {
  it("strips path separators", () => {
    // path traversal gets defanged; leading `_` is stripped for cleanliness.
    expect(sanitizeFilename("../../etc/passwd")).toBe("etc_passwd");
    expect(sanitizeFilename("a\\b/c")).toBe("a_b_c");
  });
  it("strips null bytes + control chars", () => {
    expect(sanitizeFilename("name\u0000.pdf")).toBe("name.pdf");
  });
  it("strips leading dots (no hidden files)", () => {
    expect(sanitizeFilename("...secret")).toBe("secret");
  });
  it("replaces Windows-invalid chars", () => {
    expect(sanitizeFilename('a<b>c:"d|?e*.txt')).toMatch(/^a_b_c__d__e_\.txt$/);
  });
  it("returns 'file' on empty result", () => {
    expect(sanitizeFilename("...")).toBe("file");
    expect(sanitizeFilename("")).toBe("file");
    expect(sanitizeFilename("\u0000\u0000")).toBe("file");
  });
  it("caps length", () => {
    const long = "a".repeat(500) + ".pdf";
    expect(sanitizeFilename(long).length).toBeLessThanOrEqual(255);
  });
  it("normalizes unicode homograph in filenames", () => {
    // ﬁ ligature → fi prevents duplicate display-name spoofing
    expect(sanitizeFilename("of\uFB01ce.pdf")).toBe("office.pdf");
  });
});

describe("sanitizeRedisKey", () => {
  it("allows safe identifiers", () => {
    expect(sanitizeRedisKey("user-abc_123")).toBe("user-abc_123");
    expect(sanitizeRedisKey("id:0")).toBe("id:0");
  });
  it("escapes attacker-controlled separators", () => {
    // Prevents a userId like "u1\nFLUSHDB" from breaking the prefix.
    expect(sanitizeRedisKey("u1\nFLUSHDB")).toBe("u1_FLUSHDB");
    expect(sanitizeRedisKey("u1 bad")).toBe("u1_bad");
    expect(sanitizeRedisKey("u1*glob")).toBe("u1_glob");
  });
  it("returns empty string on non-string input", () => {
    expect(sanitizeRedisKey(null)).toBe("");
  });
  it("caps length", () => {
    expect(sanitizeRedisKey("a".repeat(500), 50).length).toBe(50);
  });
});

describe("sanitizeUuid", () => {
  // A valid RFC-4122 v4 UUID (version = 4, variant = 8-b).
  const UUID = "c4d72c9e-1d1f-4e39-9c4e-1b5d6a7b8c9d";
  it("accepts canonical v4-ish UUIDs", () => {
    expect(sanitizeUuid(UUID)).toBe(UUID);
  });
  it("lowercases", () => {
    expect(sanitizeUuid(UUID.toUpperCase())).toBe(UUID);
  });
  it("rejects garbage", () => {
    expect(() => sanitizeUuid("not-a-uuid")).toThrow(ValidationError);
    expect(() => sanitizeUuid(UUID + "; DROP TABLE")).toThrow(ValidationError);
    expect(() => sanitizeUuid(null)).toThrow(ValidationError);
  });
});

describe("zSanitizedText (zod integration)", () => {
  it("normalizes and trims on parse", () => {
    expect(zSanitizedText().parse("  hi  ")).toBe("hi");
  });
  it("fails when result is empty after sanitization", () => {
    // only invisible chars → empty after strip → refine fails
    expect(() => zSanitizedText().parse("\u200B\u200B")).toThrow();
  });
  it("caps length via options", () => {
    expect(zSanitizedText({ maxLen: 10 }).parse("a".repeat(50))).toBe(
      "aaaaaaaaaa",
    );
  });
  it("composes inside z.object without stripping HTML (that is sanitizeHtml's job)", async () => {
    const { z } = await import("zod");
    const schema = z.object({ name: zSanitizedText() });
    const parsed = schema.parse({ name: "  <script>x</script>  " });
    expect(parsed.name).toBe("<script>x</script>");
  });
});
