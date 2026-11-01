/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { observer } from "mobx-react";
import React from "react";
import { DOM_SENSORS_DESC } from "../../common/domModel";
import NumberDataAlone from "../misc/numberDataAlone";
import NumberDataWithTrend from "../misc/numberDataWithTrend";

type RoomProps = {
  air?: number;
  floor?: number;
  required?: number;
  heat?: boolean;
  off?: boolean;
  low?: boolean;
  room: string;
  airTrend?: Array<number>;
  floorTrend?: Array<number>;
  onClickAir?: any;
  onClickFloor?: any;
  old: boolean;
  areaM2?: number;
  heatedAreaM2?: number;
  heatingType?: "mat" | "foil";
  powerKw?: number;
  kwh?: number;
  runtimeMinutes?: number;
};

function formatRoomRuntime(minutes?: number) {
  if (!minutes || minutes <= 0) return "0m";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

const Room = observer(
  ({
    air,
    floor,
    required,
    heat,
    off: summer,
    low,
    room,
    airTrend,
    floorTrend,
    onClickAir,
    onClickFloor,
    old,
    areaM2,
    heatedAreaM2,
    heatingType,
    powerKw = 1.0,
    kwh,
    runtimeMinutes,
  }: RoomProps) => {
    const activeKw = heat ? powerKw : 0;
    const effectiveHeatedArea = heatedAreaM2 ?? areaM2;
    const density =
      effectiveHeatedArea != null && effectiveHeatedArea > 0
        ? Math.round((powerKw * 1000) / effectiveHeatedArea)
        : 0;

    return (
      <div className="flex flex-col gap-3 p-3 rounded-2xl bg-white/[0.015] border border-white/5 hover:border-white/10 transition-colors">
        {/* Room Header with Area & Status Badges */}
        <div className="flex flex-row flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-wide text-white">
              {room}
            </span>
            {areaM2 != null && (
              <span
                className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.06] text-light/70 font-medium"
                title={
                  heatedAreaM2 != null
                    ? `Room: ${areaM2} m² • ${heatingType === "mat" ? "Vykurovacia rohož" : "Vykurovacia fólia"}: ${heatedAreaM2} m² (${density} W/m² @ ${Math.round(powerKw * 1000)} W)`
                    : `Room: ${areaM2} m² (${density} W/m²)`
                }
              >
                <span>{areaM2} m²</span>
                {heatedAreaM2 != null && heatedAreaM2 !== areaM2 && (
                  <span className="text-light/45 ml-1 font-normal">
                    ({heatedAreaM2} m² {heatingType === "mat" ? "rohož" : "fólia"})
                  </span>
                )}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Heating technology: Rohož (kúpeľňa) vs Fólia (ostatné izby) */}
            {heatingType != null && (
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                  heatingType === "mat"
                    ? "bg-purple-500/15 border-purple-500/30 text-purple-300"
                    : "bg-blue-500/10 border-blue-500/25 text-blue-300"
                }`}
                title={
                  heatingType === "mat"
                    ? `Vykurovacia rohož (kúpeľňa): ${effectiveHeatedArea} m² • ${density} W/m²`
                    : `Vykurovacia fólia: ${effectiveHeatedArea} m² • ${density} W/m²`
                }
              >
                {heatingType === "mat" ? "Rohož" : "Fólia"}
              </span>
            )}

            {/* Heating / Power status */}
            {heat ? (
              <div
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange/20 border border-orange/40 text-orange font-bold text-xs shadow-sm shadow-orange/20"
                title={`Heating active: drawing ${powerKw.toFixed(2)} kW (${Math.round(powerKw * 1000)} W)`}
              >
                <span className="text-xs">🔥</span>
                <span className="tabular-nums">{powerKw.toFixed(2)} kW</span>
              </div>
            ) : (
              <div
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-light/50 font-medium text-xs"
                title={`Idle (${powerKw.toFixed(2)} kW / ${Math.round(powerKw * 1000)} W rated capacity)`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <span className="tabular-nums">0.00 kW</span>
              </div>
            )}

            {/* Period Energy Consumption (kWh) */}
            {kwh != null && (
              <span
                className="px-2 py-0.5 rounded-full bg-cyan/10 border border-cyan/25 text-cyan text-[11px] font-semibold tabular-nums"
                title={`Period consumption: ${kwh.toFixed(2)} kWh (${formatRoomRuntime(runtimeMinutes)} runtime at ${Math.round(powerKw * 1000)} W)`}
              >
                ⚡ {kwh.toFixed(2)} kWh
              </span>
            )}

            {/* Summer / Seasonal mode */}
            {summer && (
              <span
                className="px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-semibold"
                title="Summer mode (heating season off)"
              >
                ☀️ Summer
              </span>
            )}

            {/* Low / Eco mode */}
            {low && (
              <span
                className="px-1.5 py-0.5 rounded bg-cyan/15 border border-cyan/30 text-cyan text-[10px] font-semibold"
                title="Low tariff / Eco setback active"
              >
                🌙 Eco
              </span>
            )}
          </div>
        </div>

        {/* 4 Data Columns: Air, Floor, Required, Active Power */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
          <div className="flex flex-col">
            <NumberDataWithTrend
              sensor={{ ...DOM_SENSORS_DESC.ROOM, label: "Air" }}
              value={air ?? null}
              trend={airTrend ?? []}
              onClick={onClickAir}
              old={old}
            />
          </div>
          <div className="flex flex-col">
            <NumberDataWithTrend
              sensor={{ ...DOM_SENSORS_DESC.ROOM, label: "Floor" }}
              value={floor ?? null}
              trend={floorTrend ?? []}
              onClick={onClickFloor}
              old={old}
            />
          </div>
          <div className="flex flex-col">
            <NumberDataAlone
              label="Req"
              value={required ?? null}
              unit={DOM_SENSORS_DESC.ROOM.unit}
              fix={DOM_SENSORS_DESC.ROOM.fix}
              old={old}
            />
          </div>
          <div className="flex flex-col">
            <NumberDataAlone
              label="Power"
              value={activeKw}
              unit="kW"
              fix={2}
              old={old}
            />
          </div>
        </div>
      </div>
    );
  },
);

export default Room;
