import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import http from "http";

// ── Imports after mocks ───────────────────────────────────────────────────────
import { Response } from "express";
import app from "../../server/app";
import { clients, writeEvent, MAX_SSE_CONNECTIONS } from "../../server/router";

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

describe("SSE Client Map and writeEvent (router.ts)", () => {
  beforeEach(() => {
    clients.clear();
  });

  it("GET /events returns 200 message Ok when Accept header is not text/event-stream", async () => {
    const res = await request(app).get("/events");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Ok" });
  });

  it("writeEvent handles successful and failing writes", () => {
    // 1. Setup a successful mock response
    const mockResSuccess = {
      writable: true,
      destroyed: false,
      write: vi.fn((data: string, cb?: (err?: Error) => void) => {
        if (cb) cb();
        return true;
      }),
      end: vi.fn(),
    } as unknown as Response;

    // 2. Setup a failing mock response (simulate write callback error)
    const mockResFailCallback = {
      writable: true,
      destroyed: false,
      write: vi.fn((data: string, cb?: (err?: Error) => void) => {
        if (cb) cb(new Error("Write error"));
        return true;
      }),
      end: vi.fn(),
    } as unknown as Response;

    // 3. Setup a mock response that synchronous throws
    const mockResSyncThrow = {
      writable: true,
      destroyed: false,
      write: vi.fn(() => {
        throw new Error("Sync throw");
      }),
      end: vi.fn(),
    } as unknown as Response;

    // 4. Setup a mock response that is not writable
    const mockResNotWritable = {
      writable: false,
      destroyed: false,
      write: vi.fn(),
      end: vi.fn(),
    } as unknown as Response;

    clients.set(1, mockResSuccess);
    clients.set(2, mockResFailCallback);
    clients.set(3, mockResSyncThrow);
    clients.set(4, mockResNotWritable);

    expect(clients.size).toBe(4);

    // Run writeEvent (use raw type so lastEventTime restriction doesn't apply to ping)
    writeEvent("testData", "raw");

    // Success client remains, others are removed
    expect(clients.has(1)).toBe(true);
    expect(clients.has(2)).toBe(false);
    expect(clients.has(3)).toBe(false);
    expect(clients.has(4)).toBe(false);
    expect(clients.size).toBe(1);
  });

  it("evicts the oldest client when connection count exceeds max connections cap", async () => {
    // Start server on a random port
    const server = app.listen(0);
    const {port} = (server.address() as any);

    // Fill clients map to maximum cap
    const evictedMockEnd = vi.fn();
    const oldestRes = {
      writable: true,
      destroyed: false,
      write: vi.fn(),
      end: evictedMockEnd,
    } as unknown as Response;

    clients.set(10000, oldestRes);

    for (let i = 10001; i < 10000 + MAX_SSE_CONNECTIONS; i++) {
      clients.set(i, {
        writable: true,
        destroyed: false,
        write: vi.fn(),
        end: vi.fn(),
      } as unknown as Response);
    }

    expect(clients.size).toBe(MAX_SSE_CONNECTIONS);

    // Make the request using http.get to trigger eventHandler
    const clientReq = http.get(`http://localhost:${port}/events`, {
      headers: { accept: "text/event-stream" }
    });
    clientReq.on("error", () => {
      // Swallowed to prevent uncaught exception on connection close
    });

    // Give it a tiny bit of time to establish connection
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Check that clients map eviction worked
    expect(clients.size).toBe(MAX_SSE_CONNECTIONS); // Should remain at max limit after evicting the oldest and adding the new one
    expect(clients.has(10000)).toBe(false); // Oldest client should be evicted
    expect(evictedMockEnd).toHaveBeenCalled();

    // Clean up
    clientReq.destroy();
    clients.clear();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });
});
