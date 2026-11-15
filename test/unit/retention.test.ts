import { describe, it, expect, vi, beforeEach } from "vitest";

import { runRetention, setRetentionTables } from "../../server/retention";

const pgMock = vi.hoisted(() => ({
  query: vi.fn(),
}));

const redisMock = vi.hoisted(() => ({
  xTrim: vi.fn().mockResolvedValue(0),
}));

vi.mock("../../server/pgPool", () => ({ default: pgMock }));
vi.mock("../../server/redisClient", () => ({ default: redisMock }));
vi.mock("../../server/settings", () => ({
  getSettings: vi.fn(() => ({
    retention: { enabled: true, days: 730, hour: 3 },
  })),
}));

describe("Retention job (retention.ts)", () => {
  beforeEach(() => {
    pgMock.query.mockReset();
    redisMock.xTrim.mockReset().mockResolvedValue(0);
    setRetentionTables(() => ["station_abc", "station_missing"]);
  });

  it("deletes rows in batches, skips missing tables, and trims DLQ", async () => {
    pgMock.query
      // station_dom: batch 1 (full 5000) -> batch 2 (120, ends loop)
      .mockResolvedValueOnce({ rowCount: 5000 })
      .mockResolvedValueOnce({ rowCount: 120 })
      // station_abc: 0 rows deleted
      .mockResolvedValueOnce({ rowCount: 0 })
      // station_missing: 42P01 undefined_table
      .mockRejectedValueOnce(Object.assign(new Error("missing"), { code: "42P01" }));

    const report = await runRetention();

    expect(report.totalDeleted).toBe(5120);
    expect(report.partial).toBe(false);
    expect(report.tables).toEqual([
      { table: "station_dom", deleted: 5120 },
      { table: "station_abc", deleted: 0 },
      { table: "station_missing", deleted: 0, skipped: "42P01" },
    ]);
    expect(redisMock.xTrim).toHaveBeenCalledWith(
      "toStore:DLQ",
      "MINID",
      expect.any(Number),
    );
  });

  it("rethrows unexpected database errors", async () => {
    setRetentionTables(() => []);
    pgMock.query.mockRejectedValueOnce(
      Object.assign(new Error("internal failure"), { code: "XX000" }),
    );

    await expect(runRetention()).rejects.toThrow("internal failure");
  });
});
