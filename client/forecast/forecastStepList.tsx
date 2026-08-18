import React from "react";
import { observer } from "mobx-react";
import ForecastCtrl from "./forecastCtrl";
import { forecastHours } from "./forecastData";

type StepsListProps = {
  forecastCtrl: ForecastCtrl;
};

const ForecastStepsList = observer(({ forecastCtrl }: StepsListProps) => (
  <div className="inline-flex p-1 rounded-xl bg-white/[0.04] border border-white/10 shadow-inner backdrop-blur-md">
    {forecastHours.map((step) => {
      const active = forecastCtrl.forecastData.step.hours === step.hours;
      return (
        <button
          key={step.hours}
          type="button"
          onClick={() => {
            forecastCtrl.forecastData.setStep(step);
          }}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
            active
              ? "bg-cyan/20 text-cyan border border-cyan/40 shadow-sm font-semibold"
              : "text-light/60 hover:text-light hover:bg-white/5 border border-transparent"
          }`}
        >
          {step.display}
        </button>
      );
    })}
  </div>
));

export default ForecastStepsList;
