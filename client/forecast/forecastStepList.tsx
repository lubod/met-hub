import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import React from "react";
import { observer } from "mobx-react";
import ForecastCtrl from "./forecastCtrl";
import { forecastHours } from "./forecastData";

type StepsListProps = {
  forecastCtrl: ForecastCtrl;
};

const ForecastStepsList = observer(({ forecastCtrl }: StepsListProps) => (
  <Listbox
    value={forecastCtrl.forecastData.step}
    onChange={(e) => {
      forecastCtrl.forecastData.setStep(e);
    }}
  >
    <div className="relative">
      <Listbox.Button className="glass-select relative w-full min-w-32 !py-1.5 !pl-3 !pr-8">
        <span className="block truncate">
          {forecastCtrl.forecastData.step.display}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon
            className="h-5 w-5 text-light opacity-60"
            aria-hidden="true"
          />
        </span>
      </Listbox.Button>
      <Listbox.Options className="glass-dropdown absolute z-50 overflow-auto mt-1 w-full p-1 text-light">
        {forecastHours.map((step) => (
          <Listbox.Option
            key={step.hours}
            className="flex w-full items-center rounded-lg px-2 py-1.5 text-sm text-light hover:bg-white/10 cursor-pointer"
            value={step}
          >
            {step.display}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </div>
  </Listbox>
));

export default ForecastStepsList;
