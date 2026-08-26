import pool from "./pgPool";
import redisClient from "./redisClient";
import { AppError } from "./state";

/**
 * Runtime application settings, persisted in PostgreSQL (`settings` table —
 * the source of truth), cached in memory per process and kept fresh via the
 * SETTINGS_CHANGED pub/sub channel with a 60 s fallback poll.
 *
 * Env vars are only first-boot defaults: a value saved from the settings UI
 * is pinned in PG and env changes no longer affect it.
 */

export interface MqttSettings {
  enabled: boolean;
  haDiscovery: boolean;
  topicBase: string;
}

export interface RetentionSettings {
  days: number;
  hour: number;
}

export interface BridgeSettings {
  autoClaim: boolean;
  autoClaimMaxPerDay: number;
  forwardUpstream: boolean;
  upstreamWuUrl: string;
  upstreamEcowittUrl: string;
  ownerId: string;
}

export interface AppSettings {
  mqtt: MqttSettings;
  retention: RetentionSettings;
  bridge: BridgeSettings;
}

export const SETTINGS_CHANGED = "SETTINGS_CHANGED";

const DEFAULTS: AppSettings = {
  mqtt: { enabled: false, haDiscovery: true, topicBase: "methub" },
  retention: { days: 730, hour: 3 },
  bridge: {
    autoClaim: false,
    autoClaimMaxPerDay: 5,
    forwardUpstream: false,
    upstreamWuUrl:
      "https://weatherstation.wunderground.com/weatherstation/updateweatherstation.php",
    upstreamEcowittUrl: "https://api.ecowitt.net/api/v3/realtime",
    ownerId: "",
  },
};

function envDefaults(): AppSettings {
  const s: AppSettings = JSON.parse(JSON.stringify(DEFAULTS));
  if (process.env.MQTT_ENABLED === "true") s.mqtt.enabled = true;
  if (process.env.RETENTION_DAYS) {
    const n = parseInt(process.env.RETENTION_DAYS, 10);
    if (Number.isFinite(n)) s.retention.days = n;
  }
  if (process.env.BRIDGE_AUTOCLAIM === "true") s.bridge.autoClaim = true;
  if (process.env.BRIDGE_OWNER_ID) s.bridge.ownerId = process.env.BRIDGE_OWNER_ID;
  return s;
}

let current: AppSettings = envDefaults();
let initialized = false;

type Section = keyof AppSettings;
const SECTIONS: Section[] = ["mqtt", "retention", "bridge"];

export function validateSection(
  section: Section,
  value: Record<string, unknown>,
): Record<string, unknown> {
  if (section === "mqtt") {
    if (typeof value.enabled !== "boolean") throw new AppError(400, "mqtt.enabled must be boolean");
    if (typeof value.haDiscovery !== "boolean") throw new AppError(400, "mqtt.haDiscovery must be boolean");
    if (typeof value.topicBase !== "string" || !/^[a-z0-9_-]{1,32}$/i.test(value.topicBase))
      throw new AppError(400, "mqtt.topicBase must be 1-32 chars [a-z0-9_-]");
  } else if (section === "retention") {
    const days = Number(value.days);
    const hour = Number(value.hour);
    // Charts serve up to 366-day ranges — keep at least that much history.
    if (!Number.isFinite(days) || days < 400 || days > 3650)
      throw new AppError(400, "retention.days must be between 400 and 3650");
    if (!Number.isFinite(hour) || hour < 0 || hour > 23)
      throw new AppError(400, "retention.hour must be 0-23");
  } else if (section === "bridge") {
    if (typeof value.autoClaim !== "boolean") throw new AppError(400, "bridge.autoClaim must be boolean");
    const perDay = Number(value.autoClaimMaxPerDay);
    if (!Number.isFinite(perDay) || perDay < 0 || perDay > 1000)
      throw new AppError(400, "bridge.autoClaimMaxPerDay must be 0-1000");
    if (typeof value.forwardUpstream !== "boolean")
      throw new AppError(400, "bridge.forwardUpstream must be boolean");
    for (const key of ["upstreamWuUrl", "upstreamEcowittUrl"] as const) {
      if (typeof value[key] !== "string" || !/^https:\/\/[\w.-]+/.test(value[key]))
        throw new AppError(400, `${key} must be an https URL`);
    }
    if (value.ownerId != null && typeof value.ownerId !== "string")
      throw new AppError(400, "bridge.ownerId must be a string");
  }
  return value;
}

function mergeSection(base: AppSettings, section: Section, patch: Record<string, unknown>): AppSettings {
  const next = JSON.parse(JSON.stringify(base)) as AppSettings;
  next[section] = { ...next[section], ...patch } as never;
  return next;
}

export async function ensureSettingsTable(): Promise<void> {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS public.settings (
       key        text PRIMARY KEY,
       value      jsonb NOT NULL,
       updated_at timestamptz NOT NULL DEFAULT now(),
       updated_by text NOT NULL
     )`,
  );
}

async function reload(): Promise<void> {
  try {
    const res = await pool.query("SELECT key, value FROM public.settings");
    const next = envDefaults();
    for (const row of res.rows) {
      if (SECTIONS.includes(row.key)) {
        next[row.key as Section] = { ...next[row.key as Section], ...row.value };
      }
    }
    current = next;
  } catch (err) {
    // Keep the last-known good values; a transient DB hiccup must not
    // disable MQTT or change retention mid-flight.
    console.error("settings: reload failed, keeping previous values:", err);
  }
}

export async function initSettings(): Promise<void> {
  await ensureSettingsTable();
  await reload();
  initialized = true;

  const sub = redisClient.duplicate();
  await sub.connect();
  await sub.subscribe(SETTINGS_CHANGED, () => {
    // reload never rejects (errors are caught and logged inside)
    reload();
  });
  // Pub/sub can drop messages around reconnects — poll as a bounded fallback.
  setInterval(() => reload(), 60_000).unref();
}

export function getSettings(): AppSettings {
  return current;
}

export function isInitialized(): boolean {
  return initialized;
}

export async function updateSection(
  section: Section,
  patch: Record<string, unknown>,
  updatedBy: string,
): Promise<AppSettings> {
  const validated = validateSection(section, patch);
  const next = mergeSection(current, section, validated);
  await pool.query(
    `INSERT INTO public.settings (key, value, updated_by) VALUES ($1, $2, $3)
     ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = now(), updated_by = $3`,
    [section, JSON.stringify(next[section]), updatedBy],
  );
  current = next;
  await redisClient.publish(SETTINGS_CHANGED, section);
  return current;
}

export function assertInitialized(): void {
  if (!initialized) {
    // initSettings() runs at boot; API handlers can only be reached after.
    throw new Error("settings not initialized");
  }
}
