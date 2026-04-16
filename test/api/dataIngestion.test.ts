import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { TEST_STATION_ID, TEST_PASSKEY, makeTestStation } from "./_mocks";
import { IStationGoGenMe3900DataRaw } from "../../common/stationModel";

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

const mockGetStationByID = vi.hoisted(() => vi.fn(() => undefined as any));
const mockGetStationByPasskey = vi.hoisted(() => vi.fn(() => undefined as any));

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
      getStationByID: mockGetStationByID,
      getStationByPasskey: mockGetStationByPasskey,
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

// ── Imports after mocks ───────────────────────────────────────────────────────

import app from "../../server/app";

// ── Test data ─────────────────────────────────────────────────────────────────

function freshRaw(): IStationGoGenMe3900DataRaw {
  return {
    PASSKEY: TEST_PASSKEY,
    stationtype: "GW2000A",
    dateutc: "now",
    tempinf: 68.0,
    humidityin: 55,
    baromrelin: 29.92,
    baromabsin: 29.50,
    tempf: 59.0,
    humidity: 65,
    winddir: 180,
    windspeedmph: 6.25,
    windgustmph: 12.5,
    maxdailygust: 18.75,
    rainratein: 0.0,
    eventrainin: 0.0,
    hourlyrainin: 0.0,
    dailyrainin: 0.1,
    weeklyrainin: 0.5,
    monthlyrainin: 2.0,
    totalrainin: 10.0,
    solarradiation: 500.0,
    uv: 3,
    wh65batt: 0,
    freq: "868M",
    model: "WS2900",
  };
}

function freshMulti() {
  return {
    set: vi.fn().mockReturnThis(),
    zAdd: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue(["OK", 1]),
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("POST /setData/:stationID", () => {
  beforeEach(() => {
    mockGetStationByID.mockReturnValue(undefined);
    mockGetStationByPasskey.mockReturnValue(undefined);
    redisMock.multi.mockReturnValue(freshMulti());
  });

  it("returns 200 when station is found by ID and data is fresh", async () => {
    mockGetStationByID.mockReturnValue(makeTestStation());

    const res = await request(app)
      .post(`/setData/${TEST_STATION_ID}`)
      .send(freshRaw());

    expect(res.status).toBe(200);
  });

  it("stores decoded data in Redis via multi().set().zAdd().exec()", async () => {
    mockGetStationByID.mockReturnValue(makeTestStation());
    const multi = freshMulti();
    redisMock.multi.mockReturnValue(multi);

    await request(app)
      .post(`/setData/${TEST_STATION_ID}`)
      .send(freshRaw());

    expect(redisMock.multi).toHaveBeenCalled();
    expect(multi.set).toHaveBeenCalled();
    expect(multi.zAdd).toHaveBeenCalled();
    expect(multi.exec).toHaveBeenCalled();
  });

  it("returns 400 when station ID is unknown", async () => {
    mockGetStationByID.mockReturnValue(undefined);

    const res = await request(app)
      .post("/setData/nonexistent-id")
      .send(freshRaw());

    expect(res.status).toBe(400);
  });

  it("returns 400 when data is older than 1 hour", async () => {
    mockGetStationByID.mockReturnValue(makeTestStation());

    const old = new Date(Date.now() - 2 * 3600 * 1000);
    const pad = (n: number) => String(n).padStart(2, "0");
    const staleTs =
      `${old.getUTCFullYear()}-${pad(old.getUTCMonth() + 1)}-${pad(old.getUTCDate())} ` +
      `${pad(old.getUTCHours())}:${pad(old.getUTCMinutes())}:${pad(old.getUTCSeconds())}`;

    const res = await request(app)
      .post(`/setData/${TEST_STATION_ID}`)
      .send({ ...freshRaw(), dateutc: staleTs });

    expect(res.status).toBe(400);
  });
});

describe("POST /setData (by PASSKEY in body)", () => {
  beforeEach(() => {
    mockGetStationByID.mockReturnValue(undefined);
    mockGetStationByPasskey.mockReturnValue(undefined);
    redisMock.multi.mockReturnValue(freshMulti());
  });

  it("returns 200 when station is found by PASSKEY and data is fresh", async () => {
    mockGetStationByPasskey.mockReturnValue(makeTestStation());

    const res = await request(app)
      .post("/setData")
      .send(freshRaw());

    expect(res.status).toBe(200);
  });

  it("returns 400 when PASSKEY is unknown", async () => {
    mockGetStationByPasskey.mockReturnValue(undefined);

    const res = await request(app)
      .post("/setData")
      .send(freshRaw());

    expect(res.status).toBe(400);
  });
});

describe("GET /weatherstation/updateweatherstation.php (legacy protocol)", () => {
  beforeEach(() => {
    mockGetStationByID.mockReturnValue(undefined);
    redisMock.multi.mockReturnValue(freshMulti());
  });

  it("returns 200 when station ID is valid and data is fresh", async () => {
    // The legacy endpoint passes the ID query param as a PASSKEY lookup, not an ID lookup
    mockGetStationByPasskey.mockReturnValue(makeTestStation());
    const raw = freshRaw();

    const qs = new URLSearchParams({
      ID: TEST_STATION_ID,
      dateutc: "now",
      tempinf: String(raw.tempinf),
      humidityin: String(raw.humidityin),
      baromrelin: String(raw.baromrelin),
      baromabsin: String(raw.baromabsin),
      tempf: String(raw.tempf),
      humidity: String(raw.humidity),
      winddir: String(raw.winddir),
      windspeedmph: String(raw.windspeedmph),
      windgustmph: String(raw.windgustmph),
      maxdailygust: String(raw.maxdailygust),
      rainratein: "0",
      eventrainin: "0",
      hourlyrainin: "0",
      dailyrainin: String(raw.dailyrainin),
      weeklyrainin: String(raw.weeklyrainin),
      monthlyrainin: String(raw.monthlyrainin),
      totalrainin: String(raw.totalrainin),
      solarradiation: String(raw.solarradiation),
      uv: String(raw.uv),
    });

    const res = await request(app).get(
      `/weatherstation/updateweatherstation.php?${qs}`,
    );
    expect(res.status).toBe(200);
  });

  it("returns 400 when station ID is missing or unknown", async () => {
    mockGetStationByID.mockReturnValue(undefined);

    const res = await request(app).get(
      "/weatherstation/updateweatherstation.php?tempf=59",
    );
    expect(res.status).toBe(400);
  });
});
