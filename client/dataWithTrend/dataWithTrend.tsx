import { observer } from "mobx-react";
import React from "react";
import AuthData from "../auth/authData";
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
  authData: AuthData;
};

const DataWithTrend = observer(
  ({
    name,
    value,
    unit,
    fix,
    data,
    range,
    couldBeNegative,
    measurement,
    authData,
  }: DataWithTrendProps) => (
    <div>
      <Data name={name} value={value} unit={unit} fix={fix} />
      <Trend
        name={name}
        data={data}
        range={range}
        unit={unit}
        couldBeNegative={couldBeNegative}
        measurement={measurement}
        authData={authData}
      />
    </div>
  )
);

export default DataWithTrend;
