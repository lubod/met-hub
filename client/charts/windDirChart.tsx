import moment from "moment";
import React from "react";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { IChartsRange } from "./chartsData";

type ChartData = {
  chdata: {}[];
  xkey: string;
  ykey: string;
  color: string;
  range: IChartsRange;
};

function WindDirChart({ chdata, xkey, ykey, color, range }: ChartData) {
  function formatXAxis(tickItem: string) {
    return moment(parseInt(tickItem, 10)).format(range.format);
  }

  function formatLabel(label: string) {
    return moment(parseInt(label, 10)).format("DD.MM.YYYY HH:mm:ss");
  }

  return (
    <div className="text-left w-full flex flex-col gap-2">
      {ykey === "winddir" && (
        <>
          {/* Sleek Custom Legend */}
          <div className="flex flex-row flex-wrap gap-4 mb-2 text-xs justify-end pr-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[rgba(232,230,227,0.65)] font-medium">Wind Direction</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" aspect={7.0 / 4.0}>
            <ScatterChart
              data={chdata}
              margin={{
                top: 10,
                right: 10,
                left: -15,
                bottom: 0,
              }}
            >
              <CartesianGrid stroke="rgba(255, 255, 255, 0.05)" horizontal={true} vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey={xkey}
                tick={{ fill: "rgba(232, 230, 227, 0.45)", fontSize: 10 }}
                tickFormatter={formatXAxis}
                axisLine={false}
                tickLine={false}
                domain={["auto", "auto"]}
                scale="time"
              />
              <YAxis
                type="number"
                domain={[0, 360]}
                ticks={[0, 90, 180, 270, 360]}
                tick={{ fill: "rgba(232, 230, 227, 0.45)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  v === 0 || v === 360 ? "N" : v === 90 ? "E" : v === 180 ? "S" : v === 270 ? "W" : `${v}°`
                }
                width={35}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(26, 31, 46, 0.9)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.5rem",
                  fontSize: "0.75rem",
                  color: "#e8e6e3",
                  padding: "6px 10px",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
                }}
                itemStyle={{ color: "#e8e6e3" }}
                labelStyle={{ color: "rgba(232, 230, 227, 0.6)", fontWeight: 600, marginBottom: "4px" }}
                labelFormatter={formatLabel}
              />
              <Scatter dataKey={ykey} fill={color} isAnimationActive={false} />
            </ScatterChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}

export default WindDirChart;

