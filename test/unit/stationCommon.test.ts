import { describe, it, expect } from "vitest";
import StationGoGenMe3900 from "../../server/stationGoGenMe3900";
import StationCommon from "../../server/stationCommon";
import { IStationData } from "../../common/stationModel";

// StationCommon is abstract; use GoGenMe3900 as a concrete subclass
const station = new StationGoGenMe3900("test-station");

// Helper: build a minimal IStationData reading
function makeReading(overrides: Partial<IStationData> = {}): IStationData {
  return {
    timestamp: new Date(),
    place: "Test",
    temp: 20.0,
    tempin: 22.0,
    humidity: 60,
    humidityin: 50,
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
    ...overrides,
  };
}

// ──────────────────────────────────────────────────────────────
// parseDate (static method)
// ──────────────────────────────────────────────────────────────

describe("StationCommon.parseDate", () => {
  it("parses a valid UTC date string", () => {
    const d = StationCommon.parseDate("2024-01-15 10:30:00");
    expect(d.getUTCFullYear()).toBe(2024);
    expect(d.getUTCMonth()).toBe(0); // January
    expect(d.getUTCDate()).toBe(15);
    expect(d.getUTCHours()).toBe(10);
    expect(d.getUTCMinutes()).toBe(30);
    expect(d.getUTCSeconds()).toBe(0);
  });

  it("returns current time when dateutc is 'now'", () => {
    const before = Date.now();
    const d = StationCommon.parseDate("now");
    expect(d.getTime()).toBeGreaterThanOrEqual(before);
    expect(d.getTime()).toBeLessThanOrEqual(Date.now());
  });

  it("returns current time when dateutc is null", () => {
    const before = Date.now();
    const d = StationCommon.parseDate(null);
    expect(d.getTime()).toBeGreaterThanOrEqual(before);
  });

  it("returns current time when dateutc is undefined", () => {
    const before = Date.now();
    const d = StationCommon.parseDate(undefined as any);
    expect(d.getTime()).toBeGreaterThanOrEqual(before);
  });

  it("returns current time when dateutc is an invalid string", () => {
    const before = Date.now();
    const d = StationCommon.parseDate("not-a-date");
    expect(d.getTime()).toBeGreaterThanOrEqual(before);
  });

  it("parses timestamp with seconds component", () => {
    const d = StationCommon.parseDate("2024-06-01 12:00:45");
    expect(d.getUTCSeconds()).toBe(45);
  });
});

// ──────────────────────────────────────────────────────────────
// aggregateRawData2Minute
// ──────────────────────────────────────────────────────────────

describe("StationCommon.aggregateRawData2Minute", () => {
  const minute = new Date("2024-06-15T12:00:00Z").getTime();

  it("averages temperature across multiple readings", () => {
    const readings = [
      makeReading({ temp: 20.0 }),
      makeReading({ temp: 22.0 }),
      makeReading({ temp: 21.0 }),
    ];
    const result = station.aggregateRawData2Minute(minute, readings);
    expect(result.temp).toBeCloseTo(21.0, 1);
  });

  it("averages humidity across multiple readings", () => {
    const readings = [
      makeReading({ humidity: 60 }),
      makeReading({ humidity: 70 }),
      makeReading({ humidity: 80 }),
    ];
    const result = station.aggregateRawData2Minute(minute, readings);
    expect(result.humidity).toBeCloseTo(70, 0);
  });

  it("uses vector average for wind direction — wraps across North", () => {
    // 350° and 10° should average to ~0°, not ~180°
    const readings = [
      makeReading({ winddir: 350, windspeed: 10 }),
      makeReading({ winddir: 10, windspeed: 10 }),
    ];
    const result = station.aggregateRawData2Minute(minute, readings);
    expect(result.winddir < 20 || result.winddir > 340).toBe(true);
  });

  it("uses last value for rain accumulation fields (not average)", () => {
    const readings = [
      makeReading({ dailyrain: 1.0 }),
      makeReading({ dailyrain: 2.0 }),
      makeReading({ dailyrain: 3.0 }),
    ];
    const result = station.aggregateRawData2Minute(minute, readings);
    // dailyrain is cumulative — last value should be preserved
    expect(result.dailyrain).toBe(3.0);
  });

  it("sets timestamp to the minute argument", () => {
    const readings = [makeReading()];
    const result = station.aggregateRawData2Minute(minute, readings);
    expect(result.timestamp.getTime()).toBe(minute);
  });

  it("handles a single reading correctly", () => {
    const reading = makeReading({ temp: 18.5, humidity: 72 });
    const result = station.aggregateRawData2Minute(minute, [reading]);
    expect(result.temp).toBe(18.5);
    expect(result.humidity).toBe(72);
  });

  it("averages pressure correctly", () => {
    const readings = [
      makeReading({ pressurerel: 1010.0, pressureabs: 1008.0 }),
      makeReading({ pressurerel: 1020.0, pressureabs: 1018.0 }),
    ];
    const result = station.aggregateRawData2Minute(minute, readings);
    expect(result.pressurerel).toBeCloseTo(1015.0, 1);
    expect(result.pressureabs).toBeCloseTo(1013.0, 1);
  });
});

