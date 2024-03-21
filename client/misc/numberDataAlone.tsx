import React from "react";
import NumberData from "./numberData";

type Props = {
  label: string;
  value: number;
  old: boolean;
  unit: string;
  fix: number;
};

function NumberDataAlone({ label, value, old, unit, fix }: Props) {
  return (
    <NumberData
      label={label}
      value={old ? null : value}
      unit={unit}
      fix={fix}
    />
  );
}

export default NumberDataAlone;
