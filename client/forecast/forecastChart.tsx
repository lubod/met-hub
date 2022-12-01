import { observer } from "mobx-react";
import moment from "moment";
import React from "react";
import {
  Area,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import MY_COLORS from "../../common/colors";
import { IForecastRow } from "./forecastData";

type ForecastChartData = {
  data: Array<IForecastRow>;
  index: number;
};

const ForecastChart = observer(({ data, index }: ForecastChartData) => {
  const chdata = [];

  function formatLabel(label: string) {
    return moment(label).format("HH");
  }

  if (index === 0) {
    for (let i = 0; i < 24 - data.length; i += 1) {
      chdata.push({
        timestamp: null,
        temperature: null,
        rain: null,
      });
    }
  }
  for (let i = 0; i < data.length; i += 1) {
    chdata.push({
      timestamp: data[i].timestamp,
      temperature: data[i].air_temperature,
      rain: data[i].precipitation_amount,
    });
  }
  // console.info("render forecast chart");
  return (
    <div
      className="text-center"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <ResponsiveContainer width="100%" aspect={7.0 / 1.0}>
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
            dataKey="temperature"
            stroke={MY_COLORS.orange}
            fillOpacity={1}
            fill="url(#colorUv)"
            isAnimationActive={false}
            yAxisId="left"
          />
          <Line
            type="step"
            dataKey="rain"
            stroke={MY_COLORS.blue}
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
            yAxisId="right"
          />
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={MY_COLORS.orange}
                stopOpacity={0.8}
              />
              <stop offset="95%" stopColor={MY_COLORS.orange} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="timestamp" hide axisLine={false} />
          <YAxis yAxisId="left" hide type="number" domain={["auto", "auto"]} />
          <YAxis yAxisId="right" hide type="number" domain={["auto", 5]} />

          <Tooltip
            labelStyle={{ color: "black" }}
            itemStyle={{ color: "black" }}
            // eslint-disable-next-line react/jsx-no-bind
            labelFormatter={formatLabel}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
});

export default ForecastChart;
