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
  chdata: { minute: number; value: number }[];
  domainMin: number;
  domainMax: number;
};

const BTrend = function ({ chdata, domainMin, domainMax }: TrendData) {
  // console.info("render trend", range);
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
            dataKey="value"
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
          <XAxis dataKey="minute" />
          <YAxis type="number" domain={[domainMin, domainMax]} />
          <Tooltip />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BTrend;
