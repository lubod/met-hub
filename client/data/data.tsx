import React from "react";

type DataProps = {
  name: string;
  value: number;
  unit: string;
  fix: number;
};

const Data = function ({ name, value, unit, fix }: DataProps) {
  return (
    <div className="text-left">
      <div className="small text-info font-weight-bold">{name}</div>
      <span className="h4 mr-1">{value == null ? "" : value.toFixed(fix)}</span>
      <span className="small">{unit}</span>
    </div>
  );
};

export default Data;
