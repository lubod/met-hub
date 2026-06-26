/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { observer } from "mobx-react";
import React from "react";
import NumberData from "./numberData";
import Trend from "./trend";
import { ISensor } from "../../common/sensor";

type Props = {
  value: number | null;
  trend: Array<number | null>;
  old: boolean;
  onClick: any;
  sensor: ISensor;
};

const accentClass: Record<string, string> = {
  "#e07856": "metric-card-temp",
  "#7fb8a8": "metric-card-humid",
  "#8b9dc3": "metric-card-press",
  "#d4a843": "metric-card-solar",
  "#6ba3a8": "metric-card-rain",
  "#8dbe9d": "metric-card-wind",
};

const NumberDataWithTrend = observer(
  ({ value, trend, old, onClick, sensor }: Props) => (
    <div
      className={`metric-card ${accentClass[sensor.color] ?? ""}`}
      onClick={onClick}
    >
      <NumberData
        label={sensor.label}
        value={old ? null : value}
        unit={sensor.unit}
        fix={sensor.fix}
      />
      <div className="trend-wrap">
        <Trend
          data={trend}
          range={sensor.range}
          couldBeNegative={sensor.couldBeNegative}
          color={sensor.color}
        />
      </div>
    </div>
  ),
);

export default NumberDataWithTrend;
