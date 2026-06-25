import { describe, it, expect, vi } from "vitest";

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

describe("CORS Configuration", () => {
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
});
