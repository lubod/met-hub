import moment from "moment";
import React from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppContext } from "..";

type ChartData = {
  chdata: {}[];
  xkey: string;
  appContext: AppContext;
};

function Chart({ chdata, xkey, appContext }: ChartData) {
  const sensor = appContext.chartsCtrl.chartsData.sensor;
  if (!sensor) {
    return null;
  }
  const y2key = sensor.col2;
  const { yDomainMin, yDomainMax, range, xDomainMin, xDomainMax } =
    appContext.chartsCtrl.chartsData.cdata;
  const { color, unit } = sensor;

  function formatXAxis(tickItem: string) {
    return moment(parseInt(tickItem, 10)).format(range.format);
  }

  function formatLabel(label: string) {
    return moment(parseInt(label, 10)).format("DD.MM.YYYY HH:mm:ss");
  }

  return (
    <div className="text-left w-full flex flex-col gap-2">
      {/* Sleek Custom Legend */}
      <div className="flex flex-row flex-wrap gap-4 mb-2 text-xs justify-end pr-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm opacity-80" style={{ backgroundColor: color }} />
          <span className="text-[rgba(248,249,250,0.65)] font-medium">{sensor.label} Range</span>
        </div>
        {y2key && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5" style={{ backgroundColor: "#F93154" }} />
            <span className="text-[rgba(248,249,250,0.65)] font-medium">Indoor {sensor.label}</span>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" aspect={7.0 / 4.0}>
        <ComposedChart
          data={chdata}
          margin={{
            top: 10,
            right: 10,
            left: -15,
            bottom: 0,
          }}
        >
          <CartesianGrid stroke="rgba(255, 255, 255, 0.05)" horizontal={true} vertical={false} strokeDasharray="3 3" />
          {unit === "°C" && yDomainMin < 0 && yDomainMax > 0 && (
            <ReferenceLine
              y={0}
              stroke="#0d6efd"
              strokeOpacity={0.8}
              strokeWidth={1.5}
              label={{
                position: "left",
                offset: -5,
                children: "0°C",
                fill: "#0d6efd",
                fillOpacity: 0.9,
                fontSize: 10,
              }}
            />
          )}
          <XAxis
            dataKey={xkey}
            tick={{ fill: "rgba(248, 249, 250, 0.45)", fontSize: 10 }}
            tickFormatter={formatXAxis}
            axisLine={false}
            tickLine={false}
            domain={[xDomainMin, xDomainMax]}
            scale="time"
            type="number"
          />
          <YAxis
            type="number"
            domain={[yDomainMin, yDomainMax]}
            tick={{ fill: "rgba(248, 249, 250, 0.45)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}${unit}`}
            width={45}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(10, 10, 26, 0.85)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "0.5rem",
              fontSize: "0.75rem",
              color: "#f8f9fa",
              padding: "6px 10px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
            }}
            itemStyle={{ color: "#f8f9fa" }}
            labelStyle={{ color: "rgba(248, 249, 250, 0.6)", fontWeight: 600, marginBottom: "4px" }}
            labelFormatter={formatLabel}
          />
          <Area
            type="monotoneX"
            dataKey="val"
            stroke={color}
            fillOpacity={1}
            fill="url(#colorUv)"
            isAnimationActive
          />
          <Line
            type="monotoneX"
            dataKey={y2key}
            stroke="#F93154"
            dot={false}
            strokeWidth={2}
            isAnimationActive
          />
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#81D4FA" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#81D4FA" stopOpacity={0} />
            </linearGradient>
          </defs>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Chart;

