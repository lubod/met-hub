import * as React from "react";
import { observer } from "mobx-react";
import {
  Area,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
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
  type: "rain_cloud" | "wind";
};

function CustomRainCloudTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  const timeFormatted = moment(new Date(label)).format("ddd, MMM D • HH:mm");

  const clouds = payload.find((p: any) => p.dataKey === "clouds")?.value;
  const rain = payload.find((p: any) => p.dataKey === "rain")?.value;

  return (
    <div className="glass-card !bg-midnight/90 !backdrop-blur-md !border-white/10 !p-2.5 !rounded-xl shadow-xl text-xs flex flex-col gap-1.5 min-w-36 pointer-events-none">
      <div className="text-light/60 font-medium text-[11px] border-b border-white/5 pb-1 mb-0.5">
        {timeFormatted}
      </div>
      {clouds != null && (
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-light/80">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: MY_COLORS.light }}
            />
            Cloud Cover:
          </span>
          <span className="font-semibold text-light tabular-nums">
            {clouds.toFixed(0)}%
          </span>
        </div>
      )}
      {rain != null && (
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-light/80">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: MY_COLORS.blue }}
            />
            Precipitation:
          </span>
          <span className="font-bold text-blue tabular-nums">
            {rain.toFixed(1)} mm
          </span>
        </div>
      )}
    </div>
  );
}

function CustomWindTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  const timeFormatted = moment(new Date(label)).format("ddd, MMM D • HH:mm");
  const windSpeed = payload.find((p: any) => p.dataKey === "wind_speed")?.value;

  return (
    <div className="glass-card !bg-midnight/90 !backdrop-blur-md !border-white/10 !p-2.5 !rounded-xl shadow-xl text-xs flex flex-col gap-1.5 min-w-36 pointer-events-none">
      <div className="text-light/60 font-medium text-[11px] border-b border-white/5 pb-1 mb-0.5">
        {timeFormatted}
      </div>
      {windSpeed != null && (
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-light/80">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: MY_COLORS.purple }}
            />
            Wind Speed:
          </span>
          <span className="font-bold text-light tabular-nums">
            {windSpeed.toFixed(1)} km/h
          </span>
        </div>
      )}
    </div>
  );
}

const ForecastChart = observer(
  ({ data, lastTimestamp, firstTimestamp, hours, offset6h, width, type }: Props) => {
    if (firstTimestamp == null || lastTimestamp == null) return null;
    const chdata = [];

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

    console.debug("render forecast chart");
    return (
      <div className="flex flex-col">
        <div className="text-xs uppercase tracking-wider font-semibold text-center text-light/70 py-3 flex items-center justify-center gap-2">
          {type === "rain_cloud" ? (
            <>
              <span className="text-blue flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue inline-block" />
                Rain (mm)
              </span>
              <span className="text-light/30">•</span>
              <span className="text-light/70 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-light/70 inline-block" />
                Clouds (%)
              </span>
            </>
          ) : (
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple inline-block" />
              Wind Speed (km/h)
            </span>
          )}
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
            <defs>
              <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={MY_COLORS.blue}
                  stopOpacity={0.8}
                />
                <stop offset="95%" stopColor={MY_COLORS.blue} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorClouds" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={MY_COLORS.light}
                  stopOpacity={0.25}
                />
                <stop offset="95%" stopColor={MY_COLORS.light} stopOpacity={0} />
              </linearGradient>
            </defs>
            {type === "rain_cloud" && (
              <Area
                type="monotoneX"
                dataKey="clouds"
                name="Cloud Cover"
                stroke={MY_COLORS.light}
                strokeOpacity={0.5}
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
                name="Precipitation"
                stroke={MY_COLORS.blue}
                strokeWidth={2}
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
                name="Wind Speed"
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
                  fillOpacity: 0.4,
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
                <YAxis
                  yAxisId="rain"
                  hide
                  type="number"
                  domain={[0, 5]}
                />
                <YAxis
                  yAxisId="clouds"
                  hide
                  type="number"
                  domain={[0, 100]}
                />
                <Tooltip
                  content={<CustomRainCloudTooltip />}
                  cursor={{
                    stroke: "rgba(255, 255, 255, 0.25)",
                    strokeWidth: 1,
                    strokeDasharray: "3 3",
                  }}
                />
              </>
            )}
            {type === "wind" && (
              <>
                <YAxis
                  yAxisId="wind_speed"
                  hide
                  type="number"
                  domain={[0, domainWindMax]}
                />
                <Tooltip
                  content={<CustomWindTooltip />}
                  cursor={{
                    stroke: "rgba(255, 255, 255, 0.25)",
                    strokeWidth: 1,
                    strokeDasharray: "3 3",
                  }}
                />
              </>
            )}
          </ComposedChart>
        </div>
      </div>
    );
  },
);

export default ForecastChart;
