import { describe, it, expect } from "vitest";
import StationJson from "../../server/stationJson";

const station = new StationJson("test-id");

const baseJson = {
  timestamp: "2024-06-15 12:00:00",
  temp: 22.5,
  humidity: 45,
  windspeed: 15.2,
  windgust: 20.4,
  maxdailygust: 25.0,
  feelslike: 21.8,
  dewpt: 10.1,
  rainrate: 0.0,
  dailyrain: 1.5,
  totalrain: 105.2,
  pressurerel: 1013.2,
  pressureabs: 1008.5,
  solarradiation: 600,
  uv: 4,
  tempin: 21.0,
  humidityin: 50,
  winddir: 225,
};

describe("StationJson.decodeData", () => {
  it("passes metric values through rounded to proper precision", () => {
    const { decoded } = station.decodeData(baseJson, "Test");
    expect(decoded.temp).toBe(22.5);
    expect(decoded.humidity).toBe(45);
    expect(decoded.windspeed).toBe(15.2);
    expect(decoded.windgust).toBe(20.4);
    expect(decoded.maxdailygust).toBe(25.0);
    expect(decoded.feelslike).toBe(21.8);
    expect(decoded.dewpt).toBe(10.1);
    expect(decoded.dailyrain).toBe(1.5);
    expect(decoded.totalrain).toBe(105.2);
    expect(decoded.pressurerel).toBe(1013.2);
    expect(decoded.pressureabs).toBe(1008.5);
    expect(decoded.solarradiation).toBe(600);
    expect(decoded.uv).toBe(4);
    expect(decoded.tempin).toBe(21.0);
    expect(decoded.humidityin).toBe(50);
    expect(decoded.winddir).toBe(225);
  });

  it("calculates dewpt and feelslike when omitted but base fields exist", () => {
    const incompletePayload = {
      timestamp: "2024-06-15 12:00:00",
      temp: 25.0,
      humidity: 50,
      windspeed: 10.0,
    };
    const { decoded } = station.decodeData(incompletePayload, "Test");
    expect(decoded.dewpt).not.toBeNull();
    expect(decoded.feelslike).not.toBeNull();
  });
});
