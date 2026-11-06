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
});
