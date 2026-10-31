import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Imports after mocks ──────────────────────────────────────────────────────
// Import order is deliberate: pgPool must be mocked before this module loads.
// eslint-disable-next-line import/first
import { computeET0Series, getQuery, loadRainData, loadHeatingData, loadData } from "../../server/db";
import { AllStationsCfg } from "../../common/allStationsCfg";

// ── Hoisted mocks ─────────────────────────────────────────────────────────────

const queryMock = vi.hoisted(() => vi.fn());
const releaseMock = vi.hoisted(() => vi.fn());
const connectMock = vi.hoisted(() =>
  vi.fn(async () => ({ query: queryMock, release: releaseMock })),
);

vi.mock("../../server/pgPool", () => ({
  default: { connect: connectMock },
}));

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

describe("loadHeatingData", () => {
  beforeEach(() => {
    queryMock.mockReset();
    releaseMock.mockClear();
  });

  it("calculates runtime minutes and kWh accurately from 2-minute sample counts", async () => {
    queryMock.mockResolvedValue({
      rows: [
        {
          living_today: "30",    // 30 * 2 = 60 min (1 hr) * 4.0 kW = 4.0 kWh
          guest_today: "15",     // 15 * 2 = 30 min (0.5 hr) * 1.3 kW = 0.65 kWh
          bed_today: "60",       // 60 * 2 = 120 min (2 hr) * 1.2 kW = 2.4 kWh
          boys_today: "0",       // 0 kWh
          petra_today: "45",     // 45 * 2 = 90 min (1.5 hr) * 1.3 kW = 1.95 kWh
          living_yesterday: "0",
          guest_yesterday: "0",
          bed_yesterday: "0",
          boys_yesterday: "0",
          petra_yesterday: "0",
          living_24h: "0",
          guest_24h: "0",
          bed_24h: "0",
          boys_24h: "0",
          petra_24h: "0",
          living_7d: "0",
          guest_7d: "0",
          bed_7d: "0",
          boys_7d: "0",
          petra_7d: "0",
          living_30d: "0",
          guest_30d: "0",
          bed_30d: "0",
          boys_30d: "0",
          petra_30d: "0",
        },
      ],
    });

    const stats = await loadHeatingData({
      living_room: 4.0,
      guest_room: 1.3,
      bed_room: 1.2,
      boys_room: 2.0,
      petra_room: 1.3,
      entry_hall: 0.329,
      bath_down: 0.506,
      bath_up: 0.541,
      wardrobe: 0.132,
      hall_up: 0.247,
    });
    expect(stats).not.toBeNull();
    if (!stats) throw new Error("stats is null");
    expect(stats.today.rooms.living_room.runtimeMinutes).toBe(60);
    expect(stats.today.rooms.living_room.kwh).toBe(4.0);
    expect(stats.today.rooms.guest_room.runtimeMinutes).toBe(30);
    expect(stats.today.rooms.guest_room.kwh).toBe(0.65);
    expect(stats.today.rooms.bed_room.runtimeMinutes).toBe(120);
    expect(stats.today.rooms.bed_room.kwh).toBe(2.4);
    expect(stats.today.rooms.boys_room.runtimeMinutes).toBe(0);
    expect(stats.today.rooms.boys_room.kwh).toBe(0);
    expect(stats.today.rooms.petra_room.runtimeMinutes).toBe(90);
    expect(stats.today.rooms.petra_room.kwh).toBe(1.95);

    // Total: 4.0 + 0.65 + 2.4 + 0 + 1.95 = 9.0 kWh
    expect(stats.today.totalKWh).toBe(9.0);
    expect(stats.today.totalRuntimeMinutes).toBe(300);
  });

  it("applies custom powers when provided", async () => {
    queryMock.mockResolvedValue({
      rows: [
        {
          living_today: "60", // 120 min = 2 hr * custom 5.0 kW = 10.0 kWh
          guest_today: "0",
          bed_today: "0",
          boys_today: "0",
          petra_today: "0",
          living_yesterday: "0", guest_yesterday: "0", bed_yesterday: "0", boys_yesterday: "0", petra_yesterday: "0",
          living_24h: "0", guest_24h: "0", bed_24h: "0", boys_24h: "0", petra_24h: "0",
          living_7d: "0", guest_7d: "0", bed_7d: "0", boys_7d: "0", petra_7d: "0",
          living_30d: "0", guest_30d: "0", bed_30d: "0", boys_30d: "0", petra_30d: "0",
        },
      ],
    });

    const stats = await loadHeatingData({ living_room: 5.0 });
    expect(stats).not.toBeNull();
    if (!stats) throw new Error("stats is null");
    expect(stats.today.rooms.living_room.powerKw).toBe(5.0);
    expect(stats.today.rooms.living_room.kwh).toBe(10.0);
  });

  it("gracefully returns zeroed stats if station_dom table is missing", async () => {
    queryMock.mockRejectedValue({ code: "42P01" });
    const stats = await loadHeatingData();
    expect(stats).not.toBeNull();
    if (!stats) throw new Error("stats is null");
    expect(stats.today.totalKWh).toBe(0);
    expect(stats.today.rooms.living_room.kwh).toBe(0);
  });
});

describe("loadData overlay and boolean handling", () => {
  beforeEach(() => {
    queryMock.mockReset();
    releaseMock.mockClear();
  });

  it("includes extraColumn in SQL query and casts boolean heat overlays to int", async () => {
    queryMock
      .mockResolvedValueOnce({
        rows: [
          { grp: 1, timestamp: 1700000000000, min: 23.1, max: 23.4, living_room_heat: 1 },
        ],
      })
      .mockResolvedValueOnce({
        rows: [{ min: 23.1, max: 23.4, avg: 23.25, first: 23.1, last: 23.4 }],
      });

    const cfg = new AllStationsCfg();
    const res = await loadData(
      "dom",
      new Date("2026-10-30T00:00:00Z"),
      new Date("2026-10-31T00:00:00Z"),
      "living_room_floor:living_room_heat",
      cfg,
    );

    expect(res).not.toBeNull();
    expect(queryMock).toHaveBeenCalledTimes(2);
    const dataSql = queryMock.mock.calls[0][0] as string;
    expect(dataSql).toContain('s."living_room_heat"');
    expect(dataSql).toContain('max(("living_room_heat"::int)) AS "living_room_heat"');
    expect(res?.data[0].living_room_heat).toBe(1);
  });

  it("supports secondary circuit air and reqall overlay queries", async () => {
    queryMock
      .mockResolvedValueOnce({
        rows: [
          { grp: 1, timestamp: 1700000000000, min: 21.0, max: 21.5, entry_hall_reqall: 21.0 },
        ],
      })
      .mockResolvedValueOnce({
        rows: [{ min: 21.0, max: 21.5, avg: 21.2, first: 21.0, last: 21.5 }],
      });

    const cfg = new AllStationsCfg();
    const res = await loadData(
      "dom",
      new Date("2026-10-30T00:00:00Z"),
      new Date("2026-10-31T00:00:00Z"),
      "entry_hall_air:entry_hall_reqall",
      cfg,
    );

    expect(res).not.toBeNull();
    const dataSql = queryMock.mock.calls[0][0] as string;
    expect(dataSql).toContain('s."entry_hall_reqall"');
    expect(dataSql).toContain('AS "entry_hall_reqall"');
  });
});
