import { observer } from "mobx-react";
import React from "react";

type Props = {
  label: string;
  value: string;
};

const StringData = observer(({ label, value }: Props) => (
  <div className="flex flex-col text-center gap-0.5">
    <div className="metric-label">{label}</div>
    <div className="text-xl text-light font-light tracking-tight">
      {value == null ? "–" : value}
    </div>
  </div>
));

export default StringData;
