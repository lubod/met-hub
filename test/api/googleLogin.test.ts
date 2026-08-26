import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { TEST_USER_ID } from "./_mocks";

// ── Imports after mocks ──────────────────────────────────────────────────────

import app from "../../server/app";

// ── Hoisted mock objects ─────────────────────────────────────────────────────

const googleMock = vi.hoisted(() => ({
  verifyIdToken: vi.fn(),
}));

const redisMock = vi.hoisted(() => ({
  connect: vi.fn(),
  get: vi.fn().mockResolvedValue(null),
  set: vi.fn().mockResolvedValue("OK"),
  hGet: vi.fn().mockResolvedValue(null),
  hSet: vi.fn().mockResolvedValue(1),
  hGetAll: vi.fn().mockResolvedValue({}),
  zAdd: vi.fn().mockResolvedValue(1),
  zRangeByScore: vi.fn().mockResolvedValue([]),
  multi: vi.fn(() => ({
    set: vi.fn().mockReturnThis(),
    zAdd: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue(["OK", 1]),
  })),
  publish: vi.fn(),
  on: vi.fn(),
}));

// ── Module mocks ─────────────────────────────────────────────────────────────

vi.mock("google-auth-library", () => ({
  OAuth2Client: class {
    verifyIdToken = googleMock.verifyIdToken;
  },
}));

vi.mock("../../server/utils", () => ({
  verifyToken: vi.fn(() => null),
  createToken: vi.fn(() => ({
    token: "jwt-token",
    createdAt: 0,
    expiresAt: Date.now() + 3600_000,
  })),
}));

vi.mock("../../server/redisClient", () => ({ default: redisMock }));

vi.mock("../../server/state", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../server/state")>();
  return {
    AppError: mod.AppError,
    allStationsCfg: {
      getStationByID: vi.fn(() => undefined),
      getStationByPasskey: vi.fn(() => undefined),
      getStationsByUser: vi.fn(() => undefined),
      getPublicStations: vi.fn(() => new Set<string>()),
      addStation: vi.fn(),
    },
  };
});

vi.mock("../../server/db", () => ({
  loadData: vi.fn().mockResolvedValue([]),
  loadRainData: vi.fn().mockResolvedValue([]),
  create: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../../server/forecast", () => ({
  getForecast: vi.fn().mockResolvedValue({}),
  getAstronomicalData: vi.fn().mockResolvedValue({}),
}));

function googlePayload(overrides: Record<string, unknown> = {}) {
  return {
    sub: TEST_USER_ID,
    email: "user@example.com",
    email_verified: true,
    given_name: "Test",
    family_name: "User",
    ...overrides,
  };
}

describe("POST /api/googleLogin", () => {
  beforeEach(() => {
    googleMock.verifyIdToken.mockReset();
    redisMock.hSet.mockClear();
  });

  it("issues a JWT cookie and stores the user record on a valid token", async () => {
    googleMock.verifyIdToken.mockResolvedValue({
      getPayload: () => googlePayload(),
    });

    const res = await request(app)
      .post("/api/googleLogin")
      .send({ token: "valid-google-id-token" });

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(TEST_USER_ID);
    expect(res.body.email).toBe("user@example.com");
    const cookie = res.headers["set-cookie"]?.[0] ?? "";
    expect(cookie).toContain("jwt=jwt-token");
    expect(redisMock.hSet).toHaveBeenCalledWith(
      "USERS",
      TEST_USER_ID,
      JSON.stringify({
        given_name: "Test",
        family_name: "User",
        email: "user@example.com",
      }),
    );
  });

  it("returns 401 when the token payload is empty", async () => {
    googleMock.verifyIdToken.mockResolvedValue({ getPayload: () => null });

    const res = await request(app)
      .post("/api/googleLogin")
      .send({ token: "token-with-empty-payload" });

    expect(res.status).toBe(401);
  });

  it("returns 401 when the Google email is not verified", async () => {
    googleMock.verifyIdToken.mockResolvedValue({
      getPayload: () => googlePayload({ email_verified: false }),
    });

    const res = await request(app)
      .post("/api/googleLogin")
      .send({ token: "unverified-email-token" });

    expect(res.status).toBe(401);
    expect(redisMock.hSet).not.toHaveBeenCalled();
  });

  it("does not leak verification errors to the client", async () => {
    googleMock.verifyIdToken.mockRejectedValue(new Error("Token used too late"));

    const res = await request(app)
      .post("/api/googleLogin")
      .send({ token: "expired-token" });

    expect(res.status).toBe(500);
    expect(res.body.msg).toBe("Internal Server Error");
    expect(JSON.stringify(res.body)).not.toContain("too late");
  });
});
