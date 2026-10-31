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
  powerKw?: number;
};

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
    powerKw = 1.0,
  }: RoomProps) => {
    const activeKw = heat ? powerKw : 0;

    return (
      <div className="flex flex-col gap-3 p-3 rounded-2xl bg-white/[0.015] border border-white/5 hover:border-white/10 transition-colors">
        {/* Room Header with Area & Status Badges */}
        <div className="flex flex-row flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-wide text-white">
              {room}
            </span>
            {areaM2 != null && (
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.06] text-light/70 font-medium">
                {areaM2} m²
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
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
        <div className="flex flex-row flex-wrap gap-y-3 pt-1">
          <div className="flex flex-col basis-1/2 md:basis-1/4">
            <NumberDataWithTrend
              sensor={{ ...DOM_SENSORS_DESC.ROOM, label: "Air" }}
              value={air ?? null}
              trend={airTrend ?? []}
              onClick={onClickAir}
              old={old}
            />
          </div>
          <div className="flex flex-col basis-1/2 md:basis-1/4">
            <NumberDataWithTrend
              sensor={{ ...DOM_SENSORS_DESC.ROOM, label: "Floor" }}
              value={floor ?? null}
              trend={floorTrend ?? []}
              onClick={onClickFloor}
              old={old}
            />
          </div>
          <div className="flex flex-col basis-1/2 md:basis-1/4">
            <NumberDataAlone
              label="Req"
              value={required ?? null}
              unit={DOM_SENSORS_DESC.ROOM.unit}
              fix={DOM_SENSORS_DESC.ROOM.fix}
              old={old}
            />
          </div>
          <div className="flex flex-col basis-1/2 md:basis-1/4">
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
