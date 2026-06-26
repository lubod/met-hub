import { describe, it, expect, vi } from "vitest";

// ── Hoisted mocks ─────────────────────────────────────────────────────────────
const redisMock = vi.hoisted(() => ({
  connect: vi.fn().mockResolvedValue(null),
  xRead: vi.fn(),
  xAdd: vi.fn().mockResolvedValue("12345-0"),
  xDel: vi.fn().mockResolvedValue(1),
  quit: vi.fn().mockResolvedValue(null),
  on: vi.fn(),
}));

vi.mock("redis", () => ({
  createClient: () => redisMock,
  commandOptions: (opts: any) => opts,
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

// Mock db store function
const mockStore = vi.fn();
vi.mock("../../server/db", () => ({
  store: mockStore,
}));

// Mock process.exit
vi.spyOn(process, "exit").mockImplementation((() => {}) as any);

describe("Store Service Unit Tests", () => {
  it("processes a poison message and writes to DLQ without crashing", async () => {
    // 1. Configure xRead to return a poison message (missing .m / malformed message)
    redisMock.xRead.mockResolvedValueOnce([
      {
        key: "toStore",
        messages: [
          {
            id: "msg-123",
            message: {
              id: "station1",
              // m is missing! This would have caused the DLQ crash before our fix
            },
          },
        ],
      },
    ]);

    // Subsequent calls return null and trigger shutdown
    redisMock.xRead.mockImplementation(async () => {
      // Trigger SIGTERM to stop the store loop
      process.emit("SIGTERM");
      return null;
    });

    // Import the store module to trigger execution
    await import("../../server/store");

    // Wait for the async loop to process and exit
    await new Promise((resolve) => {
      setTimeout(() => resolve(true), 100);
    });

    // Verify client.xAdd was called to publish to the DLQ
    expect(redisMock.xAdd).toHaveBeenCalledWith(
      "toStore:DLQ",
      "*",
      expect.objectContaining({
        originalId: "msg-123",
        m: "",
        id: "station1",
      })
    );

    // Verify the message was deleted from the main stream
    expect(redisMock.xDel).toHaveBeenCalledWith("toStore", ["msg-123"]);
  });
});
