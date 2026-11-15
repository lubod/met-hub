import { describe, expect, it } from "vitest";
import { dom } from "../../server/dom";

describe("Dom.decodeData", () => {
  const baseRaw: any = {
    timestamp: new Date().toISOString(),
    PASSKEY: "test-passkey",
    dateutc: "2026-11-06 18:00:00",
    vonku: { temp: 15.5, humidity: 65, rain: 0, text: "" },
    tarif: { tarif: 1, text: "" },
    obyvacka_vzduch: { temp: 22.1, req: 0, reqall: 21, useroffset: 0, maxoffset: 5, kuri: 0, low: 0, leto: 0, text: "" },
    obyvacka_podlaha: { temp: 23.0, req: 0, reqall: 21, useroffset: 0, maxoffset: 5, kuri: 1, low: 0, leto: 0, text: "" },
    pracovna_vzduch: { temp: 21.5, req: 0, reqall: 21, useroffset: 0, maxoffset: 5, kuri: 0, low: 0, leto: 0, text: "" },
    pracovna_podlaha: { temp: 22.2, req: 0, reqall: 21, useroffset: 0, maxoffset: 5, kuri: 0, low: 0, leto: 0, text: "" },
    spalna_vzduch: { temp: 21.0, req: 0, reqall: 21, useroffset: 0, maxoffset: 5, kuri: 0, low: 0, leto: 0, text: "" },
    spalna_podlaha: { temp: 22.0, req: 0, reqall: 21, useroffset: 0, maxoffset: 5, kuri: 0, low: 0, leto: 0, text: "" },
    chalani_vzduch: { temp: 21.0, req: 0, reqall: 21, useroffset: 0, maxoffset: 5, kuri: 0, low: 0, leto: 0, text: "" },
    chalani_podlaha: { temp: 22.0, req: 0, reqall: 21, useroffset: 0, maxoffset: 5, kuri: 0, low: 0, leto: 0, text: "" },
    petra_vzduch: { temp: 21.0, req: 0, reqall: 21, useroffset: 0, maxoffset: 5, kuri: 0, low: 0, leto: 0, text: "" },
    petra_podlaha: { temp: 22.0, req: 0, reqall: 21, useroffset: 0, maxoffset: 5, kuri: 0, low: 0, leto: 0, text: "" },
  };

  it("decodes valid payload with outdoor temp correctly", () => {
    const { decoded } = dom.decodeData(baseRaw, "Dom");
    expect(decoded.temp).toBe(15.5);
    expect(decoded.humidity).toBe(65);
    expect(decoded.place).toBe("Dom");
    expect(decoded.living_room_air).toBe(22.1);
    expect(decoded.living_room_heat).toBe(true);
  });

  it("defaults temp to null when vonku.temp is null without throwing TypeError", () => {
    const raw = { ...baseRaw, vonku: { ...baseRaw.vonku, temp: null } };
    const { decoded } = dom.decodeData(raw, "Dom");
    expect(decoded.temp).toBeNull();
  });

  it("defaults temp to null when vonku is null without throwing TypeError", () => {
    const raw = { ...baseRaw, vonku: null };
    const { decoded } = dom.decodeData(raw, "Dom");
    expect(decoded.temp).toBeNull();
  });

  it("defaults temp to null when vonku is undefined without throwing TypeError", () => {
    const { vonku: _omitted, ...raw } = baseRaw;
    const { decoded } = dom.decodeData(raw as any, "Dom");
    expect(decoded.temp).toBeNull();
  });

  it("accepts top-level temp when vonku is absent", () => {
    const { vonku: _omitted, ...raw } = baseRaw;
    const withTopTemp = { ...raw, temp: 18.2 };
    const { decoded } = dom.decodeData(withTopTemp as any, "Dom");
    expect(decoded.temp).toBe(18.2);
  });

  it("defaults top-level temp == null to null without throwing TypeError", () => {
    const { vonku: _omitted, ...raw } = baseRaw;
    const withTopNull = { ...raw, temp: null };
    const { decoded } = dom.decodeData(withTopNull as any, "Dom");
    expect(decoded.temp).toBeNull();
  });

  it("preserves 0 as a valid temperature reading", () => {
    const raw = { ...baseRaw, vonku: { ...baseRaw.vonku, temp: 0 } };
    const { decoded } = dom.decodeData(raw, "Dom");
    expect(decoded.temp).toBe(0);
  });

  it("handles missing room blocks safely without throwing TypeError", () => {
    const minimalRaw = {
      timestamp: new Date().toISOString(),
      PASSKEY: "test-passkey",
      temp: null,
    };
    const { decoded } = dom.decodeData(minimalRaw as any, "Dom");
    expect(decoded.temp).toBeNull();
    expect(decoded.humidity).toBeNull();
    expect(decoded.living_room_air).toBeNull();
    expect(decoded.living_room_heat).toBe(false);
  });

  it("exposes expected station metadata via getters", () => {
    expect(dom.getStationID()).toBe("dom");
    expect(dom.getTables()).toEqual(["station_dom"]);
    expect(dom.getSensors().length).toBeGreaterThan(0);
  });

  it("aggregateRawData2Minute returns null on empty input and zeroes seconds on first sample", () => {
    expect(dom.aggregateRawData2Minute(0, [])).toBeNull();

    const src = {
      ...dom.decodeData(baseRaw, "Dom").decoded,
      timestamp: new Date("2026-11-15T09:15:42.345Z"),
    };
    const agg = dom.aggregateRawData2Minute(0, [src]);
    expect(agg).not.toBeNull();
    expect(agg).not.toBe(src);
    expect(agg!.timestamp.toISOString()).toBe("2026-11-15T09:15:00.000Z");
  });

  it("transformTrendData parses records, coerces heat flags, and populates optional rooms", () => {
    const item = {
      timestamp: "2026-11-15T09:15:00.000Z",
      temp: 15.5,
      humidity: 65,
      rain: 0,
      tarif: 1,
      living_room_air: 22.1,
      living_room_floor: 23.0,
      guest_room_air: 21.0,
      guest_room_floor: 22.0,
      bed_room_air: 20.5,
      bed_room_floor: 21.5,
      boys_room_air: 21.2,
      boys_room_floor: 22.2,
      petra_room_air: 21.4,
      petra_room_floor: 22.4,
      living_room_heat: 1,
      guest_room_heat: 0,
      bed_room_heat: 0,
      boys_room_heat: 0,
      petra_room_heat: 0,
      entry_hall_heat: 1,
      bath_down_heat: 1,
      bath_up_heat: 0,
      wardrobe_heat: 0,
      hall_up_heat: 0,
      entry_hall_air: 20.1,
      entry_hall_floor: 21.1,
      bath_down_air: 23.5,
      bath_down_floor: 25.0,
      bath_up_air: 23.0,
      bath_up_floor: 24.5,
      wardrobe_air: 19.5,
      wardrobe_floor: 20.0,
      hall_up_air: 20.8,
      hall_up_floor: 21.3,
    };

    const trend = dom.transformTrendData([JSON.stringify(item)]);
    expect(trend.temp).toEqual([15.5]);
    expect(trend.living_room_heat).toEqual([true]);
    expect(trend.guest_room_heat).toEqual([false]);
    expect(trend.entry_hall_air).toEqual([20.1]);
    expect(trend.bath_down_floor).toEqual([25.0]);
    expect(trend.hall_up_air).toEqual([20.8]);
  });
});
