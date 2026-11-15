import { describe, it, expect, vi } from "vitest";

import Aggregator from "../../server/aggregator";
import { IMeasurement } from "../../server/measurement";

// Hoist mock redisClient
const redisMock = vi.hoisted(() => ({
  get: vi.fn().mockResolvedValue(null),
  eval: vi.fn().mockResolvedValue([]),
  zRangeByScore: vi.fn().mockResolvedValue([]),
  zRemRangeByScore: vi.fn().mockResolvedValue(0),
  xAdd: vi.fn().mockResolvedValue("OK"),
  multi: vi.fn(() => ({
    zAdd: vi.fn().mockReturnThis(),
    zRemRangeByScore: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue(["OK", 1]),
  })),
}));

const publishAvailabilityMock = vi.hoisted(() => vi.fn());
const publishMinuteMock = vi.hoisted(() => vi.fn());
const writeEventMock = vi.hoisted(() => vi.fn());

vi.mock("../../server/redisClient", () => ({ default: redisMock }));
vi.mock("../../server/router", () => ({ writeEvent: writeEventMock }));
vi.mock("../../server/mqttBroker", () => ({
  publishMinute: publishMinuteMock,
  publishAvailability: publishAvailabilityMock,
}));

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

  it("does not mark station stale on empty tick when last reading is <= 5 min old", async () => {
    publishAvailabilityMock.mockClear();
    redisMock.eval.mockResolvedValueOnce([]);
    redisMock.get.mockResolvedValueOnce(
      JSON.stringify({ timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString() }),
    );

    const mockMeas = {
      getRedisRawDataKey: () => "raw_key",
      getRedisLastDataKey: () => "last_key",
      getRedisTrendKey: () => "trend_key",
      getStationID: () => "st1",
    } as unknown as IMeasurement;

    const aggregator = new Aggregator([mockMeas]);
    await aggregator.aggregateMeasurement(mockMeas, Date.now());
    expect(publishAvailabilityMock).not.toHaveBeenCalled();
  });

  it("marks station stale on empty tick when last reading is > 5 min old or missing", async () => {
    publishAvailabilityMock.mockClear();
    redisMock.eval.mockResolvedValueOnce([]);
    redisMock.get.mockResolvedValueOnce(
      JSON.stringify({ timestamp: new Date(Date.now() - 6 * 60 * 1000).toISOString() }),
    );

    const mockMeas = {
      getRedisRawDataKey: () => "raw_key",
      getRedisLastDataKey: () => "last_key",
      getRedisTrendKey: () => "trend_key",
      getStationID: () => "st1",
    } as unknown as IMeasurement;

    const aggregator = new Aggregator([mockMeas]);
    await aggregator.aggregateMeasurement(mockMeas, Date.now());
    expect(publishAvailabilityMock).toHaveBeenCalledWith("st1", false);
  });

  it("aggregates raw samples into a minute bucket, enqueues toStore, updates trend, and notifies MQTT/SSE", async () => {
    publishAvailabilityMock.mockClear();
    publishMinuteMock.mockClear();
    writeEventMock.mockClear();
    redisMock.xAdd.mockClear();
    const multiChain = {
      zAdd: vi.fn().mockReturnThis(),
      zRemRangeByScore: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(["OK", 1]),
    };
    redisMock.multi.mockReturnValueOnce(multiChain);

    const rawSample = { timestamp: "2026-11-15T09:00:10.000Z", temp: 20 };
    const aggResult = { timestamp: new Date("2026-11-15T09:00:00.000Z"), temp: 20 };
    redisMock.eval.mockResolvedValueOnce([JSON.stringify(rawSample)]);

    const mockMeas = {
      getRedisRawDataKey: () => "raw_key",
      getRedisLastDataKey: () => "last_key",
      getRedisTrendKey: () => "trend_key",
      getStationID: () => "st1",
      aggregateRawData2Minute: vi.fn().mockReturnValue(aggResult),
    } as unknown as IMeasurement;

    const aggregator = new Aggregator([mockMeas]);
    await aggregator.aggregateMeasurement(mockMeas, Date.now());

    const minuteMs = Date.UTC(2026, 10, 15, 9, 0, 0, 0);
    expect(mockMeas.aggregateRawData2Minute).toHaveBeenCalledWith(
      minuteMs,
      [expect.objectContaining({ temp: 20 })],
    );
    expect(redisMock.xAdd).toHaveBeenCalledWith("toStore", "*", {
      m: JSON.stringify(aggResult),
      id: "st1",
    });
    expect(publishMinuteMock).toHaveBeenCalledWith("st1", aggResult);
    expect(publishAvailabilityMock).toHaveBeenCalledWith("st1", true);
    expect(multiChain.zAdd).toHaveBeenCalledWith("trend_key", {
      score: minuteMs,
      value: JSON.stringify(aggResult),
    });
    expect(multiChain.zRemRangeByScore).toHaveBeenCalled();
    expect(multiChain.exec).toHaveBeenCalled();
    expect(writeEventMock).toHaveBeenCalledWith("st1", "minute");
  });
});
