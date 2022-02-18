/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartData = {
  chdata: {}[];
  xkey: string;
  ykey: string;
  y2key: string;
  domainMin: number;
  domainMax: number;
};

const Chart = function ({
  chdata,
  xkey,
  ykey,
  y2key,
  domainMin,
  domainMax,
}: ChartData) {
  // console.info("render chart");
  // console.info(domainMin, domainMax, chdata);
  return (
    <div className="text-left">
      {ykey !== "winddir" && (
        <ResponsiveContainer width="100%" aspect={16.0 / 10.0}>
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
              type="basis"
              dataKey={ykey}
              stroke="#17A2B8"
              fillOpacity={1}
              fill="url(#colorUv)"
            />

            <Line
              type="linear"
              dataKey={y2key}
              stroke="#F93154"
              dot={false}
              strokeWidth={2}
            />
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#17A2B8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#17A2B8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#81D4FA" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#81D4FA" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#ccc" vertical={false} />
            <XAxis dataKey={xkey} />
            <YAxis type="number" domain={[domainMin, domainMax]} />
            <Tooltip />
          </ComposedChart>
        </ResponsiveContainer>
      )}
      {ykey === "winddir" && (
        <ResponsiveContainer width="100%" aspect={16.0 / 10.0}>
          <ScatterChart
            data={chdata}
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid stroke="#ccc" vertical={false} />
            <XAxis dataKey={xkey} />
            <YAxis type="number" domain={[0, 360]} />
            <Tooltip />
            <Scatter dataKey={ykey} fill="#17A2B8" />
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Chart;
