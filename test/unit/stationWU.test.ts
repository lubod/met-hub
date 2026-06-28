import { describe, it, expect } from "vitest";
import StationWU from "../../server/stationWU";

const station = new StationWU("test-id");

const baseRawGoGen = {
  PASSKEY: "test-passkey",
  stationtype: "GW2000A_V2.1.4",
  dateutc: "2024-06-15 12:00:00",
  tempinf: 68.0,       // 20.0°C
  humidityin: 55,
  baromrelin: 29.921,  // ~1013.2 hPa
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

const baseRawGarni = {
  ID: "test-id",
  PASSWORD: "test-password",
  action: "updateraw",
  realtime: "1",
  rtfreq: 5,
  dateutc: "2024-06-15 12:00:00",
  baromin: 29.500,  // 998.4 hPa
  tempf: 59.0,         // 15.0°C
  dewptf: 50.0,        // 10.0°C
  humidity: 65,
  windspeedmph: 6.25,  // 10.0 km/h
  windgustmph: 12.5,   // 20.0 km/h
  winddir: 180,
  rainin: 0.0,
  dailyrainin: 0.1,    // 2.5 mm
  solarradiation: 500.0,
  UV: 3,
  indoortempf: 68.0,   // 20.0°C
  indoorhumidity: 55,
};

describe("StationWU.decodeData — GoGen payload", () => {
  it("converts all parameters correctly", () => {
    const { decoded } = station.decodeData(baseRawGoGen, "Test");
    expect(decoded.temp).toBe(15.0);
    expect(decoded.tempin).toBe(20.0);
    expect(decoded.pressurerel).toBeCloseTo(1013.2, 0);
    expect(decoded.pressureabs).toBeCloseTo(998.8, 0);
    expect(decoded.windspeed).toBe(10.0);
    expect(decoded.windgust).toBe(20.0);
    expect(decoded.maxdailygust).toBe(30.0);
    expect(decoded.dailyrain).toBeCloseTo(2.5, 1);
    expect(decoded.totalrain).toBe(254.0);
    expect(decoded.humidity).toBe(65);
    expect(decoded.humidityin).toBe(55);
    expect(decoded.winddir).toBe(180);
    expect(decoded.solarradiation).toBe(500);
    expect(decoded.uv).toBe(3);
  });
});

describe("StationWU.decodeData — Garni payload", () => {
  it("converts Garni specific fields and resolves aliases correctly", () => {
    const { decoded } = station.decodeData(baseRawGarni, "Test");
    expect(decoded.temp).toBe(15.0);
    expect(decoded.tempin).toBe(20.0);
    expect(decoded.pressureabs).toBeCloseTo(998.8, 0);
    expect(decoded.pressurerel).toBeNull();
    expect(decoded.windspeed).toBe(10.0);
    expect(decoded.windgust).toBe(20.0);
    expect(decoded.dailyrain).toBeCloseTo(2.5, 1);
    expect(decoded.humidity).toBe(65);
    expect(decoded.humidityin).toBe(55);
    expect(decoded.winddir).toBe(180);
    expect(decoded.solarradiation).toBe(500);
    expect(decoded.uv).toBe(3);
    // Garni passes dewptf: 50f -> 10c
    expect(decoded.dewpt).toBe(10.0);
  });
});
