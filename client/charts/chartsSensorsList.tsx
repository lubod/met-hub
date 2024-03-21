import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import React from "react";
import { observer } from "mobx-react";
import ChartsCtrl from "./chartsCtrl";

type StepsListProps = {
  chartsCtrl: ChartsCtrl;
};

const ChartsSensorsList = observer(({ chartsCtrl }: StepsListProps) => (
  <Listbox
    value={chartsCtrl.chartsData.sensor}
    onChange={(sensor) => {
      chartsCtrl.chartsData.setSensor(sensor);
      chartsCtrl.reload();
    }}
  >
    <div className="relative">
      <Listbox.Button className="relative w-full min-w-52 rounded-md bg-blue py-1.5 pl-3 pr-8 shadow-lg text-light hover:bg-blue2">
        <span className="block truncate">
          {chartsCtrl.chartsData.sensor.label}{" "}
          {chartsCtrl.chartsData.sensor.unit}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon
            className="h-5 w-5 text-light"
            aria-hidden="true"
          />
        </span>
      </Listbox.Button>
      <Listbox.Options className="absolute z-10 overflow-auto mt-1 w-full rounded-md bg-blue p-1 shadow-lg text-light">
        {chartsCtrl.chartsData.allSensors.map((sensor) => (
          <Listbox.Option
            key={sensor.id}
            className="bg-blue flex w-full items-center rounded-md p-1 hover:bg-blue2 text-light"
            value={sensor}
          >
            {sensor.label} {sensor.unit}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </div>
  </Listbox>
));

export default ChartsSensorsList;
