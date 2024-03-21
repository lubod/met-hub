import { observer } from "mobx-react";
import React from "react";

type Props = {
  label: string;
  value: string;
};

const StringData = observer(({ label, value }: Props) => (
  <div className="flex flex-col text-center">
    <div className="text-sm text-gray font-normal font-sans">{label}</div>
    <div className="text-2xl text-light font-normal font-sans">
      {value == null ? "-" : value}
    </div>
  </div>
));

export default StringData;
