import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import React from "react";
import { observer } from "mobx-react";
import { isMobile } from "react-device-detect";
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
      <Listbox.Button className="glass-select relative w-full md:min-w-56 !py-1.5 !pl-3.5 !pr-9">
        <span className="block truncate max-w-[150px] sm:max-w-none text-left">
          {appContext.headerCtrl.headerData.station?.place ?? "-"}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
          <ChevronUpDownIcon
            className="h-4 w-4 text-light opacity-70"
            aria-hidden="true"
          />
        </span>
      </Listbox.Button>
      <Listbox.Options className="glass-dropdown absolute z-[60] overflow-auto mt-1.5 w-full max-h-60 p-1.5 text-light focus:outline-none">
        {[...AllStationsCfgClient.getStations()].map(([key, station]) => (
          <Listbox.Option
            key={key}
            className={({ active, selected }) =>
              `flex w-full items-center rounded-lg px-2.5 py-1.5 text-sm cursor-pointer transition-colors ${
                selected
                  ? "bg-[#6ba3a8]/20 text-[#e8e6e3] font-semibold"
                  : active
                  ? "bg-white/10 text-white"
                  : "text-[rgba(232,230,227,0.85)]"
              }`
            }
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
