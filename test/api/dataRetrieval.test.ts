import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import {
  TEST_STATION_ID,
  TEST_PUBLIC_STATION_ID,
  TEST_USER_ID,
  makeTestStation,
  makePublicStation,
  userPayload,
} from "./_mocks";
import { IStationData } from "../../common/stationModel";

// ── Hoisted mock objects ──────────────────────────────────────────────────────

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
const mockGetStationByID = vi.hoisted(() => vi.fn(() => undefined as any));
const mockGetStationsByUser = vi.hoisted(() => vi.fn(() => undefined as Set<string> | undefined));
const mockGetPublicStations = vi.hoisted(() => vi.fn(() => new Set<string>()));
const mockLoadData = vi.hoisted(() => vi.fn().mockResolvedValue([]));

// ── Module mocks ──────────────────────────────────────────────────────────────

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
      getStationByID: mockGetStationByID,
      getStationByPasskey: vi.fn(() => undefined),
      getStationsByUser: mockGetStationsByUser,
      getPublicStations: mockGetPublicStations,
      addStation: vi.fn(),
    },
  };
});

vi.mock("../../server/db", () => ({
  loadData: mockLoadData,
  loadRainData: vi.fn().mockResolvedValue([]),
  create: vi.fn(),
}));

vi.mock("../../server/forecast", () => ({
  getForecast: vi.fn().mockResolvedValue({ timeseries: [] }),
  getAstronomicalData: vi.fn().mockResolvedValue({ sunrise: "06:00" }),
}));

// ── Imports after mocks ───────────────────────────────────────────────────────

import app from "../../server/app";

// ── Helpers ───────────────────────────────────────────────────────────────────

function sampleStationData(): IStationData {
  return {
    timestamp: new Date(),
    place: "Test Garden",
    temp: 20.0,
    tempin: 22.0,
    humidity: 65,
    humidityin: 55,
    pressurerel: 1013.0,
    pressureabs: 1010.0,
    windspeed: 10.0,
    windgust: 15.0,
    winddir: 90,
    maxdailygust: 20.0,
    solarradiation: 300,
    uv: 2,
    rainrate: 0.0,
    eventrain: 0.0,
    hourlyrain: 0.0,
    dailyrain: 2.0,
    weeklyrain: 5.0,
    monthlyrain: 20.0,
    totalrain: 100.0,
    minuterain: null,
    dewpt: 12.0,
    feelslike: 20.0,
  };
}

// ── Tests: getLastData ────────────────────────────────────────────────────────

