import React from "react";
import Data from "./data";

type DataProps = {
  name: string;
  value: number;
  unit: string;
  fix: number;
};

const DataAlone = function ({ name, value, unit, fix }: DataProps) {
  return (
    <div className="text-left my-2">
      <Data name={name} value={value} unit={unit} fix={fix} />
    </div>
  );
};

export default DataAlone;
