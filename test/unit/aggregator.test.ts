import { describe, it, expect, vi } from "vitest";

// Hoist mock redisClient
const redisMock = vi.hoisted(() => ({
  zRangeByScore: vi.fn().mockResolvedValue([]),
  zRemRangeByScore: vi.fn().mockResolvedValue(0),
  xAdd: vi.fn().mockResolvedValue("OK"),
  multi: vi.fn(() => ({
    zAdd: vi.fn().mockReturnThis(),
    zRemRangeByScore: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue(["OK", 1]),
  })),
}));

vi.mock("../../server/redisClient", () => ({ default: redisMock }));
vi.mock("../../server/router", () => ({ writeEvent: vi.fn() }));

import Aggregator from "../../server/aggregator";
import { IMeasurement } from "../../server/measurement";

describe("Aggregator Shutdown (aggregator.ts)", () => {
  it("shutdown() cancels active timer and waits for active promise", async () => {
    const mockMeas = {
      getRedisRawDataKey: () => "raw_key",
      getRedisTrendKey: () => "trend_key",
      getStationID: () => "station_id",
      aggregateRawData2Minute: vi.fn().mockReturnValue({}),
    } as unknown as IMeasurement;

    const aggregator = new Aggregator([mockMeas]);

    // Mock aggregateMeasurement to take some time
    let resolveAgg: () => void = () => {};
    const aggPromise = new Promise<void>((resolve) => {
      resolveAgg = resolve;
    });

    vi.spyOn(aggregator, "aggregateMeasurement").mockImplementation(() => aggPromise);

    // Start aggregator
    await aggregator.start();

    // Trigger aggregate immediately
    const aggRun = aggregator.aggregate();

    // Verify it is active
    expect((aggregator as any).activePromise).not.toBeNull();
    expect((aggregator as any).isShuttingDown).toBe(false);

    // Call shutdown
    const shutdownPromise = aggregator.shutdown();

    // Check isShuttingDown is set to true
    expect((aggregator as any).isShuttingDown).toBe(true);

    // Resolve the aggregation promise
    resolveAgg();

    // Wait for shutdown to complete
    await shutdownPromise;

    // Check timer and activePromise are cleared
    expect((aggregator as any).timer).toBeNull();
    expect((aggregator as any).activePromise).toBeNull();
  });
});
