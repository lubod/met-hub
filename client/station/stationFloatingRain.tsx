import React from "react";
import { observer } from "mobx-react";
import { AppContext } from "..";
import NumberDataAlone from "../misc/numberDataAlone";

type Props = {
  appContext: AppContext;
};

type RainIntervalRow = { interval: string; sum: number };

// The API may return fewer aggregates than the UI renders (partial history);
// missing cells render as empty instead of crashing the whole app.
function rainSum(raindata: RainIntervalRow[] | null, index: number): number | null {
  const row = raindata?.[index];
  if (row == null || row.sum == null) return null;
  const parsed = parseFloat(String(row.sum));
  return Number.isFinite(parsed) ? parsed : null;
}

const INTERVALS: Array<{ label: string; index: number }> = [
  { label: "1 hour", index: 0 },
  { label: "3 hour", index: 1 },
  { label: "6 hour", index: 2 },
  { label: "12 hour", index: 3 },
  { label: "1 day", index: 4 },
  { label: "3 days", index: 5 },
  { label: "1 week", index: 6 },
  { label: "4 weeks", index: 7 },
];

const StationFloatingRain = observer(({ appContext }: Props) => (
  <div className="flex flex-row flex-wrap gap-y-4">
    {INTERVALS.map(({ label, index }) => (
      <div className="basis-1/2" key={label}>
        <NumberDataAlone
          label={label}
          value={rainSum(appContext.cCtrl.stationData.raindata, index)}
          unit=""
          fix={1}
          old={false}
        />
      </div>
    ))}
  </div>
));

export default StationFloatingRain;
