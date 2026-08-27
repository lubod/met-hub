import { describe, it, expect } from "vitest";
import { validateSection } from "../../server/settings";

describe("validateSection retention rules", () => {
  it("accepts an enabled valid configuration", () => {
    const out = validateSection("retention", {
      enabled: true,
      days: 800,
      hour: 2,
    }) as { enabled: boolean; days: number; hour: number };
    expect(out).toEqual({ enabled: true, days: 800, hour: 2 });
  });

  it("rejects a non-boolean enabled flag", () => {
    expect(() => validateSection("retention", { enabled: "yes" })).toThrow(
      /enabled/,
    );
  });

  it("rejects retention windows below the 366-day chart range", () => {
    expect(() =>
      validateSection("retention", { enabled: true, days: 30, hour: 3 }),
    ).toThrow(/400/);
  });

  it("rejects out-of-range run hours", () => {
    expect(() =>
      validateSection("retention", { enabled: true, days: 800, hour: 24 }),
    ).toThrow(/hour/);
  });
});

describe("validateSection mqtt and bridge rules", () => {
  it("rejects invalid topic base characters", () => {
    expect(() =>
      validateSection("mqtt", {
        enabled: true,
        haDiscovery: true,
        topicBase: "bad topic!",
      }),
    ).toThrow(/topicBase/);
  });

  it("rejects non-https upstream bridge URLs", () => {
    expect(() =>
      validateSection("bridge", {
        autoClaim: true,
        autoClaimMaxPerDay: 5,
        forwardUpstream: true,
        upstreamWuUrl: "http://weatherstation.wunderground.com/x",
        upstreamEcowittUrl: "https://api.ecowitt.net/api/v3/realtime",
      }),
    ).toThrow(/https/);
  });
});
