import { describe, it, expect } from "vitest";
import {
  STATION_SENSORS,
  STATION_DB_SENSORS,
} from "../../common/stationModel";
import { DOM_SENSORS } from "../../common/domModel";

describe("STATION_DB_SENSORS", () => {
  it("excludes columns that have no physical PG column", () => {
    const cols = STATION_DB_SENSORS.map((s) => s.col);
    expect(cols).not.toContain("maxdailygust");
    expect(cols).not.toContain("totalrain");
  });

  it("keeps every other station sensor queryable", () => {
    const excluded = ["maxdailygust", "totalrain"];
    const expected = STATION_SENSORS.map((s) => s.col).filter(
      (c) => !excluded.includes(c),
    );
  });

  it("still exposes maxdailygust/totalrain on the full list for UI panels", () => {
    const cols = STATION_SENSORS.map((s) => s.col);
    expect(cols).toContain("maxdailygust");
    expect(cols).toContain("totalrain");
  });
});

describe("DOM_SENSORS heat overlays", () => {
  it("includes all ten room air, floor, reqall, and heat-state booleans as queryable targets", () => {
    const cols = DOM_SENSORS.map((s) => s.col);
    for (const room of [
      "living_room",
      "guest_room",
      "entry_hall",
      "bath_down",
      "bed_room",
      "boys_room",
      "petra_room",
      "bath_up",
      "wardrobe",
      "hall_up",
    ]) {
      expect(cols).toContain(`${room}_air`);
      expect(cols).toContain(`${room}_floor`);
      expect(cols).toContain(`${room}_reqall`);
      expect(cols).toContain(`${room}_heat`);
    }
  });
});
