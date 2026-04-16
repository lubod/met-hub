import { describe, it, expect } from "vitest";
import StationGarni1025Arcus from "../../server/stationGarni1025Arcus";
import { IStationGarni1025ArcusDataRaw } from "../../common/stationModel";

const station = new StationGarni1025Arcus("test-garni-id");

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

describe("StationGarni1025Arcus.decodeData — unit conversions", () => {
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

describe("StationGarni1025Arcus.decodeData — null fields", () => {
  it("maxdailygust is null (not in Garni protocol)", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    expect(decoded.maxdailygust).toBeNull();
  });

  it("eventrain is null (not in Garni protocol)", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    expect(decoded.eventrain).toBeNull();
  });

  it("hourlyrain is null (not in Garni protocol)", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    expect(decoded.hourlyrain).toBeNull();
  });

  it("weeklyrain, monthlyrain, totalrain are null", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    expect(decoded.weeklyrain).toBeNull();
    expect(decoded.monthlyrain).toBeNull();
    expect(decoded.totalrain).toBeNull();
  });
});

describe("StationGarni1025Arcus.decodeData — derived fields", () => {
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

  it("feelslike equals temp in neutral zone (20°C, moderate wind)", () => {
    // 20°C is in neutral zone for feelslike
    const { decoded } = station.decodeData(baseRaw, "Test");
    expect(decoded.feelslike).toBe(decoded.temp);
  });
});

describe("StationGarni1025Arcus.decodeData — timestamp", () => {
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
