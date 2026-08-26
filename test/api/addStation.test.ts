import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import {
  TEST_USER_ID,
  makeTestStation,
  userPayload,
} from "./_mocks";
import { StationType } from "../../common/stationType";
import type { IStation } from "../../common/allStationsCfg";

// ── Imports after mocks ──────────────────────────────────────────────────────

import app from "../../server/app";

// ── Hoisted mock objects ─────────────────────────────────────────────────────

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

const mockAddStation = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
const mockCreate = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
const mockGetStationByPasskey = vi.hoisted(() =>
  vi.fn((): IStation | undefined => undefined),
);
const mockGetStationsByUser = vi.hoisted(() =>
  vi.fn((): Set<string> | undefined => undefined),
);
const mockVerifyToken = vi.hoisted(() => vi.fn((): unknown => null));

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
      getStationByPasskey: mockGetStationByPasskey,
      getStationsByUser: mockGetStationsByUser,
      getPublicStations: vi.fn(() => new Set<string>()),
      addStation: mockAddStation,
    },
  };
});

vi.mock("../../server/db", () => ({
  loadData: vi.fn().mockResolvedValue([]),
  loadRainData: vi.fn().mockResolvedValue([]),
  create: mockCreate,
}));

vi.mock("../../server/forecast", () => ({
  getForecast: vi.fn().mockResolvedValue({}),
  getAstronomicalData: vi.fn().mockResolvedValue({}),
}));

function validBody(overrides: Record<string, unknown> = {}) {
  return {
    lat: "48.15",
    lon: "17.11",
    place: "Bratislava",
    type: StationType.Json,
    passkey: "a-valid-long-passkey",
    ...overrides,
  };
}

describe("POST /api/addStation", () => {
  beforeEach(() => {
    mockVerifyToken.mockReturnValue(userPayload());
    redisMock.hGet.mockImplementation(async (_hash: string, key: string) =>
      key === TEST_USER_ID
        ? JSON.stringify({ given_name: "T", family_name: "U", email: "e" })
        : null,
    );
    mockGetStationByPasskey.mockReturnValue(undefined);
    mockGetStationsByUser.mockReturnValue(undefined);
    mockAddStation.mockClear();
    mockCreate.mockClear();
  });

  async function post(body: Record<string, unknown>) {
    return request(app)
      .post("/api/addStation")
      .set("Cookie", "jwt=valid-token")
      .send(body);
  }

  it("returns 401 when unauthenticated", async () => {
    mockVerifyToken.mockReturnValue(null);
    const res = await request(app).post("/api/addStation").send(validBody());
    expect(res.status).toBe(401);
  });

  it("provisions the station and returns its generated id", async () => {
    const res = await post(validBody());

    expect(res.status).toBe(200);
    expect(typeof res.body.id).toBe("string");
    expect(mockAddStation).toHaveBeenCalledTimes(1);
    const arg = mockAddStation.mock.calls[0][0];
    expect(arg.owner).toBe(TEST_USER_ID);
    expect(arg.passkey).toBe("a-valid-long-passkey");
    expect(arg.public).toBe(true);
  });

  it("rejects passkeys shorter than 12 characters", async () => {
    const res = await post(validBody({ passkey: "short" }));
    expect(res.status).toBe(400);
    expect(mockAddStation).not.toHaveBeenCalled();
  });

  it("rejects the reserved 'dummy' passkey", async () => {
    const res = await post(validBody({ passkey: "dummy" }));
    expect(res.status).toBe(400);
    expect(mockAddStation).not.toHaveBeenCalled();
  });

  it("rejects a duplicate passkey", async () => {
    mockGetStationByPasskey.mockReturnValue(makeTestStation());
    const res = await post(validBody());
    expect(res.status).toBe(400);
    expect(mockAddStation).not.toHaveBeenCalled();
  });

  it("enforces the max-3-stations quota per user", async () => {
    mockGetStationsByUser.mockReturnValue(
      new Set(["s1", "s2", "s3"]) as Set<string>,
    );
    const res = await post(validBody());
    expect(res.status).toBe(400);
    expect(mockAddStation).not.toHaveBeenCalled();
  });

  it("surfaces provisioning failure as a generic 500 without leaking internals", async () => {
    mockAddStation.mockRejectedValue(
      new Error('relation "station_x" already exists'),
    );
    const res = await post(validBody());
    expect(res.status).toBe(500);
    expect(res.body.msg).toBe("Internal Server Error");
    expect(JSON.stringify(res.body)).not.toContain("station_x");
  });
});
