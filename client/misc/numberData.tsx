import React from "react";

type Props = {
  label: string;
  value: number;
  unit: string;
  fix: number;
};

function NumberData({ label, value, unit, fix }: Props) {
  return (
    <div className="flex flex-col text-center gap-0.5">
      <div className="metric-label">{label}</div>
      <div className="metric-value">
        {value == null ? "–" : value.toFixed(fix)}
        {value != null && unit && (
          <span className="text-sm font-normal ml-1 opacity-60">{unit}</span>
        )}
      </div>
    </div>
  );
}

export default NumberData;
