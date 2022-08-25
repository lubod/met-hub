/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
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

type ChartData = {
  chdata: {}[];
  xkey: string;
  ykey: string;
};

const WindDirChart = function ({ chdata, xkey, ykey }: ChartData) {
  // console.info("render wind dir chart", chdata, xkey, ykey, y2key, domainMin, domainMax);
  return (
    <div className="text-left">
      {ykey === "winddir" && (
        <ResponsiveContainer width="100%" aspect={4.0 / 4.0}>
          <ScatterChart
            data={chdata}
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid stroke="#ccc" vertical={false} horizontal={false} />
            <XAxis dataKey={xkey} tick={{ fill: "white" }} />
            <YAxis
              hide
              type="number"
              domain={[0, 360]}
              tick={{ fill: "white" }}
            />
            <Tooltip
              labelStyle={{ color: "black" }}
              itemStyle={{ color: "black" }}
            />
            <Scatter dataKey={ykey} fill="#17A2B8" />
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default WindDirChart;
