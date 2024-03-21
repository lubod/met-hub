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

const NumberDataWithTrend = observer(
  ({ value, trend, old, onClick, sensor }: Props) => (
    <div
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <NumberData
        label={sensor.label}
        value={old ? null : value}
        unit={sensor.unit}
        fix={sensor.fix}
      />
      <Trend
        data={trend}
        range={sensor.range}
        couldBeNegative={sensor.couldBeNegative}
        color={sensor.color}
      />
    </div>
  ),
);

export default NumberDataWithTrend;
