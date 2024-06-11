/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import moment from "moment";
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
import { IChartsRange } from "./chartsData";

type ChartData = {
  chdata: {}[];
  xkey: string;
  ykey: string;
  yDomainMin: number;
  yDomainMax: number;
  color: string;
  range: IChartsRange;
};

function RainChart({
  chdata,
  xkey,
  ykey,
  yDomainMin,
  yDomainMax,
  color,
  range,
}: ChartData) {
  function formatXAxis(tickItem: string) {
    return moment(parseInt(tickItem, 10)).format(range.format);
  }

  function formatLabel(label: string) {
    return moment(parseInt(label, 10)).format("DD.MM.YYYY HH:mm:ss");
  }

  // console.info("render chart", chdata, xkey, ykey, y2key, domainMin, domainMax);
  return (
    <div className="text-left">
      <ResponsiveContainer width="100%" aspect={7.0 / 4.0}>
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
            stroke={color}
            fillOpacity={1}
            fill="url(#colorUv)"
            isAnimationActive={false}
          />
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#ccc" vertical={false} horizontal={false} />
          <XAxis
            dataKey={xkey}
            tick={{ fill: "white" }}
            tickFormatter={formatXAxis}
            axisLine={false}
            domain={["auto", "auto"]}
            scale="time"
          />
          <YAxis
            hide
            type="number"
            domain={[yDomainMin, yDomainMax]}
            tick={{ fill: "white" }}
          />
          <Tooltip
            labelStyle={{ color: "black" }}
            itemStyle={{ color: "black" }}
            labelFormatter={formatLabel}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RainChart;
