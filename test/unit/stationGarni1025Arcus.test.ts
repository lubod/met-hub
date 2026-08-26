import { describe, it, expect } from "vitest";
import StationWU from "../../server/stationWU";
import { IStationGarni1025ArcusDataRaw } from "../../common/stationModel";

const station = new StationWU("test-garni-id");

const baseRaw: IStationGarni1025ArcusDataRaw = {
  ID: "test-id",
  PASSWORD: "test-pass",
  action: "updateraww",
  realtime: "1",
  rtfreq: 5,
  dateutc: "2024-06-15 12:00:00",
  baromin: 29.500,     // 998.8 hPa
  tempf: 68.0,         // 20.0°C
  dewptf: 50.0,        // 10.0°C
  humidity: 55,
  windspeedmph: 6.25,  // 10.0 km/h
  windgustmph: 12.5,   // 20.0 km/h
  winddir: 90,
  rainin: 0.0,
  dailyrainin: 0.2,    // 5.1 mm
  solarradiation: 300.0,
  UV: 2,
  indoortempf: 71.6,   // 22.0°C
  indoorhumidity: 50,
};

describe("StationWU.decodeData — Garni payload unit conversions", () => {
  it("converts outdoor temperature from °F to °C", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    // (5/9) * (68 - 32) = 20.0
    expect(decoded.temp).toBe(20.0);
  });

  it("converts indoor temperature from °F to °C", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    // (5/9) * (71.6 - 32) = 22.0
    expect(decoded.tempin).toBe(22.0);
  });

  it("converts absolute pressure from inHg to hPa", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    // 29.500 * 33.8639 ≈ 998.8
    expect(decoded.pressureabs).toBeCloseTo(998.8, 0);
  });

  it("pressurerel is always null (Garni does not report relative pressure)", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    expect(decoded.pressurerel).toBeNull();
  });

  it("converts wind speed from mph to km/h", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    expect(decoded.windspeed).toBe(10.0);
  });

  it("converts wind gust from mph to km/h", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    expect(decoded.windgust).toBe(20.0);
  });

  it("converts rain rate from inches to mm", () => {
    const rainy = { ...baseRaw, rainin: 0.5 };
    const { decoded } = station.decodeData(rainy, "Test");
    // 0.5 * 25.4 = 12.7
    expect(decoded.rainrate).toBe(12.7);
  });

  it("converts daily rain from inches to mm", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    // 0.2 * 25.4 = 5.08 → rounded to 5.1
    expect(decoded.dailyrain).toBeCloseTo(5.1, 1);
  });

  it("passes humidity through", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    expect(decoded.humidity).toBe(55);
    expect(decoded.humidityin).toBe(50);
  });

  it("passes wind direction through", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    expect(decoded.winddir).toBe(90);
  });
});

describe("StationWU.decodeData — Garni standard vs extended fields", () => {
  it("maxdailygust, eventrain, hourlyrain, weeklyrain, monthlyrain, totalrain default to null when omitted", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    expect(decoded.maxdailygust).toBeNull();
    expect(decoded.eventrain).toBeNull();
    expect(decoded.hourlyrain).toBeNull();
    expect(decoded.weeklyrain).toBeNull();
    expect(decoded.monthlyrain).toBeNull();
    expect(decoded.totalrain).toBeNull();
  });

  it("decodes optional extended rain and maxdailygust when present in payload", () => {
    const extended = {
      ...baseRaw,
      maxdailygustmph: 15.0, // 24.0 km/h
      eventrainin: 0.1,      // 2.54 -> 2.5 mm
      hourlyrainin: 0.2,     // 5.08 -> 5.1 mm
      weeklyrainin: 0.8,     // 20.32 -> 20.3 mm
      monthlyrainin: 1.5,    // 38.1 mm
      totalrainin: 4.0,      // 101.6 mm
    };
    const { decoded } = station.decodeData(extended, "Test");
    expect(decoded.maxdailygust).toBe(24.0);
    expect(decoded.eventrain).toBeCloseTo(2.5, 1);
    expect(decoded.hourlyrain).toBeCloseTo(5.1, 1);
    expect(decoded.weeklyrain).toBeCloseTo(20.3, 1);
    expect(decoded.monthlyrain).toBe(38.1);
    expect(decoded.totalrain).toBe(101.6);
  });
});

describe("StationWU.decodeData — Garni derived fields", () => {
  it("dewpt is decoded from station's dewptf field (not recalculated)", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    // (5/9) * (50 - 32) = 10.0°C
    expect(decoded.dewpt).toBe(10.0);
  });

  it("feelslike is computed (not null)", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    expect(decoded.feelslike).toBeDefined();
    expect(typeof decoded.feelslike).toBe("number");
  });

  it("feelslike is calculated dynamically using Steadman AT (20°C, moderate wind)", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    expect(decoded.feelslike).toBe(18.3);
  });
});

describe("StationWU.decodeData — Garni timestamp", () => {
  it("parses a valid UTC dateutc string", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    expect(decoded.timestamp.getUTCFullYear()).toBe(2024);
    expect(decoded.timestamp.getUTCMonth()).toBe(5); // June
  });

  it("falls back to now when dateutc is 'now'", () => {
    const before = Date.now();
    const { decoded } = station.decodeData({ ...baseRaw, dateutc: "now" }, "Test");
    expect(decoded.timestamp.getTime()).toBeGreaterThanOrEqual(before);
  });
});
