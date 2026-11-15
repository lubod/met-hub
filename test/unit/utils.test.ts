import { describe, it, expect, vi, afterEach } from "vitest";
import jwt from "jsonwebtoken";
import { createToken, verifyToken } from "../../server/utils";

describe("JWT token utilities (utils.ts)", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("creates a signed token with a 7-day expiry and verifies it", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-15T10:00:00.000Z"));

    const result = createToken("user-123");
    expect(typeof result.token).toBe("string");
    expect(result.expiresAt - result.createdAt).toBe(7 * 86_400 * 1000);

    const decoded = verifyToken(result.token);
    expect(decoded).not.toBeNull();
    expect(decoded?.id).toBe("user-123");
  });

  it("returns null for tampered, malformed, or empty tokens", () => {
    const { token } = createToken("user-123");

    expect(verifyToken(`${token}tampered`)).toBeNull();
    expect(verifyToken("not-a-jwt")).toBeNull();
    expect(verifyToken("")).toBeNull();
    expect(verifyToken(null)).toBeNull();
    expect(verifyToken(undefined)).toBeNull();
  });

  it("returns null when a token is expired", () => {
    const expired = jwt.sign(
      { id: "user-123", exp: Math.floor(Date.now() / 1000) - 60 },
      process.env.MY_JWT_SECRET as string,
    );
    expect(verifyToken(expired)).toBeNull();
  });
});
