import { describe, it, expect } from "vitest";
import {
  deg2rad,
  rad2deg,
  round,
  avgWind,
  calculateDewPoint,
  calculateFeelsLike,
  getDayOfYear,
  calculateRa,
  calculatePenmanMonteithInstantaneousET0,
  calculateHargreavesET0,
} from "../../common/units";

describe("deg2rad", () => {
  it("converts 0 to 0", () => {
    expect(deg2rad(0)).toBe(0);
  });
  it("converts 180 to PI", () => {
    expect(deg2rad(180)).toBeCloseTo(Math.PI);
  });
  it("converts 360 to 2*PI", () => {
    expect(deg2rad(360)).toBeCloseTo(2 * Math.PI);
  });
});

describe("rad2deg", () => {
  it("converts 0 to 0", () => {
    expect(rad2deg(0)).toBe(0);
  });
  it("converts PI to 180", () => {
    expect(rad2deg(Math.PI)).toBeCloseTo(180);
  });
  it("round-trips with deg2rad", () => {
    expect(rad2deg(deg2rad(90))).toBeCloseTo(90);
    expect(rad2deg(deg2rad(270))).toBeCloseTo(270);
  });
});

describe("round", () => {
  it("rounds down correctly", () => {
    expect(round(1.2349, 2)).toBe(1.23);
  });
  it("rounds up correctly", () => {
    expect(round(1.2351, 2)).toBe(1.24);
  });
  it("rounds to 0 decimals", () => {
    expect(round(1.6, 0)).toBe(2);
    expect(round(1.4, 0)).toBe(1);
  });
  it("handles negative values (Math.round rounds toward +∞ at .5)", () => {
    // Math.round(-12.5) = -12, so round(-1.25, 1) = -1.2
    expect(round(-1.25, 1)).toBe(-1.2);
  });
  it("handles precision 1", () => {
    expect(round(23.456, 1)).toBe(23.5);
  });
});

describe("avgWind", () => {
  it("single direction passes through unchanged", () => {
    expect(avgWind([90])).toBe(90);
    expect(avgWind([0])).toBe(0);
    expect(avgWind([270])).toBe(270);
  });

  it("averages East and South to SE (~135°)", () => {
    expect(avgWind([90, 180])).toBeCloseTo(135, 0);
  });

  it("wraps correctly across North — 350° and 10° average near 0°", () => {
    const result = avgWind([350, 10]);
    // Should be near 0 (North), not 180 (South)
    expect(result < 20 || result > 340).toBe(true);
  });

  it("always returns a value in the [0, 360) range", () => {
    // Even degenerate inputs should stay in range
    for (const dirs of [[0, 180], [90, 270], [45, 135, 225, 315]]) {
      const result = avgWind(dirs);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(360);
    }
  });

  it("all same direction averages to that direction", () => {
    expect(avgWind([45, 45, 45])).toBeCloseTo(45, 0);
  });
});

describe("calculateDewPoint", () => {
  it("returns null when temp is null", () => {
    expect(calculateDewPoint(null, 60)).toBeNull();
  });

  it("returns null when humidity is null", () => {
    expect(calculateDewPoint(20, null)).toBeNull();
  });

  it("calculates correctly for 20°C, 60% humidity (~12°C)", () => {
    // Magnus formula: lambda = ln(60/100) + 17.67*20/263.5 ≈ 0.83 → dew ≈ 12°C
    expect(calculateDewPoint(20, 60)).toBeCloseTo(12, 0);
  });

  it("calculates correctly for 30°C, 80% humidity (~26°C)", () => {
    expect(calculateDewPoint(30, 80)).toBeCloseTo(26, 0);
  });

  it("equals temperature at 100% humidity", () => {
    const temp = 25;
    const dew = calculateDewPoint(temp, 100);
    expect(dew).toBeCloseTo(temp, 0);
  });

  it("is well below temperature at low humidity", () => {
    const dew = calculateDewPoint(30, 10);
    expect(dew).toBeLessThan(0);
  });
});

describe("calculateFeelsLike", () => {
  it("returns null when temp is null", () => {
    expect(calculateFeelsLike(null, 50, 10)).toBeNull();
  });

  it("applies Steadman apparent temperature in moderate zone", () => {
    expect(calculateFeelsLike(20, 50, 4)).toBe(19.1);
    expect(calculateFeelsLike(15, 70, 2)).toBe(14.5);
  });

  it("applies wind chill below 10°C with wind > 4.8 km/h (result < actual temp)", () => {
    const result = calculateFeelsLike(5, 50, 20);
    expect(result).toBeLessThan(5);
  });

  it("does not apply wind chill when wind speed <= 4.8 km/h, falls back to Steadman AT", () => {
    expect(calculateFeelsLike(5, 50, 4)).toBe(1.7);
  });

  it("applies heat index above 26.7°C with humidity >= 40% (result > actual temp)", () => {
    const result = calculateFeelsLike(35, 80, 5);
    expect(result).toBeGreaterThan(35);
  });

  it("does not apply heat index when humidity < 40%, falls back to Steadman AT", () => {
    expect(calculateFeelsLike(30, 30, 5)).toBe(29.2);
  });

  it("wind chill result gets colder with stronger wind", () => {
    const mild = calculateFeelsLike(0, 50, 10);
    const strong = calculateFeelsLike(0, 50, 50);
    expect(strong!).toBeLessThan(mild!);
  });
});

describe("getDayOfYear", () => {
  it("calculates January 1st correctly", () => {
    expect(getDayOfYear(new Date(2026, 0, 1))).toBe(1);
  });

  it("calculates December 31st correctly (non-leap year)", () => {
    expect(getDayOfYear(new Date(2026, 11, 31))).toBe(365);
  });

  it("calculates December 31st correctly (leap year)", () => {
    expect(getDayOfYear(new Date(2024, 11, 31))).toBe(366);
  });
});

describe("calculateRa", () => {
  it("calculates extraterrestrial radiation correctly", () => {
    // Expected Ra for lat 50.08, day 172 (summer solstice) is around 41-42 MJ/m^2/day
    const Ra = calculateRa(50.08, 172);
    expect(Ra).toBeGreaterThan(40);
    expect(Ra).toBeLessThan(43);
  });
});

describe("calculatePenmanMonteithInstantaneousET0", () => {
  it("returns null if temp or humidity is null", () => {
    expect(calculatePenmanMonteithInstantaneousET0(null, 50, 10, 500, 1013, 50.08, 172)).toBeNull();
    expect(calculatePenmanMonteithInstantaneousET0(20, null, 10, 500, 1013, 50.08, 172)).toBeNull();
  });

  it("calculates reasonable reference evapotranspiration rate", () => {
    // 20°C, 50% RH, 10km/h wind (2.78m/s), 600W/m^2 solar, 1013hPa pressure, lat 50.08, day 172
    const rate = calculatePenmanMonteithInstantaneousET0(20, 50, 10, 600, 1013, 50.08, 172);
    expect(rate).toBeGreaterThan(0);
    // Reference evapotranspiration daily rate (in mm/day) for these warm/sunny conditions should be reasonable
    expect(rate).toBeLessThan(12.0);
  });
});

describe("calculateHargreavesET0", () => {
  it("calculates reference evapotranspiration using temperature max/min", () => {
    const dailyET0 = calculateHargreavesET0(10, 25, 50.08, 172);
    expect(dailyET0).toBeGreaterThan(0);
    expect(dailyET0).toBeLessThan(10);
  });
});
