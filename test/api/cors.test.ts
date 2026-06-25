import { describe, it, expect, vi } from "vitest";
import request from "supertest";

// ── Hoisted mocks ─────────────────────────────────────────────────────────────

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
  on: vi.fn(),
}));

// ── Module mocks ──────────────────────────────────────────────────────────────

vi.mock("../../server/utils", () => ({
  verifyToken: vi.fn(() => null),
  createToken: vi.fn(() => ({ token: "t", createdAt: 0, expiresAt: 0 })),
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
  create: vi.fn(),
}));

vi.mock("../../server/forecast", () => ({
  getForecast: vi.fn().mockResolvedValue({}),
  getAstronomicalData: vi.fn().mockResolvedValue({}),
}));

describe("App Security Configuration", () => {
  it("throws an error on import if CORS_ORIGIN is missing and ENV is not dev", async () => {
    // Save original env
    const originalEnv = process.env.ENV;
    const originalCorsOrigin = process.env.CORS_ORIGIN;

    // Set non-dev environment and clear CORS_ORIGIN
    process.env.ENV = "prod";
    delete process.env.CORS_ORIGIN;

    // Reset module registry so app.ts is re-executed
    vi.resetModules();

    // Expecting the import to throw an error
    await expect(import("../../server/app")).rejects.toThrow(
      "CORS_ORIGIN environment variable is not set"
    );

    // Restore env
    process.env.ENV = originalEnv;
    process.env.CORS_ORIGIN = originalCorsOrigin;
  });

  it("does not throw on import if CORS_ORIGIN is missing but ENV is dev", async () => {
    const originalEnv = process.env.ENV;
    const originalCorsOrigin = process.env.CORS_ORIGIN;

    process.env.ENV = "dev";
    delete process.env.CORS_ORIGIN;

    vi.resetModules();

    // Should load successfully without error
    const mod = await import("../../server/app");
    expect(mod.default).toBeDefined();

    process.env.ENV = originalEnv;
    process.env.CORS_ORIGIN = originalCorsOrigin;
  });

  it("enforces strict rate limits on ingest routes, but keeps read routes accessible", async () => {
    const originalEnv = process.env.ENV;
    const originalLimit = process.env.INGEST_RATE_LIMIT;
    process.env.ENV = "dev";
    process.env.INGEST_RATE_LIMIT = "5";

    vi.resetModules();
    const appMod = await import("../../server/app");
    const app = appMod.default;

    // Send requests up to the limit (all should return something other than 429)
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(request(app).post("/setData").send({}));
    }
    const results = await Promise.all(promises);
    for (const r of results) {
      expect(r.status).not.toBe(429);
    }

    // The next request to /setData should be blocked with 429
    const blockedRes = await request(app).post("/setData").send({});
    expect(blockedRes.status).toBe(429);
    expect(blockedRes.body).toEqual({ code: 429, msg: "Too many ingestion requests from this IP" });

    // But read routes (e.g. /api/getUserProfile) should still be accessible and not return 429
    const readRes = await request(app).get("/api/getUserProfile");
    expect(readRes.status).not.toBe(429);

    process.env.ENV = originalEnv;
    process.env.INGEST_RATE_LIMIT = originalLimit;
  });

  it("rejects JSON payloads larger than 32kb with 413 Payload Too Large", async () => {
    vi.resetModules();
    const appMod = await import("../../server/app");
    const app = appMod.default;

    // Generate a payload slightly larger than 32kb
    const largeStr = "a".repeat(33 * 1024);
    const res = await request(app)
      .post("/setData")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ data: largeStr }));

    expect(res.status).toBe(413);
  });
});
