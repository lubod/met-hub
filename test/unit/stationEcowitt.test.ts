import { describe, it, expect } from "vitest";
import StationEcowitt from "../../server/stationEcowitt";

const station = new StationEcowitt("test-id");

// A real Ecowitt payload with metric field names
const baseRawEcowitt = {
  PASSKEY: "test-passkey",
  stationtype: "GW2000A_V2.1.4",
  dateutc: "2024-06-15 12:00:00",
  tempinc: "20.0",       // Indoor Celsius
  humidityin: "50",      // Indoor Humidity %
  baromrelhpa: "1013.2", // Relative hPa
  baromabshpa: "1008.5", // Absolute hPa
  tempc: "15.0",         // Outdoor Celsius
  humidity: "65",        // Outdoor Humidity %
  winddir: "180",        // Wind direction
  windspeedkmh: "10.0",  // Wind speed km/h
  windgustkmh: "20.0",   // Wind gust km/h
  maxdailygustkmh: "30.0", // Max daily gust km/h
  rainratemm: "0.0",
  eventrainmm: "0.0",
  hourlyrainmm: "0.0",
  dailyrainmm: "2.5",    // Daily rain mm
  weeklyrainmm: "12.7",
  monthlyrainmm: "50.8",
  totalrainmm: "254.0",
  solarradiation: "500",
  uv: "3",
};

describe("StationEcowitt.decodeData — metric payload", () => {
  it("decodes metric parameters directly without conversion errors", () => {
    const { decoded } = station.decodeData(baseRawEcowitt, "Test");
    expect(decoded.temp).toBe(15.0);
    expect(decoded.tempin).toBe(20.0);
    expect(decoded.pressurerel).toBe(1013.2);
    expect(decoded.pressureabs).toBe(1008.5);
    expect(decoded.windspeed).toBe(10.0);
    expect(decoded.windgust).toBe(20.0);
    expect(decoded.maxdailygust).toBe(30.0);
    expect(decoded.dailyrain).toBe(2.5);
    expect(decoded.totalrain).toBe(254.0);
    expect(decoded.humidity).toBe(65);
    expect(decoded.humidityin).toBe(50);
    expect(decoded.winddir).toBe(180);
    expect(decoded.solarradiation).toBe(500);
    expect(decoded.uv).toBe(3);
    expect(decoded.dewpt).toBeCloseTo(8.5, 1); // Auto-calculated dewpoint
  });

  it("falls back to converting imperial fields when metric fields are missing", () => {
    const fallbackRaw = {
      dateutc: "2024-06-15 12:00:00",
      tempf: "59.0",         // 15.0°C
      tempinf: "68.0",       // 20.0°C
      baromrelin: "29.921",  // ~1013.2 hPa
      baromabsin: "29.500",  // 998.8 hPa
      windspeedmph: "6.25",  // 10.0 km/h
      windgustmph: "12.5",   // 20.0 km/h
      dailyrainin: "0.1",    // 2.5 mm
    };

    const { decoded } = station.decodeData(fallbackRaw, "Test");
    expect(decoded.temp).toBe(15.0);
    expect(decoded.tempin).toBe(20.0);
    expect(decoded.pressurerel).toBeCloseTo(1013.2, 0);
    expect(decoded.pressureabs).toBeCloseTo(998.8, 0);
    expect(decoded.windspeed).toBe(10.0);
    expect(decoded.windgust).toBe(20.0);
    expect(decoded.dailyrain).toBeCloseTo(2.5, 1);
  });
});
