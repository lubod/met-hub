import { describe, it, expect, vi, beforeAll } from "vitest";

// ── Hoisted mocks ─────────────────────────────────────────────────────────────
const redisMock = vi.hoisted(() => ({
  connect: vi.fn().mockResolvedValue(null),
  xRead: vi.fn(),
  xAdd: vi.fn().mockResolvedValue("12345-0"),
  xDel: vi.fn().mockResolvedValue(1),
  quit: vi.fn().mockResolvedValue(null),
  on: vi.fn(),
  duplicate: vi.fn(() => ({
    on: vi.fn(),
    connect: vi.fn().mockResolvedValue(undefined),
    subscribe: vi.fn().mockResolvedValue(undefined),
  })),
}));

vi.mock("redis", () => ({
  createClient: () => redisMock,
  commandOptions: (opts: unknown) => opts,
}));

// Mock shared redis
vi.mock("../../server/redisClient", () => ({
  default: {
    connect: vi.fn().mockResolvedValue(null),
    disconnect: vi.fn().mockResolvedValue(null),
    hGetAll: vi.fn().mockResolvedValue({
      station1: JSON.stringify({
        id: "station1",
        lat: 50,
        lon: 14,
        type: "GoGen Me 3900",
        place: "Test",
        passkey: "testpasskey",
        public: true,
        owner: "local",
      }),
    }),
  },
}));

vi.mock("../../server/settings", () => ({
  initSettings: vi.fn().mockResolvedValue(undefined),
  getSettings: vi.fn(() => ({
    retention: { enabled: false, days: 730, hour: 3 },
  })),
}));

vi.mock("../../server/retention", () => ({
  setRetentionTables: vi.fn(),
  runRetention: vi.fn(),
}));

// Mock db store function
const mockStore = vi.hoisted(() => vi.fn());
vi.mock("../../server/db", () => ({
  store: mockStore,
  ensureDomTableColumns: vi.fn().mockResolvedValue(undefined),
}));

// Mock process.exit
vi.spyOn(process, "exit").mockImplementation((() => {}) as never);

describe("Store Service Unit Tests", () => {
  beforeAll(async () => {
    mockStore
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error("DB write failed"));

    redisMock.xRead
      .mockResolvedValueOnce([
        {
          key: "toStore",
          messages: [
            {
              id: "msg-valid",
              message: {
                id: "station1",
                m: JSON.stringify({
                  timestamp: "2026-11-15T09:00:00.000Z",
                  temp: 21.5,
                }),
              },
            },
          ],
        },
      ])
      .mockResolvedValueOnce([
        {
          key: "toStore",
          messages: [
            {
              id: "msg-db-err",
              message: {
                id: "station1",
                m: JSON.stringify({
                  timestamp: "2026-11-15T09:01:00.000Z",
                  temp: 22.0,
                }),
              },
            },
          ],
        },
      ])
      .mockResolvedValueOnce([
        {
          key: "toStore",
          messages: [
            {
              id: "msg-123",
              message: {
                id: "station1",
                // m is missing! Poison message
              },
            },
          ],
        },
      ])
      .mockImplementation(async () => {
        process.emit("SIGTERM");
        return null;
      });

    await import("../../server/store");

    await vi.waitFor(() =>
      expect(redisMock.xDel).toHaveBeenCalledWith("toStore", ["msg-123"]),
    );
  });

  it("persists a valid stream message and deletes it without hitting DLQ", () => {
    expect(mockStore).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        temp: 21.5,
        timestamp: new Date("2026-11-15T09:00:00.000Z"),
      }),
    );
    expect(redisMock.xDel).toHaveBeenCalledWith("toStore", ["msg-valid"]);
    expect(redisMock.xAdd).not.toHaveBeenCalledWith(
      "toStore:DLQ",
      "*",
      expect.objectContaining({ originalId: "msg-valid" }),
    );
  });

  it("routes failed DB writes to DLQ and acknowledges the stream message", () => {
    expect(redisMock.xAdd).toHaveBeenCalledWith(
      "toStore:DLQ",
      "*",
      expect.objectContaining({
        originalId: "msg-db-err",
        id: "station1",
        error: "DB write failed",
      }),
    );
    expect(redisMock.xDel).toHaveBeenCalledWith("toStore", ["msg-db-err"]);
  });

  it("processes a poison message and writes to DLQ without crashing", () => {
    expect(redisMock.xAdd).toHaveBeenCalledWith(
      "toStore:DLQ",
      "*",
      expect.objectContaining({
        originalId: "msg-123",
        m: "",
        id: "station1",
      }),
    );
    expect(redisMock.xDel).toHaveBeenCalledWith("toStore", ["msg-123"]);
  });
});
