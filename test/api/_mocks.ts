// Shared mock setup used across API test files.
// Each test file must call vi.mock() with these factories — vi.mock is hoisted
// so it cannot be abstracted into a helper function. This file exports the
// factory implementations so they stay DRY and consistent.

import { vi } from "vitest";
import type { IStation } from "../../common/allStationsCfg";
import { StationType } from "../../common/stationType";
import StationGoGenMe3900 from "../../server/stationGoGenMe3900";

// ── Test fixtures ────────────────────────────────────────────────────────────

export const TEST_USER_ID = "user-abc123";
export const TEST_ADMIN_ID = "admin-xyz";
export const TEST_STATION_ID = "station-test01";
export const TEST_PASSKEY = "TEST-PASSKEY-001";

export function makeTestStation(overrides: Partial<IStation> = {}): IStation {
  const measurement = new StationGoGenMe3900(TEST_STATION_ID);
  return {
    id: TEST_STATION_ID,
    place: "Test Garden",
    lat: 48.0,
    lon: 17.0,
    type: StationType.GoGenMe3900,
    passkey: TEST_PASSKEY,
    public: false,
    owner: TEST_USER_ID,
    measurement,
    ...overrides,
  };
}

export const TEST_PUBLIC_STATION_ID = "station-public01";

export function makePublicStation(): IStation {
  // Measurement ID must match station ID so checkAccess sees the right key
  const measurement = new StationGoGenMe3900(TEST_PUBLIC_STATION_ID);
  return {
    id: TEST_PUBLIC_STATION_ID,
    place: "Public Garden",
    lat: 48.0,
    lon: 17.0,
    type: StationType.GoGenMe3900,
    passkey: "PUBLIC-PASSKEY-001",
    public: true,
    owner: TEST_USER_ID,
    measurement,
  };
}

// ── JWT helpers ──────────────────────────────────────────────────────────────

/** Decoded JWT payload for a regular (non-admin) user */
export function userPayload(id = TEST_USER_ID) {
  return { id, iat: Math.floor(Date.now() / 1000) - 10, exp: Math.floor(Date.now() / 1000) + 3600 };
}

/** Decoded JWT payload for an admin user */
export function adminPayload() {
  return userPayload(TEST_ADMIN_ID);
}

// ── Redis mock factory ───────────────────────────────────────────────────────

export function makeRedisMock() {
  return {
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
  };
}
