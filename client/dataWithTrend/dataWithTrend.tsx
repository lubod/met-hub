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
};

const DataWithTrend = function ({
  name,
  value,
  unit,
  fix,
  data,
  range,
  couldBeNegative,
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
      />
    </>
  );
};

export default DataWithTrend;
