/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartData = {
  chdata: {}[];
  xkey: string;
  ykey: string;
  domainMin: number;
  domainMax: number;
};

const RainChart = function ({
  chdata,
  xkey,
  ykey,
  domainMin,
  domainMax,
}: ChartData) {
  // console.info("render chart", chdata, xkey, ykey, y2key, domainMin, domainMax);
  return (
    <div className="text-left">
      <ResponsiveContainer width="100%" aspect={4.0 / 4.0}>
        <AreaChart
          data={chdata}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <Area
            type="step"
            dataKey={ykey}
            stroke="#17A2B8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#17A2B8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#17A2B8" stopOpacity={0} />
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
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RainChart;
