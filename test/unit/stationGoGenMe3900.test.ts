import { describe, it, expect } from "vitest";
import StationGoGenMe3900 from "../../server/stationGoGenMe3900";
import { IStationGoGenMe3900DataRaw } from "../../common/stationModel";

const station = new StationGoGenMe3900("test-id");

// A complete, known raw payload in the EasyWeatherV1.5.2 protocol
const baseRaw: IStationGoGenMe3900DataRaw = {
  PASSKEY: "test-passkey",
  stationtype: "GW2000A_V2.1.4",
  dateutc: "2024-06-15 12:00:00",
  tempinf: 68.0,       // 20.0°C
  humidityin: 55,
  baromrelin: 29.921,  // ~1013.2 hPa  (29.921 * 33.8639 = 1013.17 → 1013.2)
  baromabsin: 29.500,  // 998.4 hPa
  tempf: 59.0,         // 15.0°C
  humidity: 65,
  winddir: 180,
  windspeedmph: 6.25,  // 10.0 km/h
  windgustmph: 12.5,   // 20.0 km/h
  maxdailygust: 18.75, // 30.0 km/h
  rainratein: 0.0,
  eventrainin: 0.0,
  hourlyrainin: 0.0,
  dailyrainin: 0.1,    // 2.5 mm
  weeklyrainin: 0.5,   // 12.7 mm
  monthlyrainin: 2.0,  // 50.8 mm
  totalrainin: 10.0,   // 254.0 mm
  solarradiation: 500.0,
  uv: 3,
  wh65batt: 0,
  freq: "868M",
  model: "WS2900",
};

describe("StationGoGenMe3900.decodeData — unit conversions", () => {
  it("converts outdoor temperature from °F to °C", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    // (5/9) * (59 - 32) = 15.0
    expect(decoded.temp).toBe(15.0);
  });

  it("converts indoor temperature from °F to °C", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    // (5/9) * (68 - 32) = 20.0
    expect(decoded.tempin).toBe(20.0);
  });

  it("converts freezing point (32°F → 0°C)", () => {
    const { decoded } = station.decodeData({ ...baseRaw, tempf: 32 }, "Test");
    expect(decoded.temp).toBe(0.0);
  });

  it("converts relative pressure from inHg to hPa", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    // 29.921 * 33.8639 ≈ 1013.2
    expect(decoded.pressurerel).toBeCloseTo(1013.2, 0);
  });

  it("converts absolute pressure from inHg to hPa", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    // 29.500 * 33.8639 ≈ 998.8
    expect(decoded.pressureabs).toBeCloseTo(998.8, 0);
  });

  it("converts wind speed from mph to km/h", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    // 6.25 * 1.6 = 10.0
    expect(decoded.windspeed).toBe(10.0);
  });

  it("converts wind gust from mph to km/h", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    expect(decoded.windgust).toBe(20.0);
  });

  it("converts daily rain from inches to mm", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    // 0.1 * 25.4 = 2.5 (rounds to 1 decimal)
    expect(decoded.dailyrain).toBeCloseTo(2.5, 1);
  });

  it("converts total rain from inches to mm", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    // 10.0 * 25.4 = 254.0
    expect(decoded.totalrain).toBe(254.0);
  });

  it("passes humidity through rounded to integer", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    expect(decoded.humidity).toBe(65);
    expect(decoded.humidityin).toBe(55);
  });

  it("passes wind direction through unchanged", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    expect(decoded.winddir).toBe(180);
  });

  it("passes solar radiation through rounded to integer", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    expect(decoded.solarradiation).toBe(500);
  });

  it("passes place name through", () => {
    const { decoded } = station.decodeData(baseRaw, "My Garden");
    expect(decoded.place).toBe("My Garden");
  });

  it("minuterain is always null (set by aggregator, not decoder)", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    expect(decoded.minuterain).toBeNull();
  });
});

describe("StationGoGenMe3900.decodeData — derived fields", () => {
  it("computes dewpoint from temp and humidity", () => {
    const { decoded } = station.decodeData(baseRaw, "Test");
    // 15°C, 65% humidity → dewpoint ≈ 8.5°C (Magnus formula)
    expect(decoded.dewpt).toBeCloseTo(8.5, 0);
  });

  it("feelslike equals temp in neutral zone (no wind chill, no heat index)", () => {
    // 15°C is in neutral zone; windspeed = 10 km/h but temp > 10 so no wind chill
    const { decoded } = station.decodeData(baseRaw, "Test");
    expect(decoded.feelslike).toBe(decoded.temp);
  });

  it("feelslike is lower than temp in cold + windy conditions", () => {
    const coldWindy = { ...baseRaw, tempf: 32, windspeedmph: 25 }; // 0°C, 40 km/h
    const { decoded } = station.decodeData(coldWindy, "Test");
    expect(decoded.feelslike).toBeLessThan(decoded.temp);
  });
});

describe("StationGoGenMe3900.decodeData — timestamp parsing", () => {
  it("parses a valid UTC dateutc string", () => {
    const { date, decoded } = station.decodeData(baseRaw, "Test");
    expect(decoded.timestamp).toBeInstanceOf(Date);
    expect(decoded.timestamp.getUTCFullYear()).toBe(2024);
    expect(decoded.timestamp.getUTCMonth()).toBe(5); // June = 5
    expect(decoded.timestamp.getUTCDate()).toBe(15);
    expect(date).toEqual(decoded.timestamp);
  });

  it("falls back to current time when dateutc is 'now'", () => {
    const before = Date.now();
    const { decoded } = station.decodeData({ ...baseRaw, dateutc: "now" }, "Test");
    const after = Date.now();
    expect(decoded.timestamp.getTime()).toBeGreaterThanOrEqual(before);
    expect(decoded.timestamp.getTime()).toBeLessThanOrEqual(after);
  });

  it("falls back to current time when dateutc is garbage", () => {
    const before = Date.now();
    const { decoded } = station.decodeData({ ...baseRaw, dateutc: "not-a-date" }, "Test");
    expect(decoded.timestamp.getTime()).toBeGreaterThanOrEqual(before);
  });
});
