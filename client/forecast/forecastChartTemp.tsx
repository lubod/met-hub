import { observer } from "mobx-react";
import moment from "moment";
import React from "react";
import {
  Area,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import MY_COLORS from "../../common/colors";
import { ForecastDay, ForecastRow } from "./forecastData";

type Props = {
  data: Array<ForecastDay>;
  lastTimestamp: Date;
  firstTimestamp: Date;
  hours: number;
  offset6h: number;
};

const ForecastChartTemp = observer(
  ({ data, lastTimestamp, firstTimestamp, hours, offset6h }: Props) => {
    const chdata = [];

    function formatLabel(label: string) {
      return moment(label).format("MMM DD HH:mm");
    }

    /*
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
*/

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

    console.info("render forecast chart temp", chdata);
    return (
      <>
        <div className="small text-white-50 font-weight-bold mt-3 mb-3">
          Temperature <span style={{ color: MY_COLORS.orange }}>&#8226;</span>
        </div>
        <div
          className="text-center"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <ResponsiveContainer width="100%" aspect={5.0 / 1.0}>
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
                type="number"
                // tick={{ stroke: "red", strokeWidth: 2 }}
              />
              <YAxis
                yAxisId="temperature"
                hide
                type="number"
                domain={[domainTempMin, domainTempMax]}
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
      </>
    );
  }
);

export default ForecastChartTemp;