describe("GET /api/getLastData/station/:stationID", () => {
  beforeEach(() => {
    mockVerifyToken.mockReturnValue(null);
    redisMock.hGet.mockResolvedValue(null);
    mockGetStationsByUser.mockReturnValue(undefined);
    mockGetPublicStations.mockReturnValue(new Set());
  });

  it("returns 400 when station ID does not exist", async () => {
    mockGetStationByID.mockReturnValue(undefined);
    const res = await request(app).get("/api/getLastData/station/nonexistent");
    expect(res.status).toBe(400);
  });

  it("returns 403 for a private station when unauthenticated", async () => {
    mockGetStationByID.mockReturnValue(makeTestStation({ public: false }));
    const res = await request(app).get(`/api/getLastData/station/${TEST_STATION_ID}`);
    expect(res.status).toBe(403);
  });

  it("returns 200 and data for a public station with no auth", async () => {
    const station = makePublicStation();
    mockGetStationByID.mockReturnValue(station);
    // Public stations set must contain the measurement's stationID (used by checkAccess)
    mockGetPublicStations.mockReturnValue(new Set([TEST_PUBLIC_STATION_ID]));
    redisMock.get.mockResolvedValue(JSON.stringify(sampleStationData()));

    const res = await request(app).get(`/api/getLastData/station/${TEST_PUBLIC_STATION_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.temp).toBe(20.0);
  });

  it("returns 200 with null body when station exists but has no data yet", async () => {
    const station = makePublicStation();
    mockGetStationByID.mockReturnValue(station);
    mockGetPublicStations.mockReturnValue(new Set([TEST_PUBLIC_STATION_ID]));
    redisMock.get.mockResolvedValue(null);

    const res = await request(app).get(`/api/getLastData/station/${TEST_PUBLIC_STATION_ID}`);
    expect(res.status).toBe(200);
    expect(res.body).toBeNull();
  });

  it("returns 200 for a private station when owner JWT is valid", async () => {
    mockGetStationByID.mockReturnValue(makeTestStation({ public: false }));
    mockGetStationsByUser.mockReturnValue(new Set([TEST_STATION_ID]));
    mockVerifyToken.mockReturnValue(userPayload());
    redisMock.hGet.mockImplementation(async (_: string, key: string) =>
      key === TEST_USER_ID
        ? JSON.stringify({ given_name: "Jan", family_name: "Novak" })
        : null,
    );
    redisMock.get.mockResolvedValue(JSON.stringify(sampleStationData()));

    const res = await request(app)
      .get(`/api/getLastData/station/${TEST_STATION_ID}`)
      .set("Cookie", "jwt=valid-token");

    expect(res.status).toBe(200);
  });

  it("returns 403 for a private station when a different user's JWT is used", async () => {
    mockGetStationByID.mockReturnValue(makeTestStation({ public: false }));
    mockGetStationsByUser.mockReturnValue(new Set()); // other user has no stations
    mockVerifyToken.mockReturnValue(userPayload("other-user-id"));
    redisMock.hGet.mockImplementation(async (_: string, key: string) =>
      key === "other-user-id"
        ? JSON.stringify({ given_name: "Other", family_name: "User" })
        : null,
    );

    const res = await request(app)
      .get(`/api/getLastData/station/${TEST_STATION_ID}`)
      .set("Cookie", "jwt=other-token");

    expect(res.status).toBe(403);
  });
});

// ── Tests: loadData ───────────────────────────────────────────────────────────

describe("GET /api/loadData", () => {
  beforeEach(() => {
    mockVerifyToken.mockReturnValue(null);
    redisMock.hGet.mockResolvedValue(null);
    mockGetPublicStations.mockReturnValue(new Set([TEST_STATION_ID]));
    mockLoadData.mockResolvedValue([]);
  });

  it("returns 400 when required query params are missing", async () => {
    const res = await request(app).get("/api/loadData");
    expect(res.status).toBe(400);
  });

  it("returns 400 when start date is invalid", async () => {
    const res = await request(app).get(
      `/api/loadData?stationID=${TEST_STATION_ID}&start=not-a-date&end=2024-06-15&measurement=temp`,
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 when start >= end", async () => {
    const res = await request(app).get(
      `/api/loadData?stationID=${TEST_STATION_ID}&start=2024-06-15&end=2024-06-01&measurement=temp`,
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 when date range exceeds 366 days", async () => {
    const res = await request(app).get(
      `/api/loadData?stationID=${TEST_STATION_ID}&start=2023-01-01&end=2024-06-01&measurement=temp`,
    );
    expect(res.status).toBe(400);
  });

  it("returns 200 with data for a valid public-station request", async () => {
    mockLoadData.mockResolvedValue([{ timestamp: new Date("2024-06-15T12:00:00Z"), temp: 22.5 }]);

    const res = await request(app).get(
      `/api/loadData?stationID=${TEST_STATION_ID}&start=2024-06-01&end=2024-06-15&measurement=temp`,
    );
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// ── Tests: getForecast ────────────────────────────────────────────────────────

describe("GET /api/getForecast", () => {
  it("returns 400 when lat/lon are missing", async () => {
    const res = await request(app).get("/api/getForecast");
    expect(res.status).toBe(400);
  });

  it("returns 400 when lat is out of bounds (> 90)", async () => {
    const res = await request(app).get("/api/getForecast?lat=95&lon=17");
    expect(res.status).toBe(400);
  });

  it("returns 400 when lon is out of bounds (> 180)", async () => {
    const res = await request(app).get("/api/getForecast?lat=48&lon=200");
    expect(res.status).toBe(400);
  });

  it("returns 400 when lat/lon are non-numeric", async () => {
    const res = await request(app).get("/api/getForecast?lat=abc&lon=xyz");
    expect(res.status).toBe(400);
  });

  it("returns 200 for valid lat/lon", async () => {
    const res = await request(app).get("/api/getForecast?lat=48.1&lon=17.1");
    expect(res.status).toBe(200);
  });
});

// ── Tests: getAstronomicalData ────────────────────────────────────────────────

describe("GET /api/getAstronomicalData", () => {
  it("returns 400 when params are missing", async () => {
    const res = await request(app).get("/api/getAstronomicalData");
    expect(res.status).toBe(400);
  });

  it("returns 400 when date is invalid", async () => {
    const res = await request(app).get(
      "/api/getAstronomicalData?lat=48&lon=17&date=not-a-date",
    );
    expect(res.status).toBe(400);
  });

  it("returns 200 for valid params", async () => {
    const res = await request(app).get(
      "/api/getAstronomicalData?lat=48.1&lon=17.1&date=2024-06-15",
    );
    expect(res.status).toBe(200);
  });
});
