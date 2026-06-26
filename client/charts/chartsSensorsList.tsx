import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import React from "react";
import { observer } from "mobx-react";
import ChartsCtrl from "./chartsCtrl";

type StepsListProps = {
  chartsCtrl: ChartsCtrl;
};

const ChartsSensorsList = observer(({ chartsCtrl }: StepsListProps) => {
  const {sensor} = chartsCtrl.chartsData;
  const allSensors = chartsCtrl.chartsData.allSensors || [];

  return (
    <Listbox
      value={sensor}
      onChange={(s) => {
        chartsCtrl.chartsData.setSensor(s);
        chartsCtrl.reload();
      }}
    >
      <div className="relative">
        <Listbox.Button className="glass-select relative w-full min-w-52 !py-1.5 !pl-3 !pr-8">
          <span className="block truncate">
            {sensor ? `${sensor.label} ${sensor.unit}` : "Select Sensor"}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-light opacity-60"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Listbox.Options className="glass-dropdown absolute z-50 overflow-auto mt-1 w-full p-1 text-light">
          {allSensors.map((item) => (
            <Listbox.Option
              key={item.id}
              className="flex w-full items-center rounded-lg px-2 py-1.5 text-sm text-light hover:bg-white/10 cursor-pointer"
              value={item}
            >
              {item.label} {item.unit}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
});

export default ChartsSensorsList;
