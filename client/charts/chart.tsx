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
  color: string;
};

const Chart = function ({
  chdata,
  xkey,
  ykey,
  y2key,
  domainMin,
  domainMax,
  color,
}: ChartData) {
  // console.info("render chart", chdata, xkey, ykey, y2key, domainMin, domainMax);
  return (
    <div className="text-left">
      <ResponsiveContainer width="100%" aspect={5.0 / 4.0}>
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
            dataKey={ykey}
            stroke={color}
            fillOpacity={1}
            fill="url(#colorUv)"
          />
          <Line
            type="monotoneX"
            dataKey={y2key}
            stroke="#F93154"
            dot={false}
            strokeWidth={2}
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
          <CartesianGrid stroke="#ccc" vertical={false} horizontal={false} />
          <XAxis dataKey={xkey} tick={{ fill: "white" }} />
          <YAxis
            hide
            type="number"
            domain={[domainMin, domainMax]}
            tick={{ fill: "white" }}
          />
          <Tooltip
            labelStyle={{ color: "black" }}
            itemStyle={{ color: "black" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
