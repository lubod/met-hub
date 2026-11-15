import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { getForecast, getAstronomicalData } from "../../server/forecast";

const redisMock = vi.hoisted(() => ({
  get: vi.fn(),
  set: vi.fn().mockResolvedValue("OK"),
}));

vi.mock("../../server/redisClient", () => ({ default: redisMock }));

describe("Forecast service (forecast.ts)", () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    redisMock.get.mockReset();
    redisMock.set.mockReset().mockResolvedValue("OK");
    fetchSpy = vi.spyOn(globalThis, "fetch");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getForecast", () => {
    const sampleForecast = {
      properties: {
        meta: { updated_at: "2026-11-15T09:00:00Z" },
        timeseries: [{ time: "2026-11-15T10:00:00Z" }],
      },
    };

    it("returns cached forecast from quantized key without calling fetch", async () => {
      redisMock.get.mockResolvedValueOnce(JSON.stringify(sampleForecast));

      const res = await getForecast("48.2482", "17.0589");

      expect(redisMock.get).toHaveBeenCalledWith("FORECAST_CACHE_48.25_17.06");
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(res).toEqual(sampleForecast);
    });

    it("fetches from met.no on cache miss or corrupt cache and stores in Redis", async () => {
      redisMock.get.mockResolvedValueOnce("{corrupt");
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => sampleForecast,
      } as Response);

      const res = await getForecast("48.2482", "17.0589");

      expect(fetchSpy).toHaveBeenCalledWith(
        "https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=48.25&lon=17.06",
        expect.objectContaining({
          headers: expect.objectContaining({
            "User-Agent": "met-hub.com",
          }),
        }),
      );
      expect(redisMock.set).toHaveBeenCalledWith(
        "FORECAST_CACHE_48.25_17.06",
        JSON.stringify(sampleForecast),
        { EX: 3600 },
      );
      expect(res).toEqual(sampleForecast);
    });

    it("returns null on HTTP error or unexpected payload", async () => {
      redisMock.get.mockResolvedValueOnce(null);
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 503,
      } as Response);

      expect(await getForecast("48.2482", "17.0589")).toBeNull();

      redisMock.get.mockResolvedValueOnce(null);
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ properties: {} }),
      } as Response);

      expect(await getForecast("48.2482", "17.0589")).toBeNull();
    });
  });

  describe("getAstronomicalData", () => {
    const sampleAstro = {
      properties: { sunrise: { time: "2026-01-15T07:35+01:00" } },
    };

    it("uses +01:00 winter offset and quantized cache key on cache miss", async () => {
      redisMock.get.mockResolvedValueOnce(null);
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => sampleAstro,
      } as Response);

      const res = await getAstronomicalData(
        "48.2482",
        "17.0589",
        new Date("2026-01-15T12:00:00Z"),
      );

      expect(redisMock.get).toHaveBeenCalledWith(
        "ASTRONOMICAL_DATA_CACHE_48.25_17.06_2026-01-15",
      );
      expect(fetchSpy).toHaveBeenCalledWith(
        "https://api.met.no/weatherapi/sunrise/3.0/sun?lat=48.25&lon=17.06&date=2026-01-15&offset=%2B01%3A00",
        expect.anything(),
      );
      expect(redisMock.set).toHaveBeenCalledWith(
        "ASTRONOMICAL_DATA_CACHE_48.25_17.06_2026-01-15",
        JSON.stringify(sampleAstro),
        { EX: 3600 },
      );
      expect(res).toEqual(sampleAstro);
    });

    it("uses +02:00 summer CEST offset for July dates", async () => {
      redisMock.get.mockResolvedValueOnce(null);
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => sampleAstro,
      } as Response);

      await getAstronomicalData(
        "48.2482",
        "17.0589",
        new Date("2026-07-15T12:00:00Z"),
      );

      expect(fetchSpy).toHaveBeenCalledWith(
        "https://api.met.no/weatherapi/sunrise/3.0/sun?lat=48.25&lon=17.06&date=2026-07-15&offset=%2B02%3A00",
        expect.anything(),
      );
    });

    it("returns cached astronomical data without calling fetch and null on HTTP error", async () => {
      redisMock.get.mockResolvedValueOnce(JSON.stringify(sampleAstro));

      const cached = await getAstronomicalData(
        "48.2482",
        "17.0589",
        new Date("2026-01-15T12:00:00Z"),
      );
      expect(cached).toEqual(sampleAstro);
      expect(fetchSpy).not.toHaveBeenCalled();

      redisMock.get.mockResolvedValueOnce(null);
      fetchSpy.mockResolvedValueOnce({ ok: false, status: 500 } as Response);

      expect(
        await getAstronomicalData(
          "48.2482",
          "17.0589",
          new Date("2026-01-15T12:00:00Z"),
        ),
      ).toBeNull();
    });
  });
});
