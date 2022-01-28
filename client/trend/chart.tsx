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

type TrendData = {
  chdata: {}[];
  xkey: string;
  ykey: string;
  // loadFnc: Function;
  domainMin: number;
  domainMax: number;
  // page: number;
  // offset: number;
};

const Chart = function ({
  chdata,
  xkey,
  ykey,
  // loadFnc,
  domainMin,
  domainMax,
}: // page,
// offset,
TrendData) {
  // console.info("render chart");
  // console.info(domainMin, domainMax, chdata);
  return (
    <div className="text-left">
      <ResponsiveContainer width="100%" aspect={16.0 / 10.0}>
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
            type="monotone"
            dataKey={ykey}
            stroke="black"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#17A2B8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#17A2B8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#ccc" vertical={false} />
          <XAxis dataKey={xkey} />
          <YAxis type="number" domain={[domainMin, domainMax]} />
          <Tooltip />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
