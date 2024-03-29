import { observer } from "mobx-react";
// import moment from "moment";
import React from "react";
import {
  ComposedChart,
  Line,
  // Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import MY_COLORS from "../../common/colors";
import { ForecastDay, ForecastRow } from "./forecastData";

type Props = {
  data: Array<ForecastDay>;
  lastTimestamp: Date;
  firstTimestamp: Date;
  hours: number;
  offset6h: number;
  width: number;
};

const ForecastChart = observer(
  ({ data, lastTimestamp, firstTimestamp, hours, offset6h, width }: Props) => {
    const chdata = [];

    /*
    function formatLabel(label: string) {
      return moment(label).format("MMM DD HH:mm");
    }
    */

    if (hours === 24 && data.length > 0 && data[0].rows.length > 0) {
      for (let h = 0; h < data[0].rows[0].timestamp.getHours(); h += 1) {
        chdata.push({
          timestamp:
            data[0].rows[0].timestamp.getTime() -
            (data[0].rows[0].timestamp.getHours() - h) * 3600000,
          rain: null,
          wind_speed: null,
          clouds: null,
        });
      }
    }

    if (
      hours === 6 &&
      data.length > 0 &&
      data[0].rows.length > 0 &&
      offset6h === 0
    ) {
      const diff = data[0].rows[0].timestamp.getUTCHours() % 6;
      for (let h = diff; h > 0; h -= 1) {
        chdata.push({
          timestamp: data[0].rows[0].timestamp.getTime() - h * 3600000,
          rain: null,
          wind_speed: null,
          clouds: null,
        });
      }
    }

    for (let i = 0; i < data.length; i += 1) {
      for (let j = 0; j < data[i].rows.length; j += 1) {
        const forecastRow: ForecastRow = data[i].rows[j];
        if (
          lastTimestamp != null &&
          forecastRow.timestamp.getTime() > lastTimestamp.getTime()
        ) {
          break;
        }
        if (
          firstTimestamp != null &&
          forecastRow.timestamp.getTime() < firstTimestamp.getTime()
        ) {
          // eslint-disable-next-line no-continue
          continue;
        }
        chdata.push({
          timestamp: forecastRow.timestamp.getTime(),
          rain: forecastRow.precipitation_amount_row,
          wind_speed: (forecastRow.wind_speed * 3.6).toFixed(1),
          clouds: forecastRow.cloud_area_fraction,
        });
      }
    }

    console.info("render forecast chart");
    return (
      <div className="flex flex-col">
        <div className="text-sm text-center text-gray border-gray py-4">
          Rain
          <span className="text-blue border-blue">&#8226;</span>{" "}
          <span className="">Clouds</span>
          <span className="text-light border-light">&#8226;</span>
          <span className="">Wind speed</span>
          <span className="text-purple border-purple">&#8226;</span>{" "}
        </div>
        <div className="">
          <ComposedChart
            height={70}
            width={width}
            data={chdata}
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <Line
              type="monotoneX"
              dataKey="clouds"
              stroke={MY_COLORS.light}
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
              yAxisId="clouds"
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
              type="step"
              dataKey="rain"
              stroke={MY_COLORS.blue}
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
              yAxisId="rain"
            />
            <XAxis
              dataKey="timestamp"
              hide
              axisLine={false}
              domain={["auto", "auto"]}
              scale="time"
              type="number"
            />
            <YAxis yAxisId="rain" hide type="number" domain={[0, 5]} />
            <YAxis yAxisId="wind_speed" hide type="number" domain={[0, 50]} />
            <YAxis yAxisId="clouds" hide type="number" domain={[0, 100]} />
            {/* 
              <Tooltip
                labelStyle={{ color: "black" }}
                itemStyle={{ color: "black" }}
                // eslint-disable-next-line react/jsx-no-bind
                labelFormatter={formatLabel}
            /> */}
          </ComposedChart>
        </div>
      </div>
    );
  },
);

export default ForecastChart;
