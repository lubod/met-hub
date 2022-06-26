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
    authData,
  }: DataWithTrendProps) => (
    <div className="my-2">
      <Data name={name} value={value} unit={unit} fix={fix} />
      <Trend
        data={data}
        range={range}
        couldBeNegative={couldBeNegative}
        authData={authData}
      />
    </div>
  )
);

export default DataWithTrend;
