import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Hoisted mocks ─────────────────────────────────────────────────────────────

const queryMock = vi.hoisted(() => vi.fn());
const releaseMock = vi.hoisted(() => vi.fn());
const connectMock = vi.hoisted(() =>
  vi.fn(async () => ({ query: queryMock, release: releaseMock })),
);

vi.mock("../../server/pgPool", () => ({
  default: { connect: connectMock },
}));

// ── Imports after mocks ──────────────────────────────────────────────────────
// Import order is deliberate: pgPool must be mocked before this module loads.
// eslint-disable-next-line import/first
import { computeET0Series, getQuery, loadRainData } from "../../server/db";

describe("getQuery (upsert SQL builder)", () => {
  it("builds a parameterized upsert with quoted identifiers", () => {
    const { qtext, qarr } = getQuery("st1", [
      ["timestamp", new Date(0)],
      ["temp", 21.5],
      ["humidity", 55],
    ]);
    expect(qtext).toContain('insert into "station_st1"');
    expect(qtext).toContain('"timestamp",');
    expect(qtext).toContain('"temp",');
    expect(qtext).toContain("$1,$2,$3");
    expect(qarr).toHaveLength(3);
    expect(qtext).toContain("on conflict (timestamp) do update set");
    // timestamp must not be updated on conflict
    expect(qtext).not.toContain('"timestamp" = EXCLUDED');
    expect(qtext).toContain('"temp" = EXCLUDED."temp"');
  });

  it("excludes place, maxdailygust and totalrain (no PG columns)", () => {
    const { qtext, qarr } = getQuery("st1", [
      ["place", "Garden"],
      ["maxdailygust", 42],
      ["totalrain", 100],
      ["temp", 20],
    ]);
    expect(qtext).not.toContain('"place"');
    expect(qtext).not.toContain('"maxdailygust"');
    expect(qtext).not.toContain('"totalrain"');
    expect(qtext).toContain('"temp"');
    expect(qarr).toEqual([20]);
  });

  it("skips sensors with null values entirely", () => {
    const { qtext, qarr } = getQuery("st1", [
      ["temp", null],
      ["humidity", 50],
    ]);
    expect(qtext).not.toContain('"temp",');
    expect(qtext).toContain('"humidity"');
    expect(qarr).toEqual([50]);
  });

  it("rejects station ids that could alter table identity", () => {
    expect(() => getQuery('st"; drop table x', [])).toThrow(/Invalid station ID/);
  });
});

describe("computeET0Series rain increments", () => {
  const ts = (h: number) => new Date(Date.UTC(2024, 5, 15, h)).toISOString();

  it("derives per-sample deltas from the cumulative dailyrain counter", () => {
    const rows = [
      { timestamp: ts(1), dailyrain: 0.0 },
      { timestamp: ts(2), dailyrain: 1.0 },
      { timestamp: ts(3), dailyrain: 2.5 },
    ];
    const { rain } = computeET0Series(rows, 50);
    expect(rain).toEqual([0, 1.0, 1.5]);
  });

  it("treats a counter reset as the start of a new accumulation window", () => {
    const rows = [
      { timestamp: "2024-06-15T22:00:00Z", dailyrain: 5.0 },
      { timestamp: "2024-06-16T02:00:00Z", dailyrain: 0.4 }, // midnight reset
      { timestamp: "2024-06-16T03:00:00Z", dailyrain: 1.4 },
    ];
    const { rain } = computeET0Series(rows, 50);
    // New day: current absolute value becomes the increment baseline
    expect(rain[1]).toBe(0.4);
    expect(rain[2]).toBeCloseTo(1.0, 5);
  });

  it("clamps negative counter glitches to zero within a day", () => {
    const rows = [
      { timestamp: ts(1), dailyrain: 3.0 },
      { timestamp: ts(2), dailyrain: -1.0 }, // glitch below zero
    ];
    const { rain } = computeET0Series(rows, 50);
    expect(rain[1]).toBe(0);
  });

  it("returns all-zero et0 for rows without temp data", () => {
    const rows = [{ timestamp: ts(1), dailyrain: 0 }];
    const { et0 } = computeET0Series(rows, 50);
    expect(et0).toEqual([0]);
  });
});

describe("loadRainData error tolerance", () => {
  beforeEach(() => {
    queryMock.mockReset();
    releaseMock.mockClear();
  });

  it("returns zeroed intervals when the station table is missing (42P01)", async () => {
    queryMock.mockRejectedValue({ code: "42P01" });
    const rows = await loadRainData("ghost1");
    expect(rows).toHaveLength(8);
    expect(rows.every((r: { sum: number }) => r.sum === 0)).toBe(true);
  });

  it("returns zeroed intervals when rain columns are missing (42703)", async () => {
    queryMock.mockRejectedValue({ code: "42703" });
    const rows = await loadRainData("legacy1");
    expect(rows).toHaveLength(8);
    expect(rows[7]).toEqual({ interval: "4week", sum: 0 });
  });

  it("rethrows unrelated database errors", async () => {
    queryMock.mockRejectedValue(new Error("connection refused"));
    await expect(loadRainData("st1")).rejects.toThrow("connection refused");
  });
});
