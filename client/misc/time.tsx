import { observer } from "mobx-react";
import moment from "moment";
import React from "react";

type Props = {
  label: string;
  time: Date;
  format: string;
  old: boolean;
};

const Time = observer(({ label, time, format, old }: Props) => (
  <div className="flex flex-col text-center">
    <div className="text-sm text-gray font-normal font-sans">{label}</div>
    <div
      className={`text-2xl font-normal font-sans ${old ? "text-red" : "text-light"}`}
    >
      {time == null ? "-" : moment(time).format(format)}
    </div>
  </div>
));

export default Time;
