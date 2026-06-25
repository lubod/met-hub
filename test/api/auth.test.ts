import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import {
  TEST_USER_ID,
  TEST_ADMIN_ID,
  userPayload,
  adminPayload,
} from "./_mocks";
import { allStationsCfg } from "../../server/state";

// ── Hoisted mock objects (available inside vi.mock factories) ────────────────

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

const mockVerifyToken = vi.hoisted(() => vi.fn(() => null as any));

// ── Module mocks ─────────────────────────────────────────────────────────────

vi.mock("../../server/utils", () => ({
  verifyToken: mockVerifyToken,
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

// ── Imports after mocks ──────────────────────────────────────────────────────

import app from "../../server/app";

// ── Tests ────────────────────────────────────────────────────────────────────

describe("GET /api/getUserProfile", () => {
  beforeEach(() => {
    mockVerifyToken.mockReturnValue(null);
    redisMock.hGet.mockResolvedValue(null);
  });

  it("returns null when no JWT cookie is present", async () => {
    const res = await request(app).get("/api/getUserProfile");
    expect(res.status).toBe(200);
    expect(res.body).toBeNull();
  });

  it("returns null when JWT is invalid", async () => {
    mockVerifyToken.mockReturnValue(null);
    const res = await request(app)
      .get("/api/getUserProfile")
      .set("Cookie", "jwt=bad-token");
    expect(res.status).toBe(200);
    expect(res.body).toBeNull();
  });

  it("returns user profile when JWT is valid and user exists in Redis", async () => {
    mockVerifyToken.mockReturnValue(userPayload());
    redisMock.hGet.mockImplementation(async (_hash: string, key: string) => {
      if (key === TEST_USER_ID) {
        return JSON.stringify({ given_name: "Jan", family_name: "Novak" });
      }
      return null;
    });

    const res = await request(app)
      .get("/api/getUserProfile")
      .set("Cookie", "jwt=valid-token");

    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe(TEST_USER_ID);
    expect(res.body.user.given_name).toBe("Jan");
  });

  it("includes admin info when logged-in user is admin", async () => {
    mockVerifyToken.mockReturnValue(adminPayload());
    redisMock.hGet.mockImplementation(async (_hash: string, key: string) => {
      if (key === TEST_ADMIN_ID) {
        return JSON.stringify({ given_name: "Admin", family_name: "User" });
      }
      if (key === "admin") {
        return TEST_ADMIN_ID;
      }
      return null;
    });

    const res = await request(app)
      .get("/api/getUserProfile")
      .set("Cookie", "jwt=admin-token");

    expect(res.status).toBe(200);
    expect(res.body.admin).toBe(TEST_ADMIN_ID);
    expect(res.body.user.id).toBe(TEST_ADMIN_ID);
  });

  it("returns null when JWT is valid but user is not in Redis (deleted)", async () => {
    mockVerifyToken.mockReturnValue(userPayload());
    redisMock.hGet.mockResolvedValue(null);

    const res = await request(app)
      .get("/api/getUserProfile")
      .set("Cookie", "jwt=valid-token");

    expect(res.status).toBe(200);
    expect(res.body).toBeNull();
  });
});

describe("GET /api/logout", () => {
  it("clears the JWT cookie and returns 200", async () => {
    const res = await request(app)
      .get("/api/logout")
      .set("Cookie", "jwt=some-token");

    expect(res.status).toBe(200);
    const setCookie = res.headers["set-cookie"] as string[] | string | undefined;
    const cookieStr = Array.isArray(setCookie) ? setCookie.join(";") : (setCookie ?? "");
    expect(cookieStr).toMatch(/jwt/);
    expect(cookieStr).toMatch(/Expires=Thu, 01 Jan 1970|Max-Age=0/i);
  });
});

describe("GET /api/getAllStationsCfg", () => {
  beforeEach(() => {
    mockVerifyToken.mockReturnValue(null);
    redisMock.hGet.mockResolvedValue(null);
    vi.mocked(allStationsCfg.getPublicStations).mockReturnValue(new Set<string>());
    vi.mocked(allStationsCfg.getStationByID).mockReturnValue(undefined);
    vi.mocked(allStationsCfg.getStationsByUser).mockReturnValue(undefined);
  });

  it("returns empty array when no public stations and not authenticated", async () => {
    const res = await request(app).get("/api/getAllStationsCfg");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("does not return owner for public stations when not authenticated", async () => {
    vi.mocked(allStationsCfg.getPublicStations).mockReturnValue(new Set(["station1"]));
    vi.mocked(allStationsCfg.getStationByID).mockReturnValue({
      id: "station1",
      lat: 50.08,
      lon: 14.43,
      place: "Test Station",
      type: "GoGen Me 3900",
      public: true,
      owner: "some-owner-id",
    } as any);

    const res = await request(app).get("/api/getAllStationsCfg");
    expect(res.status).toBe(200);
    expect(res.body[0].owner).toBeUndefined();
    expect(res.body[0].id).toBe("station1");
  });

  it("does not return owner for public stations when authenticated as a non-owner", async () => {
    mockVerifyToken.mockReturnValue(userPayload()); // user ID is TEST_USER_ID
    redisMock.hGet.mockImplementation(async (_hash: string, key: string) => {
      if (key === TEST_USER_ID) {
        return JSON.stringify({ given_name: "Jan", family_name: "Novak" });
      }
      return null;
    });

    vi.mocked(allStationsCfg.getPublicStations).mockReturnValue(new Set(["station1"]));
    vi.mocked(allStationsCfg.getStationByID).mockReturnValue({
      id: "station1",
      lat: 50.08,
      lon: 14.43,
      place: "Test Station",
      type: "GoGen Me 3900",
      public: true,
      owner: "different-owner-id",
    } as any);

    const res = await request(app)
      .get("/api/getAllStationsCfg")
      .set("Cookie", "jwt=valid-token");

    expect(res.status).toBe(200);
    expect(res.body[0].owner).toBeUndefined();
  });

  it("returns owner for public stations when authenticated as the owner", async () => {
    mockVerifyToken.mockReturnValue(userPayload()); // user ID is TEST_USER_ID
    redisMock.hGet.mockImplementation(async (_hash: string, key: string) => {
      if (key === TEST_USER_ID) {
        return JSON.stringify({ given_name: "Jan", family_name: "Novak" });
      }
      return null;
    });

    vi.mocked(allStationsCfg.getPublicStations).mockReturnValue(new Set(["station1"]));
    vi.mocked(allStationsCfg.getStationByID).mockReturnValue({
      id: "station1",
      lat: 50.08,
      lon: 14.43,
      place: "Test Station",
      type: "GoGen Me 3900",
      public: true,
      owner: TEST_USER_ID,
    } as any);

    const res = await request(app)
      .get("/api/getAllStationsCfg")
      .set("Cookie", "jwt=valid-token");

    expect(res.status).toBe(200);
    expect(res.body[0].owner).toBe(TEST_USER_ID);
  });

  it("returns owner for public stations when authenticated as admin", async () => {
    mockVerifyToken.mockReturnValue(adminPayload()); // user ID is TEST_ADMIN_ID
    redisMock.hGet.mockImplementation(async (_hash: string, key: string) => {
      if (key === TEST_ADMIN_ID) {
        return JSON.stringify({ given_name: "Admin", family_name: "User" });
      }
      if (key === "admin") {
        return TEST_ADMIN_ID;
      }
      return null;
    });

    vi.mocked(allStationsCfg.getPublicStations).mockReturnValue(new Set(["station1"]));
    vi.mocked(allStationsCfg.getStationByID).mockReturnValue({
      id: "station1",
      lat: 50.08,
      lon: 14.43,
      place: "Test Station",
      type: "GoGen Me 3900",
      public: true,
      owner: "some-owner-id",
    } as any);

    const res = await request(app)
      .get("/api/getAllStationsCfg")
      .set("Cookie", "jwt=admin-token");

    expect(res.status).toBe(200);
    expect(res.body[0].owner).toBe("some-owner-id");
  });
});
