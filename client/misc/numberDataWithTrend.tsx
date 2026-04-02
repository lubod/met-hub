/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { observer } from "mobx-react";
import React from "react";
import NumberData from "./numberData";
import Trend from "./trend";
import { ISensor } from "../../common/sensor";

type Props = {
  value: number;
  trend: Array<number>;
  old: boolean;
  onClick: any;
  sensor: ISensor;
};

const accentClass: Record<string, string> = {
  "#fd7e14": "metric-card-temp",
  "#22d3ee": "metric-card-humid",
  "#6f42c1": "metric-card-press",
  "#ffc107": "metric-card-solar",
  "#0d6efd": "metric-card-rain",
  "#14b8a6": "metric-card-wind",
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
