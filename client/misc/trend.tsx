import { observer } from "mobx-react";
import React from "react";
import { Area, AreaChart, YAxis } from "recharts";

type Props = {
  data: Array<number>;
  range: number;
  couldBeNegative: boolean;
  color: string;
};

const Trend = observer(({ data, range, couldBeNegative, color }: Props) => {
  let max: number = null;
  let min: number = null;
  let avg: number = null;
  let sum: number = null;
  let domainMin = null;
  let domainMax = null;

  function round(value: number, precision: number) {
    const multiplier = 10 ** (precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  const chdata = [];
  if (data != null) {
    for (let i = 0; i < data.length; i += 1) {
      if (i === 0) {
        // eslint-disable-next-line no-multi-assign
        max = min = sum = data[i];
      } else {
        if (data[i] > max) {
          max = data[i];
        }
        if (data[i] < min) {
          min = data[i];
        }
        sum += data[i];
      }
    }
    avg = sum / data.length;
    domainMin = round(avg - range / 2, 1);
    domainMax = round(avg + range / 2, 1);
    if (max - min > range) {
      domainMin = min;
      domainMax = max;
    }

    if (domainMin < 0 && couldBeNegative === false) {
      domainMin = 0;
    }

    for (let i = 0; i < data.length; i += 1) {
      chdata.push({ minute: i, value: data[i] });
    }
  }

  // console.info("render trend");
  return (
    <div className="flex justify-center hover:brightness-50">
      <AreaChart
        width={60}
        height={25}
        data={chdata}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 9,
        }}
      >
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          fill={color}
          isAnimationActive={false}
        />
        <YAxis hide type="number" domain={[domainMin, domainMax]} />
      </AreaChart>
    </div>
  );
});

export default Trend;
