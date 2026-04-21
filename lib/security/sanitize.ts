/**
 * Centralized input sanitization.
 *
 * Every attacker-reachable input in the app MUST flow through one of these
 * primitives before being stored, rendered, or used as part of a downstream
 * identifier (Redis key, filesystem path, URL, SQL parameter).
 *
 *  - `sanitizeText`     : plain-text fields (names, descriptions, chat messages).
 *                          Strips control chars, normalizes unicode (NFKC),
 *                          removes zero-width/bidi-override chars, caps length.
 *  - `sanitizeHtml`     : bodies we intend to render as HTML. Uses DOMPurify
 *                          with an explicit allowlist; rejects javascript: etc.
 *  - `sanitizeUrl`      : any user-supplied URL. Only http(s) are allowed;
 *                          javascript:/data:/file:/vbscript:/about: are rejected.
 *  - `sanitizeFilename` : display filenames. Strips path separators, null
 *                          bytes, control chars, and leading dots.
 *  - `sanitizeRedisKey` : identifiers embedded in Redis keys. Prevents key
 *                          injection (e.g. `a:b` breaking out of a prefix).
 *  - `sanitizeUuid`     : strict UUID validation. Throws ValidationError on
 *                          any non-canonical form.
 *  - `zSanitizedText`   : Zod helper for schemas.
 */

import DOMPurify from "isomorphic-dompurify";
import { z } from "zod";
import { ValidationError } from "@/lib/errors";

// ---------------------------------------------------------------------------
// Text
// ---------------------------------------------------------------------------

const CONTROL_CHAR_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
// Zero-width + bidi-override + left-to-right/right-to-left mark characters
// used in homograph/spoofing attacks.
const INVISIBLE_RE = /[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g;

export interface SanitizeTextOptions {
  maxLen?: number;
  allowNewlines?: boolean;
}

const DEFAULT_MAX_LEN = 10_000;

/**
 * Normalize and defang a plain-text string.
 * Returns a plain string; never throws.
 */
export function sanitizeText(
  raw: unknown,
  { maxLen = DEFAULT_MAX_LEN, allowNewlines = true }: SanitizeTextOptions = {},
): string {
  if (typeof raw !== "string") return "";
  let s = raw.normalize("NFKC");
  s = s.replace(INVISIBLE_RE, "");
  s = s.replace(CONTROL_CHAR_RE, "");
  if (!allowNewlines) s = s.replace(/[\r\n]+/g, " ");
  s = s.trim();
  if (s.length > maxLen) s = s.slice(0, maxLen);
  return s;
}

// ---------------------------------------------------------------------------
// HTML
// ---------------------------------------------------------------------------

const ALLOWED_TAGS = [
  "p",
  "br",
  "b",
  "i",
  "em",
  "strong",
  "code",
  "pre",
  "a",
  "ul",
  "ol",
  "li",
  "blockquote",
  "h1",
  "h2",
  "h3",
  "span",
];
const ALLOWED_ATTR = ["href", "title", "rel", "target"];

/**
 * Sanitize an untrusted HTML fragment before rendering.
 * Uses DOMPurify with a conservative allowlist.
 */
export function sanitizeHtml(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return DOMPurify.sanitize(raw, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|#)/i,
    RETURN_TRUSTED_TYPE: false,
    FORBID_TAGS: ["style", "script", "iframe", "object", "embed"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "style"],
  });
}

// ---------------------------------------------------------------------------
// URL
// ---------------------------------------------------------------------------

const ALLOWED_URL_PROTOCOLS = new Set(["http:", "https:"]);

/**
 * Validate and return a safe URL, or throw ValidationError.
 * Protocol-relative URLs are rejected (they can resolve to anything).
 */
export function sanitizeUrl(raw: unknown): string {
  if (typeof raw !== "string") {
    throw new ValidationError("URL must be a string");
  }
  const trimmed = raw.trim();
  if (trimmed.length === 0) throw new ValidationError("URL is empty");
  if (trimmed.length > 2_048) throw new ValidationError("URL too long");
  let u: URL;
  try {
    u = new URL(trimmed);
  } catch {
    throw new ValidationError("URL is not absolute", { url: trimmed });
  }
  if (!ALLOWED_URL_PROTOCOLS.has(u.protocol)) {
    throw new ValidationError("URL protocol not allowed", {
      protocol: u.protocol,
    });
  }
  return u.toString();
}

/** Non-throwing variant that returns null on rejection. */
export function trySanitizeUrl(raw: unknown): string | null {
  try {
    return sanitizeUrl(raw);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Filename
// ---------------------------------------------------------------------------

const MAX_FILENAME_LEN = 255;

/**
 * Strip path separators, null bytes, control chars, and leading dots
 * (which hide files on POSIX). Always returns a non-empty safe name.
 */
export function sanitizeFilename(raw: unknown): string {
  let s = sanitizeText(raw, { maxLen: MAX_FILENAME_LEN, allowNewlines: false });
  // Remove any path separators and literal ".." segments.
  s = s.replace(/[\\/]+/g, "_");
  s = s.replace(/\.\.+/g, "_");
  // Windows-invalid chars and the DEL + other oddities.
  s = s.replace(/[<>:"|?*]/g, "_");
  // Strip leading dots/underscores/whitespace (prevents hidden files and
  // accidental leading `_` from the traversal defang).
  s = s.replace(/^[._\s]+/, "");
  if (s.length === 0) s = "file";
  return s;
}

// ---------------------------------------------------------------------------
// Redis key
// ---------------------------------------------------------------------------

// Note: `:` is the segment separator in our Redis key templates
// (e.g. `${prefix}:${userId}:${windowStart}`), so it MUST NOT be in the
// allowlist — otherwise a userId like `u1:flushdb` would silently break out
// of its prefix segment.
const REDIS_KEY_CHAR_RE = /[^A-Za-z0-9_-]/g;

/**
 * Escape an identifier before embedding it in a Redis key. Prevents
 * key-injection (e.g. `${prefix}:${userId}` where userId contains `:flush`).
 */
export function sanitizeRedisKey(raw: unknown, maxLen = 128): string {
  if (typeof raw !== "string") return "";
  const s = raw.replace(REDIS_KEY_CHAR_RE, "_");
  return s.length > maxLen ? s.slice(0, maxLen) : s;
}

// ---------------------------------------------------------------------------
// UUID
// ---------------------------------------------------------------------------

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function sanitizeUuid(raw: unknown): string {
  if (typeof raw !== "string" || !UUID_RE.test(raw)) {
    throw new ValidationError("Invalid UUID");
  }
  return raw.toLowerCase();
}

// ---------------------------------------------------------------------------
// Zod helpers
// ---------------------------------------------------------------------------

/**
 * A `z.string()` that sanitizes text via `sanitizeText` and requires the
 * result to be non-empty. Intended as a drop-in replacement for
 * `z.string().min(1)` on any user-facing text field.
 */
export function zSanitizedText(
  opts: SanitizeTextOptions = {},
): z.ZodType<string> {
  return z
    .string()
    .transform((v) => sanitizeText(v, opts))
    .refine((v) => v.length > 0, {
      message: "Field is empty after sanitization",
    });
}
