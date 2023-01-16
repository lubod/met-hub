import { observer } from "mobx-react";
import moment from "moment";
import React from "react";
import {
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import MY_COLORS from "../../common/colors";
import { IForecastDay, IForecastRow } from "./forecastData";

type Props = {
  data: Array<IForecastDay>;
  lastTimestamp: Date;
};

const ForecastChart = observer(({ data, lastTimestamp }: Props) => {
  const chdata = [];

  function formatLabel(label: string) {
    return moment(label).format("MMM DD HH:mm");
  }

  for (let i = 0; i < data.length; i += 1) {
    for (let j = 0; j < data[i].forecastRows.length; j += 1) {
      const forecastRow: IForecastRow = data[i].forecastRows[j];
      if (forecastRow.timestamp.getTime() > lastTimestamp.getTime()) {
        break;
      }
      chdata.push({
        timestamp: forecastRow.timestamp.getTime(),
        rain: forecastRow.precipitation_amount,
        wind_speed: (parseFloat(forecastRow.wind_speed) * 3.6).toFixed(1),
        clouds: forecastRow.cloud_area_fraction,
      });
    }
  }

  console.info("render forecast chart", chdata);
  return (
    <>
      <div className="text-left small text-white-50 font-weight-bold mb-2 mt-2">
        Rain
        <span style={{ color: MY_COLORS.blue }}>&#8226;</span>{" "}
        <span className="">Wind speed</span>
        <span style={{ color: MY_COLORS.purple }}>&#8226;</span>{" "}
        <span className="">Clouds</span>
        <span style={{ color: MY_COLORS.white }}>&#8226;</span>
      </div>
      <div
        className="text-center"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <ResponsiveContainer width="100%" aspect={5.0 / 1.0}>
          <ComposedChart
            data={chdata}
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <Line
              type="step"
              dataKey="rain"
              stroke={MY_COLORS.blue}
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
              yAxisId="rain"
            />
            <Line
              type="monotoneX"
              dataKey="wind_speed"
              stroke={MY_COLORS.purple}
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
              yAxisId="wind_speed"
            />
            <Line
              type="monotoneX"
              dataKey="clouds"
              stroke={MY_COLORS.light}
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
              yAxisId="clouds"
            />
            <XAxis
              dataKey="timestamp"
              hide
              axisLine={false}
              domain={["auto", "auto"]}
              scale="time"
            />
            <YAxis yAxisId="rain" hide type="number" domain={[0, 5]} />
            <YAxis yAxisId="wind_speed" hide type="number" domain={[0, 50]} />
            <YAxis yAxisId="clouds" hide type="number" domain={[0, 100]} />

            <Tooltip
              labelStyle={{ color: "black" }}
              itemStyle={{ color: "black" }}
              // eslint-disable-next-line react/jsx-no-bind
              labelFormatter={formatLabel}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </>
  );
});

export default ForecastChart;
