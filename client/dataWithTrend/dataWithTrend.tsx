/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { observer } from "mobx-react";
import React from "react";
import Data from "../data/data";
import Trend from "../trend/trend";

type DataWithTrendProps = {
  label: string;
  value: number;
  unit: string;
  fix: number;
  data: Array<number>;
  range: number;
  couldBeNegative: boolean;
  onClick: any;
  color: string;
};

const DataWithTrend = observer(
  ({
    label,
    value,
    unit,
    fix,
    data,
    range,
    couldBeNegative,
    onClick,
    color,
  }: DataWithTrendProps) => (
    <div className="my-2" style={{ cursor: "pointer" }} onClick={onClick}>
      <Data label={label} value={value} unit={unit} fix={fix} />
      <Trend
        data={data}
        range={range}
        couldBeNegative={couldBeNegative}
        color={color}
      />
    </div>
  )
);

export default DataWithTrend;
