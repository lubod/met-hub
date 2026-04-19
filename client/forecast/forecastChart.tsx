import * as React from "react";
import { observer } from "mobx-react";
import {
  Area,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  // Tooltip,
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
  width: number;
  type: "rain_cloud" | "wind";
};

const ForecastChart = observer(
  ({ data, lastTimestamp, firstTimestamp, hours, offset6h, width, type }: Props) => {
    if (firstTimestamp == null || lastTimestamp == null) return null;
    const chdata = [];

    /*
    function formatLabel(label: string) {
      return moment(label).format("MMM DD HH:mm");
    }
    */

    let domainWindMax = 20;

    if (hours === 24 && data.length > 0 && data[0].rows.length > 0) {
      for (let h = 0; h < data[0].rows[0].timestamp.getHours(); h += 1) {
        chdata.push({
          timestamp:
            data[0].rows[0].timestamp.getTime() -
            (data[0].rows[0].timestamp.getHours() - h) * 3600000,
          rain: null,
          wind_speed: null,
          clouds: null,
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
          rain: null,
          wind_speed: null,
          clouds: null,
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
        const ws = parseFloat((forecastRow.wind_speed * 3.6).toFixed(1));
        if (ws > domainWindMax) domainWindMax = ws;
        chdata.push({
          timestamp: forecastRow.timestamp.getTime(),
          rain: forecastRow.precipitation_amount_row,
          wind_speed: ws,
          clouds: forecastRow.cloud_area_fraction,
        });
      }
    }

    const refLines = [];
    if (type === "wind") {
      for (let i = 10; i <= domainWindMax; i += 10) {
        refLines.push(i);
      }
    }

    console.info("render forecast chart");
    return (
      <div className="flex flex-col">
        <div className="text-sm text-center text-gray border-gray py-4">
          {type === "rain_cloud" ? (
            <>
              Rain
              <span className="text-blue border-blue">&#8226;</span>{" "}
              <span className="">Clouds</span>
              <span className="text-light border-light">&#8226;</span>
            </>
          ) : (
            <>
              <span className="">Wind speed</span>
              <span className="text-purple border-purple">&#8226;</span>{" "}
            </>
          )}
        </div>
        <div className="w-full" style={{ minWidth: width }}>
          <ResponsiveContainer width="100%" height={70}>
            <ComposedChart
              data={chdata}
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={MY_COLORS.blue}
                    stopOpacity={0.8}
                  />
                  <stop offset="95%" stopColor={MY_COLORS.blue} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorClouds" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={MY_COLORS.light}
                    stopOpacity={0.3}
                  />
                  <stop offset="95%" stopColor={MY_COLORS.light} stopOpacity={0} />
                </linearGradient>
              </defs>
              {type === "rain_cloud" && (
                <Area
                  type="monotoneX"
                  dataKey="clouds"
                  stroke={MY_COLORS.light}
                  fillOpacity={1}
                  fill="url(#colorClouds)"
                  isAnimationActive={false}
                  yAxisId="clouds"
                />
              )}
              {type === "rain_cloud" && (
                <Area
                  type="step"
                  dataKey="rain"
                  stroke={MY_COLORS.blue}
                  fillOpacity={1}
                  fill="url(#colorRain)"
                  isAnimationActive={false}
                  yAxisId="rain"
                />
              )}
              {type === "wind" && (
                <Line
                  type="monotoneX"
                  dataKey="wind_speed"
                  stroke={MY_COLORS.purple}
                  dot={false}
                  strokeWidth={2}
                  isAnimationActive={false}
                  yAxisId="wind_speed"
                />
              )}
              {type === "wind" && refLines.map((v) => (
                <ReferenceLine
                  key={v}
                  y={v}
                  yAxisId="wind_speed"
                  stroke="#fff"
                  strokeOpacity={0.2}
                  strokeDasharray="4 2"
                  label={{
                    position: "left",
                    offset: -5,
                    children: `${v}`,
                    fill: "#fff",
                    fillOpacity: 0.3,
                    fontSize: 10,
                  }}
                />
              ))}
              <XAxis
                dataKey="timestamp"
                hide
                axisLine={false}
                domain={[firstTimestamp.getTime(), lastTimestamp.getTime()]}
                scale="time"
                type="number"
              />
              {type === "rain_cloud" && (
                <>
                  <YAxis yAxisId="rain" hide type="number" domain={[0, 5]} />
                  <YAxis yAxisId="clouds" hide type="number" domain={[0, 100]} />
                </>
              )}
              {type === "wind" && (
                <YAxis yAxisId="wind_speed" hide type="number" domain={[0, domainWindMax]} />
              )}
              {/* 
              <Tooltip
                labelStyle={{ color: "black" }}
                itemStyle={{ color: "black" }}
                // eslint-disable-next-line react/jsx-no-bind
                labelFormatter={formatLabel}
            /> */}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  },
);

export default ForecastChart;
