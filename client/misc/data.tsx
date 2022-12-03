import React from "react";

type DataProps = {
  label: string;
  value: number;
  unit: string;
  fix: number;
};

function Data({ label, value, unit, fix }: DataProps) {
  return (
    <div className="text-left">
      <div className="small text-white-50 font-weight-bold">{label}</div>
      <span className="h4 mr-1">{value == null ? "" : value.toFixed(fix)}</span>
      <span className="small">{unit}</span>
    </div>
  );
}

export default Data;
