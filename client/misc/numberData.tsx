import React from "react";

type Props = {
  label: string;
  value: number;
  unit: string;
  fix: number;
};

function NumberData({ label, value, unit, fix }: Props) {
  return (
    <div className="flex flex-col text-center">
      <div className="text-sm text-gray font-normal font-sans">
        {label} {unit}
      </div>
      <div className="text-2xl text-light font-normal font-sans">
        {value == null ? "-" : value.toFixed(fix)}
      </div>
    </div>
  );
}

export default NumberData;
