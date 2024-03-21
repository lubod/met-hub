import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import React from "react";
import { observer } from "mobx-react";
import { AppContext } from "..";
import { AllStationsCfgClient } from "../../common/allStationsCfgClient";

type StepsListProps = {
  appContext: AppContext;
};

const HeaderStationsList = observer(({ appContext }: StepsListProps) => (
  <Listbox
    value={appContext.headerCtrl.headerData.station}
    onChange={(station) => {
      appContext.setStation(station);
    }}
  >
    <div className="relative">
      <Listbox.Button className="relative w-full min-w-52 rounded-md bg-blue py-1.5 pl-3 pr-8 shadow-lg text-light hover:bg-blue2">
        <span className="block truncate">
          {appContext.headerCtrl.headerData.station.place}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon
            className="h-5 w-5 text-light"
            aria-hidden="true"
          />
        </span>
      </Listbox.Button>
      <Listbox.Options className="absolute z-10 overflow-auto mt-1 w-full rounded-md bg-blue p-1 shadow-lg text-light">
        {[...AllStationsCfgClient.getStations()].map(([key, station]) => (
          <Listbox.Option
            key={key}
            className="bg-blue flex w-full items-center rounded-md p-1 hover:bg-blue2 text-light"
            value={station}
          >
            {station.place}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </div>
  </Listbox>
));

export default HeaderStationsList;