// ──────────────────────────────────────────────────────────────
// transformTrendData
// ──────────────────────────────────────────────────────────────

describe("StationCommon.transformTrendData", () => {
  function makeJsonReading(timestampMs: number, overrides: Partial<IStationData> = {}): string {
    return JSON.stringify(makeReading({ timestamp: new Date(timestampMs), ...overrides }));
  }

  const t0 = new Date("2024-06-15T12:00:00Z").getTime();

  it("includes readings that are at least 60s apart", () => {
    const data = [
      makeJsonReading(t0),
      makeJsonReading(t0 + 60_000),
      makeJsonReading(t0 + 120_000),
    ];
    const result = station.transformTrendData(data);
    expect(result.timestamp).toHaveLength(3);
  });

  it("skips readings closer than 60s to the previous kept reading", () => {
    const data = [
      makeJsonReading(t0),
      makeJsonReading(t0 + 30_000),  // 30s later — skip
      makeJsonReading(t0 + 60_000),  // 60s after t0 — keep
    ];
    const result = station.transformTrendData(data);
    expect(result.timestamp).toHaveLength(2);
  });

  it("returns empty arrays for empty input", () => {
    const result = station.transformTrendData([]);
    expect(result.timestamp).toHaveLength(0);
    expect(result.temp).toHaveLength(0);
  });

  it("includes all expected sensor fields in output", () => {
    const data = [makeJsonReading(t0)];
    const result = station.transformTrendData(data);
    expect(result).toHaveProperty("timestamp");
    expect(result).toHaveProperty("temp");
    expect(result).toHaveProperty("humidity");
    expect(result).toHaveProperty("pressurerel");
    expect(result).toHaveProperty("windspeed");
    expect(result).toHaveProperty("windgust");
    expect(result).toHaveProperty("winddir");
    expect(result).toHaveProperty("solarradiation");
    expect(result).toHaveProperty("uv");
    expect(result).toHaveProperty("rainrate");
    expect(result).toHaveProperty("feelslike");
    expect(result).toHaveProperty("dewpt");
  });

  it("parses timestamp strings back to Date objects", () => {
    const data = [makeJsonReading(t0)];
    const result = station.transformTrendData(data);
    expect(result.timestamp[0]).toBeInstanceOf(Date);
  });

  it("values match the source readings", () => {
    const data = [makeJsonReading(t0, { temp: 23.4, humidity: 67, windspeed: 8.5 })];
    const result = station.transformTrendData(data);
    expect(result.temp[0]).toBe(23.4);
    expect(result.humidity[0]).toBe(67);
    expect(result.windspeed[0]).toBe(8.5);
  });
});
