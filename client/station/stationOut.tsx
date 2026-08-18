/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { observer } from "mobx-react";
import NumberDataWithTrend from "../misc/numberDataWithTrend";
import Trend from "../misc/trend";
import { STATION_MEASUREMENTS_DESC } from "../../common/stationModel";
import MY_COLORS from "../../common/colors";
import { AppContext } from "..";

type Props = {
  appContext: AppContext;
};

const StationOut = observer(({ appContext }: Props) => {
  const { dailyET0 } = appContext.cCtrl.stationData;
  const et0 = dailyET0?.et0 ?? 0;
  const rain = dailyET0?.rain ?? 0;
  const need = Math.max(0, et0 - rain);
  const ready = dailyET0 != null;
  const { oldData, data, trendData } = appContext.cCtrl.stationData;

  let isRainyForecast = false;
  if (appContext.forecastCtrl.forecastData.rows && appContext.forecastCtrl.forecastData.rows.length > 0) {
    let sumPrecip = 0;
    const now = new Date();
    for (const row of appContext.forecastCtrl.forecastData.rows) {
      const rowTime = new Date(row.timestamp);
      const diffHours = (rowTime.getTime() - now.getTime()) / 3600000;
      if (diffHours >= 0 && diffHours <= 12) {
        sumPrecip += row.precipitation_amount_1h ?? 0;
      }
    }
    isRainyForecast = sumPrecip > 0.5;
  }

  let statusText = "";
  let statusColor = MY_COLORS.gray2;
  if (!ready) {
    statusText = "Loading";
    statusColor = MY_COLORS.gray2;
  } else if (isRainyForecast) {
    statusText = "Hold today";
    statusColor = MY_COLORS.gray2;
  } else if (need > 3.0) {
    statusText = "Water now";
    statusColor = MY_COLORS.green;
  } else if (need > 0) {
    statusText = "Light watering";
    statusColor = MY_COLORS.yellow;
  } else {
    statusText = "Skip — enough rain";
    statusColor = MY_COLORS.blue;
  }

  const tempVal = oldData ? null : data.temp;
  const feelsVal = oldData ? null : data.feelslike;
  const dewVal = oldData ? null : data.dewpt;

  return (
    <div className="flex flex-col gap-3.5">
      {/* ── 1. Hero Outdoor Temperature Card ─────────────────────── */}
      <div
        role="button"
        tabIndex={0}
        className="hero-temp-card flex flex-col justify-between"
        onClick={() => appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.TEMPERATURE)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.TEMPERATURE);
          }
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#e07856] shadow-sm shadow-[#e07856]/50" />
            <span className="text-[0.7rem] font-bold tracking-wider uppercase text-white/70">
              Outdoor Temperature
            </span>
          </div>
          <span className="text-[0.7rem] font-medium text-white/40 uppercase tracking-wider">
            Past 1h
          </span>
        </div>

        <div className="flex items-center justify-between my-2">
          <div className="flex items-baseline">
            <span className="hero-temp-value">
              {tempVal == null ? "–" : tempVal.toFixed(1)}
            </span>
            <span className="text-lg font-medium text-white/60 ml-1.5">°C</span>
          </div>

          <div className="trend-wrap w-24">
            <Trend
              data={trendData.temp}
              range={STATION_MEASUREMENTS_DESC.TEMPERATURE.range}
              couldBeNegative={STATION_MEASUREMENTS_DESC.TEMPERATURE.couldBeNegative}
              color={STATION_MEASUREMENTS_DESC.TEMPERATURE.color}
            />
          </div>
        </div>

        {/* Quick Chips: Feels Like & Dew Point */}
        <div className="flex items-center gap-2 pt-1 border-t border-white/[0.06] text-xs">
          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-white/80 transition-colors cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.FEELSLIKE);
            }}
          >
            <span className="text-white/45 text-[11px]">Feels like:</span>
            <span className="font-semibold text-[#e07856]">
              {feelsVal == null ? "–" : `${feelsVal.toFixed(1)} °C`}
            </span>
          </button>

          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-white/80 transition-colors cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.DEWPOINT);
            }}
          >
            <span className="text-white/45 text-[11px]">Dew point:</span>
            <span className="font-semibold text-[#7fb8a8]">
              {dewVal == null ? "–" : `${dewVal.toFixed(1)} °C`}
            </span>
          </button>
        </div>
      </div>

      {/* ── 2. Secondary Metric Grid ─────────────────────────────── */}
      <div className="grid grid-cols-2 gap-2.5">
        <NumberDataWithTrend
          sensor={STATION_MEASUREMENTS_DESC.HUMIDITY}
          value={data.humidity}
          old={oldData}
          trend={trendData.humidity}
          onClick={() => appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.HUMIDITY)}
        />
        <NumberDataWithTrend
          sensor={STATION_MEASUREMENTS_DESC.SOLAR}
          value={data.solarradiation}
          old={oldData}
          trend={trendData.solarradiation}
          onClick={() => appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.SOLAR)}
        />
        <NumberDataWithTrend
          sensor={STATION_MEASUREMENTS_DESC.UV}
          value={data.uv}
          old={oldData}
          trend={trendData.uv}
          onClick={() => appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.UV)}
        />
        <NumberDataWithTrend
          sensor={STATION_MEASUREMENTS_DESC.PRESSUREABS}
          value={data.pressureabs}
          old={oldData}
          trend={trendData.pressureabs}
          onClick={() => appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.PRESSUREABS)}
        />
        <div className="col-span-2">
          <NumberDataWithTrend
            sensor={STATION_MEASUREMENTS_DESC.RAINRATE}
            value={data.rainrate}
            old={oldData}
            trend={trendData.rainrate}
            onClick={() => appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.RAINRATE)}
          />
        </div>
      </div>

      {/* ── 3. Agro Grass Watering Widget ────────────────────────── */}
      <div
        role="button"
        tabIndex={0}
        className="metric-card w-full flex flex-col justify-between p-3.5 cursor-pointer bg-white/[0.02] border border-white/[0.06] rounded-xl hover:border-emerald-500/30 transition-all"
        onClick={() => appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.ET0)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.ET0);
          }
        }}
      >
        <div className="flex justify-between items-start w-full">
          <div>
            <div className="text-[0.7rem] uppercase text-[rgba(232,230,227,0.5)] font-bold tracking-wider mb-1 flex items-center gap-1.5">
              <span>🌱</span>
              <span>Grass Watering (ET₀)</span>
            </div>
            <div className="text-base font-bold text-[#e8e6e3] flex items-baseline gap-1 flex-wrap">
              Today&apos;s need:{" "}
              <span className="text-xl text-[#8dbe9d] font-extrabold">
                {ready ? need.toFixed(1) : "—"}
              </span>{" "}
              mm
              <span className="text-xs text-[rgba(232,230,227,0.6)] ml-1">
                {ready ? `(≈ ${need.toFixed(1)} L/m²)` : ""}
              </span>
            </div>
            <div className="text-[11px] text-[rgba(232,230,227,0.55)] mt-0.5 font-medium">
              {ready
                ? `ET₀ ${et0.toFixed(1)} mm − Rain ${rain.toFixed(1)} mm (24h)`
                : "Computing grass evapotranspiration…"}
            </div>
          </div>
          <div
            className="text-[10px] font-bold px-2.5 py-1 rounded-full select-none tracking-wider"
            style={{
              backgroundColor: `${statusColor}22`,
              color: statusColor,
              border: `1px solid ${statusColor}44`,
            }}
          >
            💧 {statusText.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
});

export default StationOut;
