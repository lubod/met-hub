import { observer } from "mobx-react";
import moment from "moment";
import React from "react";
import {
  Area,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import MY_COLORS from "../../common/colors";
import { IForecastDay, IForecastRow } from "./forecastData";

type ForecastChartData = {
  data: Array<IForecastDay>;
  index: number;
};

const ForecastChart = observer(({ data, index }: ForecastChartData) => {
  const chdata = [];

  function formatLabel(label: string) {
    return moment(label).format("MMM DD HH:mm");
  }

  function roundTo5Min(num: number) {
    let res = null;
    res = Math.floor(num / 5) * 5;
    return res;
  }

  function roundTo5Max(num: number) {
    let res = null;
    res = Math.ceil(num / 5) * 5;
    return res;
  }

  let domainTempMax = Number.MIN_SAFE_INTEGER;
  let domainTempMin = Number.MAX_SAFE_INTEGER;

  for (let i = 0; i < data.length; i += 1) {
    if (i >= index) {
      break;
    }
    for (let j = 0; j < data[i].forecastRows.length; j += 1) {
      const forecastRow: IForecastRow = data[i].forecastRows[j];
      if (index > 3 && forecastRow.timestamp.getHours() % 6 !== 1) {
        //       break;
      }
      chdata.push({
        timestamp: forecastRow.timestamp.getTime(),
        temperature: forecastRow.air_temperature,
        rain: forecastRow.precipitation_amount,
        wind_speed: (parseFloat(forecastRow.wind_speed) * 3.6).toFixed(1),
        clouds: forecastRow.cloud_area_fraction,
      });
    }
    if (data[i].air_temperature_max > domainTempMax) {
      domainTempMax = data[i].air_temperature_max;
    }
    if (data[i].air_temperature_min < domainTempMin) {
      domainTempMin = data[i].air_temperature_min;
    }
  }

  console.info("render forecast chart");
  return (
    <>
      <div
        className="text-center"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <ResponsiveContainer width="100%" aspect={7.0 / 1.0}>
          <ComposedChart
            data={chdata}
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <Area
              type="monotoneX"
              dataKey="temperature"
              stroke={MY_COLORS.orange}
              fillOpacity={1}
              fill="url(#colorUv)"
              isAnimationActive={false}
              yAxisId="temperature"
            />
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={MY_COLORS.orange}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={MY_COLORS.orange}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="timestamp"
              hide
              axisLine={false}
              domain={["auto", "auto"]}
              scale="time"
            />
            <YAxis
              yAxisId="temperature"
              hide
              type="number"
              domain={[roundTo5Min(domainTempMin), roundTo5Max(domainTempMax)]}
            />
            <Tooltip
              labelStyle={{ color: "black" }}
              itemStyle={{ color: "black" }}
              // eslint-disable-next-line react/jsx-no-bind
              labelFormatter={formatLabel}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div
        className="text-center"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <ResponsiveContainer width="100%" aspect={7.0 / 1.0}>
          <ComposedChart
            data={chdata}
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <Line
              type="step"
              dataKey="rain"
              stroke={MY_COLORS.purple}
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
              yAxisId="rain"
            />
            <Line
              type="monotoneX"
              dataKey="wind_speed"
              stroke={MY_COLORS.blue}
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
              yAxisId="wind_speed"
            />
            <Line
              type="monotoneX"
              dataKey="clouds"
              stroke={MY_COLORS.light}
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
              yAxisId="clouds"
            />
            <XAxis
              dataKey="timestamp"
              hide
              axisLine={false}
              domain={["auto", "auto"]}
              scale="time"
            />
            <YAxis yAxisId="rain" hide type="number" domain={[0, 5]} />
            <YAxis yAxisId="wind_speed" hide type="number" domain={[0, 50]} />
            <YAxis yAxisId="clouds" hide type="number" domain={[0, 100]} />

            <Tooltip
              labelStyle={{ color: "black" }}
              itemStyle={{ color: "black" }}
              // eslint-disable-next-line react/jsx-no-bind
              labelFormatter={formatLabel}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </>
  );
});

export default ForecastChart;
