import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import type { IStation } from "../../common/allStationsCfg";
import {
  TEST_USER_ID,
  TEST_ADMIN_ID,
  userPayload,
  adminPayload,
  makeRedisMock,
  makeTestStation,
} from "./_mocks";

// ── Hoisted mocks ─────────────────────────────────────────────────────────────

const redisMock = vi.hoisted(() => ({
  connect: vi.fn(),
  get: vi.fn().mockResolvedValue(null),
  set: vi.fn().mockResolvedValue("OK"),
  del: vi.fn().mockResolvedValue(1),
  hGet: vi.fn().mockResolvedValue(null),
  hSet: vi.fn().mockResolvedValue(1),
  hDel: vi.fn().mockResolvedValue(1),
  hGetAll: vi.fn().mockResolvedValue({}),
  incr: vi.fn().mockResolvedValue(1),
  expire: vi.fn().mockResolvedValue(1),
  publish: vi.fn().mockResolvedValue(1),
  zAdd: vi.fn().mockResolvedValue(1),
  zRangeByScore: vi.fn().mockResolvedValue([]),
  multi: vi.fn(() => ({
    set: vi.fn().mockReturnThis(),
    zAdd: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue(["OK", 1]),
  })),
  on: vi.fn(),
}));

const mockRunRetention = vi.hoisted(() =>
  vi.fn().mockResolvedValue({
    startedAt: "",
    finishedAt: "now",
    tables: [],
    totalDeleted: 0,
    partial: false,
    durationMs: 1,
  }),
);
const mockVerifyToken = vi.hoisted(() => vi.fn((): unknown => null));
const mockGetStationByPasskey = vi.hoisted(() =>
  vi.fn((pk: string): IStation | undefined =>
    pk === "abc123456789"
      ? makeTestStation({ passkey: pk })
      : undefined,
  ),
);
const mockAddStation = vi.hoisted(() =>
  vi.fn(
    async (input: {
      id: string;
      passkey: string;
      owner: string;
      public: boolean;
    }) => undefined,
  ),
);

// ── Module mocks ──────────────────────────────────────────────────────────────

vi.mock("../../server/utils", () => ({
  verifyToken: mockVerifyToken,
  createToken: vi.fn(() => ({ token: "t", createdAt: 0, expiresAt: 0 })),
}));

vi.mock("../../server/redisClient", () => ({ default: redisMock }));

const settingsState = vi.hoisted(() => ({
  current: {
    mqtt: { enabled: false, haDiscovery: true, topicBase: "methub" },
    retention: { days: 730, hour: 3 },
    bridge: {
      autoClaim: false,
      autoClaimMaxPerDay: 5,
      forwardUpstream: false,
      upstreamWuUrl: "https://wu.example",
      upstreamEcowittUrl: "https://ecowitt.example",
      ownerId: "",
    },
  },
}));

vi.mock("../../server/settings", () => ({
  SETTINGS_CHANGED: "SETTINGS_CHANGED",
  assertInitialized: vi.fn(),
  getSettings: () => settingsState.current,
  initSettings: vi.fn().mockResolvedValue(undefined),
  updateSection: vi.fn(async (section: string, patch: Record<string, unknown>) => {
    settingsState.current[section as "mqtt"] = {
      ...settingsState.current[section as "mqtt"],
      ...patch,
    };
    return settingsState.current;
  }),
}));

vi.mock("../../server/retention", () => ({
  runRetention: mockRunRetention,
}));

