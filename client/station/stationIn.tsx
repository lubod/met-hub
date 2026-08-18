import React from "react";
import { observer } from "mobx-react";
import NumberDataWithTrend from "../misc/numberDataWithTrend";
import Trend from "../misc/trend";
import { STATION_MEASUREMENTS_DESC } from "../../common/stationModel";
import { AppContext } from "..";

type Props = {
  appContext: AppContext;
};

const StationIn = observer(({ appContext }: Props) => {
  const { oldData, data, trendData } = appContext.cCtrl.stationData;
  const tempVal = oldData ? null : data.tempin;
  const humVal = oldData ? null : data.humidityin;

  return (
    <div className="flex flex-col gap-3.5">
      {/* ── 1. Hero Indoor Temperature Card ──────────────────────── */}
      <div
        role="button"
        tabIndex={0}
        className="hero-temp-card flex flex-col justify-between"
        onClick={() => appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.TEMPERATUREIN)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.TEMPERATUREIN);
          }
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#6ba3a8] shadow-sm shadow-[#6ba3a8]/50" />
            <span className="text-[0.7rem] font-bold tracking-wider uppercase text-white/70">
              Indoor Temperature
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
              data={trendData.tempin}
              range={STATION_MEASUREMENTS_DESC.TEMPERATUREIN.range}
              couldBeNegative={STATION_MEASUREMENTS_DESC.TEMPERATUREIN.couldBeNegative}
              color={STATION_MEASUREMENTS_DESC.TEMPERATUREIN.color}
            />
          </div>
        </div>

        {/* Quick Chip: Indoor Humidity */}
        <div className="flex items-center gap-2 pt-1 border-t border-white/[0.06] text-xs">
          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-white/80 transition-colors cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.HUMIDITYIN);
            }}
          >
            <span className="text-white/45 text-[11px]">Indoor humidity:</span>
            <span className="font-semibold text-[#7fb8a8]">
              {humVal == null ? "–" : `${humVal.toFixed(0)} %`}
            </span>
          </button>
        </div>
      </div>

      {/* ── 2. Indoor Humidity Sensor Card ───────────────────────── */}
      <div className="grid grid-cols-1 gap-2.5">
        <NumberDataWithTrend
          sensor={STATION_MEASUREMENTS_DESC.HUMIDITYIN}
          value={data.humidityin}
          old={oldData}
          trend={trendData.humidityin}
          onClick={() => appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.HUMIDITYIN)}
        />
      </div>
    </div>
  );
});

export default StationIn;
