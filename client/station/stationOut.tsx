/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { observer } from "mobx-react";
import NumberDataWithTrend from "../misc/numberDataWithTrend";
import { STATION_MEASUREMENTS_DESC } from "../../common/stationModel";
import MY_COLORS from "../../common/colors";
import { AppContext } from "..";

type Props = {
  appContext: AppContext;
};

const StationOut = observer(({ appContext }: Props) => {
  const {dailyET0} = appContext.cCtrl.stationData;
  const et0 = dailyET0?.et0 ?? 0;
  const rain = dailyET0?.rain ?? 0;
  const need = Math.max(0, et0 - rain);
  const ready = dailyET0 != null;

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

  return (
    <div className="flex flex-row flex-wrap gap-y-4">
      <div className="basis-1/2">
        <NumberDataWithTrend
          sensor={STATION_MEASUREMENTS_DESC.TEMPERATURE}
          value={appContext.cCtrl.stationData.data.temp}
          old={appContext.cCtrl.stationData.oldData}
          trend={appContext.cCtrl.stationData.trendData.temp}
          onClick={() =>
            appContext.setMeasurementAndLoad(
              STATION_MEASUREMENTS_DESC.TEMPERATURE,
            )
          }
        />
      </div>
      <div className="basis-1/2">
        <NumberDataWithTrend
          sensor={STATION_MEASUREMENTS_DESC.FEELSLIKE}
          value={appContext.cCtrl.stationData.data.feelslike}
          old={appContext.cCtrl.stationData.oldData}
          trend={appContext.cCtrl.stationData.trendData.feelslike}
          onClick={() =>
            appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.FEELSLIKE)
          }
        />
      </div>
      <div className="basis-1/2">
        <NumberDataWithTrend
          sensor={STATION_MEASUREMENTS_DESC.DEWPOINT}
          value={appContext.cCtrl.stationData.data.dewpt}
          old={appContext.cCtrl.stationData.oldData}
          trend={appContext.cCtrl.stationData.trendData.dewpt}
          onClick={() =>
            appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.DEWPOINT)
          }
        />
      </div>
      <div className="basis-1/2">
        <NumberDataWithTrend
          sensor={STATION_MEASUREMENTS_DESC.HUMIDITY}
          value={appContext.cCtrl.stationData.data.humidity}
          old={appContext.cCtrl.stationData.oldData}
          trend={appContext.cCtrl.stationData.trendData.humidity}
          onClick={() =>
            appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.HUMIDITY)
          }
        />
      </div>
      <div className="basis-1/2">
        <NumberDataWithTrend
          sensor={STATION_MEASUREMENTS_DESC.SOLAR}
          value={appContext.cCtrl.stationData.data.solarradiation}
          old={appContext.cCtrl.stationData.oldData}
          trend={appContext.cCtrl.stationData.trendData.solarradiation}
          onClick={() =>
            appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.SOLAR)
          }
        />
      </div>
      <div className="basis-1/2">
        <NumberDataWithTrend
          sensor={STATION_MEASUREMENTS_DESC.UV}
          value={appContext.cCtrl.stationData.data.uv}
          old={appContext.cCtrl.stationData.oldData}
          trend={appContext.cCtrl.stationData.trendData.uv}
          onClick={() =>
            appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.UV)
          }
        />
      </div>
      <div className="basis-1/2">
        <NumberDataWithTrend
          sensor={STATION_MEASUREMENTS_DESC.PRESSUREABS}
          value={appContext.cCtrl.stationData.data.pressureabs}
          old={appContext.cCtrl.stationData.oldData}
          trend={appContext.cCtrl.stationData.trendData.pressureabs}
          onClick={() =>
            appContext.setMeasurementAndLoad(
              STATION_MEASUREMENTS_DESC.PRESSUREABS,
            )
          }
        />
      </div>
      <div className="basis-1/2">
        <NumberDataWithTrend
          sensor={STATION_MEASUREMENTS_DESC.RAINRATE}
          value={appContext.cCtrl.stationData.data.rainrate}
          old={appContext.cCtrl.stationData.oldData}
          trend={appContext.cCtrl.stationData.trendData.rainrate}
          onClick={() =>
            appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.RAINRATE)
          }
        />
      </div>
      
      <div className="basis-full">
        <div
          role="button"
          tabIndex={0}
          className="metric-card w-full flex flex-col justify-between p-4 cursor-pointer"
          onClick={() =>
            appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.ET0)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.ET0);
            }
          }}
        >
          <div className="flex justify-between items-start w-full">
            <div>
              <div className="text-xs uppercase text-[rgba(232,230,227,0.45)] font-semibold tracking-wider mb-1">
                🌱 Grass Watering
              </div>
              <div className="text-lg font-bold text-[#e8e6e3] flex items-baseline gap-1 flex-wrap">
                Today&apos;s need: <span className="text-xl text-[#8dbe9d] font-extrabold">{ready ? need.toFixed(1) : "—"}</span> mm
                <span className="text-xs text-[rgba(232,230,227,0.6)] ml-1">
                  {ready ? `(≈ ${need.toFixed(1)} L/m²)` : ""}
                </span>
              </div>
              <div className="text-[10px] text-[rgba(232,230,227,0.55)] mt-1">
                {ready ? `ET₀ ${et0.toFixed(1)} mm − Rain ${rain.toFixed(1)} mm (24h)` : "Computing grass evapotranspiration…"}
              </div>
            </div>
            <div
              className="text-[10px] font-semibold px-2 py-1 rounded select-none"
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
    </div>
  );
});

export default StationOut;