vi.mock("../../server/state", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../../server/state")>();
  return {
    AppError: mod.AppError,
    allStationsCfg: {
      getStationByID: vi.fn(() => undefined),
      getStationByPasskey: mockGetStationByPasskey,
      getStationsByUser: vi.fn(() => undefined),
      getPublicStations: vi.fn(() => new Set<string>()),
      addStation: mockAddStation,
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

// ── Imports after mocks ───────────────────────────────────────────────────────

import app from "../../server/app";

function authed() {
  mockVerifyToken.mockReturnValue(adminPayload());
  redisMock.hGet.mockImplementation(async (_hash: string, key: string) => {
    // "admin" holds the raw admin id; the id key holds the user record
    if (key === "admin") return TEST_ADMIN_ID;
    if (key === TEST_ADMIN_ID) return JSON.stringify({ email: "admin@met-hub.com" });
    return null;
  });
}

describe("Settings API (admin-only)", () => {
  beforeEach(() => {
    mockVerifyToken.mockReset();
    mockVerifyToken.mockReturnValue(null);
    redisMock.publish.mockClear();
  });

  it("returns 403 for non-admin users", async () => {
    mockVerifyToken.mockReturnValue(userPayload());
    redisMock.hGet.mockImplementation(async (_hash: string, key: string) =>
      key === TEST_USER_ID
        ? JSON.stringify({ email: "user@met-hub.com" })
        : null,
    );

    const res = await request(app)
      .get("/api/settings")
      .set("Cookie", "jwt=user-token");
    expect(res.status).toBe(403);
  });

  it("returns 401 when unauthenticated", async () => {
    const res = await request(app).get("/api/settings");
    expect(res.status).toBe(401);
  });

  it("returns settings and runtime info for the admin", async () => {
    authed();
    const res = await request(app)
      .get("/api/settings")
      .set("Cookie", "jwt=admin-token");
    expect(res.status).toBe(200);
    expect(res.body.settings.retention.days).toBe(730);
    expect(res.body.runtime).toHaveProperty("mqttClients");
  });

  it("saves a valid retention section", async () => {
    authed();
    const res = await request(app)
      .put("/api/settings/retention")
      .set("Cookie", "jwt=admin-token")
      .send({ days: 800, hour: 2 });
    expect(res.status).toBe(200);
    expect(res.body.settings.retention.days).toBe(800);
  });

});

describe("POST /api/mqtt/credentials (self-service)", () => {
  beforeEach(() => {
    mockVerifyToken.mockReturnValue(userPayload());
    redisMock.hGet.mockImplementation(async (_hash: string, key: string) =>
      key === TEST_USER_ID
        ? JSON.stringify({ email: "user@met-hub.com" })
        : null,
    );
    redisMock.hSet.mockClear();
    redisMock.hDel.mockClear();
  });

  it("issues a username/token pair for the calling user", async () => {
    const res = await request(app)
      .post("/api/mqtt/credentials")
      .set("Cookie", "jwt=user-token");

    expect(res.status).toBe(200);
    expect(res.body.username).toBe(TEST_USER_ID);
    expect(res.body.password).toMatch(/^[0-9a-f]{48}$/);
    expect(res.body.brokerUrl).toContain("/mqtt");
  });

  it("requires an authenticated user", async () => {
    const res = await request(app).post("/api/mqtt/credentials");
    expect(res.status).toBe(401);
  });

  it("revokes the stored credential hash", async () => {
    const res = await request(app)
      .delete("/api/mqtt/credentials")
      .set("Cookie", "jwt=user-token");
    expect(res.status).toBe(200);
    expect(redisMock.hDel).toHaveBeenCalled();
  });
});

describe("Cloud bridge auto-claim (WU endpoint)", () => {
  beforeEach(() => {
    mockVerifyToken.mockReturnValue(null);
    mockGetStationByPasskey.mockReturnValue(undefined);
    redisMock.incr.mockResolvedValue(1);
    redisMock.expire.mockClear();
    mockAddStation.mockClear();
  });

  it("auto-creates a private station for an unknown device key when enabled", async () => {
    settingsState.current.bridge.autoClaim = true;

    // Once claimed, the passkey resolves so ingest proceeds
    mockGetStationByPasskey.mockImplementation((pk: string) =>
      pk === "abc123456789"
        ? makeTestStation({ id: "claimed01", passkey: "abc123456789" })
        : undefined,
    );

    // The claim registers the passkey so the subsequent ingest resolves
    mockAddStation.mockImplementation(async (input) => {
      mockGetStationByPasskey.mockImplementation((pk: string) =>
        pk === input.passkey
          ? makeTestStation({ id: input.id, passkey: input.passkey })
          : undefined,
      );
    });

    // Lookup stays empty until the claim lands — models the device key
    // being registered by the auto-claim itself.
    mockGetStationByPasskey.mockImplementation((pk: string) =>
      mockAddStation.mock.calls.length > 0
        ? makeTestStation({ id: "claimed01", passkey: pk })
        : undefined,
    );

    const res = await request(app)
      .get("/weatherstation/updateweatherstation.php?ID=abc123456789&dateutc=now&tempf=70");

    expect(res.status).toBe(200);
    expect(mockAddStation).toHaveBeenCalledTimes(1);
    const arg = mockAddStation.mock.calls[0][0];
    expect(arg.passkey).toBe("abc123456789");
    expect(arg.public).toBe(false);
  });

  it("stays disabled when autoClaim is off (unknown key -> 400)", async () => {
    settingsState.current.bridge.autoClaim = false;

    const res = await request(app)
      .get("/weatherstation/updateweatherstation.php?ID=abc123456789&dateutc=now&tempf=70");

    expect(res.status).toBe(400);
    expect(mockAddStation).not.toHaveBeenCalled();
  });

  it("stops claiming after the per-IP daily cap", async () => {
    settingsState.current.bridge.autoClaim = true;
    redisMock.incr.mockResolvedValue(99);

    const res = await request(app)
      .get("/weatherstation/updateweatherstation.php?ID=abc123456789&dateutc=now&tempf=70");

    expect(res.status).toBe(400);
    expect(mockAddStation).not.toHaveBeenCalled();
  });

  it("does not claim when the identifier already belongs to a station", async () => {
    settingsState.current.bridge.autoClaim = true;
    // Identifier already belongs to a station: no claim, ingest proceeds
    mockGetStationByPasskey.mockReturnValue(
      makeTestStation({ passkey: "abc123456789" }),
    );
    redisMock.incr.mockResolvedValue(1);

    const res = await request(app)
      .get("/weatherstation/updateweatherstation.php?ID=abc123456789&dateutc=now&tempf=70");

    expect(res.status).toBe(200);
    expect(mockAddStation).not.toHaveBeenCalled();
  });
});
