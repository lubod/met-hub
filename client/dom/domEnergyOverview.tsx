/* eslint-disable jsx-a11y/control-has-associated-label */
import { observer } from "mobx-react";
import React from "react";
import { AppContext } from "..";
import Text from "../misc/text";
import DomHeatingSettingsModal from "./domHeatingSettingsModal";

type Props = {
  appContext: AppContext;
};

const DomEnergyOverview = observer(({ appContext }: Props) => {
  const { domData } = appContext.cCtrl;
  const { activePowerKw, totalCapacityKw, activeRoomsCount, totalAreaM2 } = domData;
  const isHeating = activeRoomsCount > 0;
  const isOld = domData.oldData;

  const currentInterval = domData.heatingInterval;
  const stats = domData.heatingStats;
  const intervalStats = stats ? stats[currentInterval] : null;

  const {tarif} = domData.data;
  // Tariff 2 is typically Low Tariff (NT - Nízky tarif) in dual-rate ripple receivers, Tariff 1 is High Tariff (VT)
  const isLowTarif = tarif === 2;

  const avgDensity =
    totalAreaM2 > 0 ? Math.round((totalCapacityKw * 1000) / totalAreaM2) : 0;

  function formatRuntime(minutes: number) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
  }

  return (
    <div className="flex flex-col gap-3">
      <DomHeatingSettingsModal appContext={appContext} />

      <div className="flex flex-row items-center justify-between">
        <Text>HEATING & ENERGY</Text>
        <button
          type="button"
          onClick={() => domData.setSettingsOpen(true)}
          className="text-xs text-light/70 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors"
          title="Configure room heating power (kW)"
        >
          <span>⚙️</span>
          <span>Ratings</span>
        </button>
      </div>

      {/* Main Executive Summary Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* 1. Live Active Power */}
        <div
          className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
            isHeating && !isOld
              ? "bg-gradient-to-br from-[#e07856]/15 via-[#e07856]/5 to-transparent border-[#e07856]/40 shadow-sm shadow-[#e07856]/10"
              : "bg-white/[0.02] border-white/5"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-light/60">
              Active Load
            </span>
            {isHeating && !isOld && (
              <span className="w-2 h-2 rounded-full bg-orange shadow-[0_0_8px_#e07856]" />
            )}
          </div>
          <div className="my-1">
            <span
              className={`text-xl md:text-2xl font-bold tabular-nums ${
                isHeating && !isOld ? "text-orange" : "text-white/80"
              }`}
            >
              {isOld ? "-" : `${activePowerKw.toFixed(2)} kW`}
            </span>
          </div>
          <span className="text-[10px] text-light/50 truncate">
            {isOld
              ? "Stale data"
              : `${activeRoomsCount} of 10 circuits active (${totalCapacityKw.toFixed(2)} kW cap)`}
          </span>
        </div>

        {/* 2. Today's / Interval Energy Consumption */}
        <div className="p-3 rounded-xl border bg-white/[0.02] border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-light/60">
              Consumption
            </span>
            <span className="text-[10px] text-cyan font-semibold uppercase">
              {currentInterval === "last24h"
                ? "24h"
                : currentInterval === "last7d"
                ? "7d"
                : currentInterval === "last30d"
                ? "30d"
                : currentInterval}
            </span>
          </div>
          <div className="my-1">
            <span className="text-xl md:text-2xl font-bold text-cyan tabular-nums">
              {intervalStats != null ? `${intervalStats.totalKWh.toFixed(1)}` : "-"}
              <span className="text-xs font-normal ml-1 text-cyan/70">kWh</span>
            </span>
          </div>
          <span className="text-[10px] text-light/50 truncate">
            {intervalStats != null
              ? `Runtime: ${formatRuntime(intervalStats.totalRuntimeMinutes)}`
              : "Heating runtime"}
          </span>
        </div>

        {/* 3. Tariff Status */}
        <div className="p-3 rounded-xl border bg-white/[0.02] border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-light/60">
              Electricity Rate
            </span>
            <span>⚡</span>
          </div>
          <div className="my-1 flex items-center gap-1.5">
            <span
              className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                isLowTarif
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              }`}
            >
              {isLowTarif ? "NT (Low)" : "VT (High)"}
            </span>
          </div>
          <span className="text-[10px] text-light/50 truncate">
            {isLowTarif ? "Cheaper night rate" : "Standard day rate"}
          </span>
        </div>

        {/* 4. Total Capacity */}
        <div className="p-3 rounded-xl border bg-white/[0.02] border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-light/60">
              Heated Area
            </span>
            <span>🏠</span>
          </div>
          <div className="my-1">
            <span className="text-xl md:text-2xl font-bold text-white/90 tabular-nums">
              {totalAreaM2}
              <span className="text-xs font-normal ml-1 text-light/60">m²</span>
            </span>
          </div>
          <span className="text-[10px] text-light/50 truncate">
            {totalCapacityKw.toFixed(2)} kW ({Math.round(totalCapacityKw * 1000)} W • {avgDensity} W/m²)
          </span>
        </div>
      </div>

      {/* Consumption Interval Switcher */}
      <div className="flex items-center justify-between text-xs pt-1 px-1">
        <span className="text-[11px] text-light/50">History:</span>
        <div className="flex items-center p-0.5 rounded-lg bg-black/30 border border-white/[0.06] text-[11px]">
          {(
            [
              ["today", "Today"],
              ["yesterday", "Yesterday"],
              ["last24h", "24h"],
              ["last7d", "7d"],
              ["last30d", "30d"],
            ] as const
          ).map(([val, label]) => (
            <button
              key={val}
              type="button"
              className={`segmented-btn !py-0.5 !px-2 ${
                currentInterval === val ? "active" : ""
              }`}
              onClick={() => domData.setHeatingInterval(val)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

export default DomEnergyOverview;
