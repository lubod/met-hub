/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
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

type ChartData = {
  chdata: {}[];
  xkey: string;
  ykey: string;
  color: string;
  range: string;
};

const WindDirChart = function ({
  chdata,
  xkey,
  ykey,
  color,
  range,
}: ChartData) {
  function formatXAxis(tickItem: string) {
    if (range?.includes("hour")) {
      return moment(tickItem).format("HH:mm");
    }
    if (range?.includes("week")) {
      return moment(tickItem).format("DD.MM");
    }
    if (range?.includes("year")) {
      return moment(tickItem).format("MMM");
    }
    return moment(tickItem).format("DD MMM HH:mm");
  }

  function formatLabel(label: string) {
    return moment(label).format("DD.MM.YYYY HH:mm:ss");
  }

  // console.info("render wind dir chart", chdata, xkey, ykey, y2key, domainMin, domainMax);
  return (
    <div className="text-left">
      {ykey === "winddir" && (
        <ResponsiveContainer width="100%" aspect={5.0 / 4.0}>
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
            <XAxis
              dataKey={xkey}
              tick={{ fill: "white" }}
              tickFormatter={formatXAxis}
              axisLine={false}
            />
            <YAxis
              hide
              type="number"
              domain={[0, 360]}
              tick={{ fill: "white" }}
            />
            <Tooltip
              labelStyle={{ color: "black" }}
              itemStyle={{ color: "black" }}
              labelFormatter={formatLabel}
            />
            <Scatter dataKey={ykey} fill={color} isAnimationActive={false} />
          </ScatterChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default WindDirChart;
