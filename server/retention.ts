import pool from "./pgPool";
import redisClient from "./redisClient";
import { getSettings } from "./settings";

/**
 * Retention job: bounds PostgreSQL growth by deleting samples older than
 * the configured window. Runs in duration-capped batches so a first run on
 * a large table can never pin the database for an hour — anything left
 * over is picked up on the next cycle.
 */

export interface RetentionReport {
  startedAt: string;
  finishedAt: string;
  tables: Array<{ table: string; deleted: number; skipped?: string }>;
  totalDeleted: number;
  partial: boolean;
  durationMs: number;
}

const BATCH = 5000;
const MAX_DURATION_MS = 30 * 60 * 1000;

// Populated by the store bootstrap: measurement tables without importing
// the config registry (avoids a web<->store cycle).
let tableSource: () => Iterable<string> = () => [];

export function setRetentionTables(source: () => Iterable<string>): void {
  tableSource = source;
}

function allStationsTables(): Iterable<string> {
  return tableSource();
}

function cutoffIso(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

async function deleteOldRows(
  table: string,
  cutoff: string,
  deadline: number,
): Promise<{ deleted: number; partial: boolean }> {
  let deleted = 0;
  // eslint-disable-next-line no-await-in-loop
  for (;;) {
    // eslint-disable-next-line no-await-in-loop
    const res = await pool.query(
      `DELETE FROM public."${table}"
       WHERE "timestamp" IN (
         SELECT "timestamp" FROM public."${table}"
         WHERE "timestamp" < $1
         ORDER BY "timestamp"
         LIMIT ${BATCH}
       )`,
      [cutoff],
    );
    deleted += res.rowCount ?? 0;
    if ((res.rowCount ?? 0) < BATCH) return { deleted, partial: false };
    if (Date.now() > deadline) return { deleted, partial: true };
  }
}

export async function runRetention(): Promise<RetentionReport> {
  const startedAt = new Date();
  const deadline = startedAt.getTime() + MAX_DURATION_MS;
  const { days } = getSettings().retention;
  const cutoff = cutoffIso(days);

  const tables = new Set<string>(["station_dom"]);
  // eslint-disable-next-line no-restricted-syntax, no-await-in-loop
  for (const m of allStationsTables()) tables.add(m);

  const report: RetentionReport = {
    startedAt: startedAt.toISOString(),
    finishedAt: "",
    tables: [],
    totalDeleted: 0,
    partial: false,
    durationMs: 0,
  };

  // eslint-disable-next-line no-restricted-syntax
  for (const table of tables) {
    if (Date.now() > deadline) {
      report.tables.push({ table, deleted: 0, skipped: "duration cap" });
      report.partial = true;
      continue;
    }
    try {
      // eslint-disable-next-line no-await-in-loop
      const { deleted, partial } = await deleteOldRows(table, cutoff, deadline);
      report.tables.push({ table, deleted });
      if (partial) report.partial = true;
      report.totalDeleted += deleted;
    } catch (err: unknown) {
      const { code } = err as { code?: string };
      // 42P01: table missing; 42703: legacy table — nothing to retain
      if (code === "42P01" || code === "42703") {
        report.tables.push({ table, deleted: 0, skipped: code });
        continue;
      }
      throw err;
    }
  }

  // DLQ: keep the last 30 days of poison messages for inspection
  try {
    // eslint-disable-next-line no-await-in-loop
    await redisClient.xTrim("toStore:DLQ", "MINID", Date.now() - 30 * 86_400_000);
  } catch (err) {
    console.error("retention: DLQ trim failed:", err);
  }

  report.finishedAt = new Date().toISOString();
  report.durationMs = Date.now() - startedAt.getTime();
  return report;
}
