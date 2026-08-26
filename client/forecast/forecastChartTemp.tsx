import * as React from "react";
import { observer } from "mobx-react";
import {
  Area,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import moment from "../misc/dateFormatter";
import MY_COLORS from "../../common/colors";
import { ForecastDay, ForecastRow } from "./forecastData";

type Props = {
  data: Array<ForecastDay>;
  lastTimestamp: Date;
  firstTimestamp: Date;
  hours: number;
  offset6h: number;
  width: number;
};


const ForecastChartTemp = observer(
  ({ data, lastTimestamp, firstTimestamp, hours, offset6h, width }: Props) => {
    if (firstTimestamp == null || lastTimestamp == null) return null;
    const chdata = [];

    let domainTempMax = Number.MIN_SAFE_INTEGER;
    let domainTempMin = Number.MAX_SAFE_INTEGER;

    if (hours === 24 && data.length > 0 && data[0].rows.length > 0) {
      for (let h = 0; h < data[0].rows[0].timestamp.getHours(); h += 1) {
        chdata.push({
          timestamp:
            data[0].rows[0].timestamp.getTime() -
            (data[0].rows[0].timestamp.getHours() - h) * 3600000,
          temperature: null,
        });
      }
    }

    if (
      hours === 6 &&
      data.length > 0 &&
      data[0].rows.length > 0 &&
      offset6h === 0
    ) {
      const diff = data[0].rows[0].timestamp.getUTCHours() % 6;
      for (let h = diff; h > 0; h -= 1) {
        chdata.push({
          timestamp: data[0].rows[0].timestamp.getTime() - h * 3600000,
          temperature: null,
        });
      }
    }

    for (let i = 0; i < data.length; i += 1) {
      for (let j = 0; j < data[i].rows.length; j += 1) {
        const forecastRow: ForecastRow = data[i].rows[j];
        if (
          lastTimestamp != null &&
          forecastRow.timestamp.getTime() > lastTimestamp.getTime()
        ) {
          break;
        }
        if (
          firstTimestamp != null &&
          forecastRow.timestamp.getTime() < firstTimestamp.getTime()
        ) {
          // eslint-disable-next-line no-continue
          continue;
        }
        chdata.push({
          timestamp: forecastRow.timestamp.getTime(),
          temperature: forecastRow.air_temperature,
        });
      }
      if (data[i].air_temperature_max > domainTempMax) {
        domainTempMax = data[i].air_temperature_max;
      }
      if (data[i].air_temperature_min < domainTempMin) {
        domainTempMin = data[i].air_temperature_min;
      }
    }

    const refLines = [];
    for (let i = -60; i <= 100; i += 10) {
      if (i > domainTempMin && i < domainTempMax) {
        refLines.push(i);
      }
    }

    function getStroke(v: number) {
      if (v === 0) return "#e8e6e3";
      if (v > 0) return "#e07856";
      return "#6ba3a8";
    }

    console.debug("render forecast chart temp");
    return (
      <div className="flex flex-col">
        <div className="text-xs uppercase tracking-wider font-semibold text-center text-light/70 py-3 flex items-center justify-center gap-2">
          <span>Temperature Curve</span>
          <span className="w-1.5 h-1.5 rounded-full bg-orange inline-block" />
        </div>
        <div style={{ width, minWidth: width, maxWidth: width }}>
          <ComposedChart
            syncId="met-forecast-sync"
            width={width}
            height={120}
            data={chdata}
            margin={{
              top: 5,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            {refLines.map((v) => (
              <ReferenceLine
                key={v}
                y={v}
                yAxisId="temperature"
                stroke={getStroke(v)}
                strokeOpacity={v === 0 ? 0.8 : 0.35}
                strokeDasharray="4 2"
                label={{
                  position: "left",
                  offset: -5,
                  children: `${v}°`,
                  fill: getStroke(v),
                  fillOpacity: v === 0 ? 0.9 : 0.6,
                  fontSize: 10,
                }}
              />
            ))}
            <Area
              type="monotoneX"
              dataKey="temperature"
              name="Temperature"
              stroke={MY_COLORS.orange}
              strokeWidth={2}
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
                  stopOpacity={0.6}
                />
                <stop
                  offset="95%"
                  stopColor={MY_COLORS.orange}
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="timestamp"
              axisLine={{ stroke: "rgba(255, 255, 255, 0.15)" }}
              tick={{ fill: "#e8e6e3", fontSize: 12 }}
              tickLine={false}
              minTickGap={48}
              tickFormatter={(t) => moment(new Date(Number(t))).format("HH:mm")}
              domain={[firstTimestamp.getTime(), lastTimestamp.getTime()]}
              scale="time"
              type="number"
            />
            <YAxis
              yAxisId="temperature"
              hide
              type="number"
              domain={[domainTempMin, domainTempMax]}
            />
          </ComposedChart>
        </div>
      </div>
    );
  },
);

export default ForecastChartTemp;
