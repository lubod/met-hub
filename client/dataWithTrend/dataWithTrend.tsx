import React from "react";
import Data from "../data/data";
import Trend from "../trend/trend";

type DataWithTrendProps = {
  name: string;
  value: number;
  unit: string;
  fix: number;
  data: Array<number>;
  range: number;
  couldBeNegative: boolean;
  measurement: string;
};

const DataWithTrend = function ({
  name,
  value,
  unit,
  fix,
  data,
  range,
  couldBeNegative,
  measurement,
}: DataWithTrendProps) {
  return (
    <>
      <Data name={name} value={value} unit={unit} fix={fix} />
      <Trend
        name={name}
        data={data}
        range={range}
        unit={unit}
        couldBeNegative={couldBeNegative}
        measurement={measurement}
      />
    </>
  );
};

export default DataWithTrend;
