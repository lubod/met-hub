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
      <Listbox.Button className="glass-select relative w-full md:min-w-52 !py-1.5 !pl-3 !pr-8">
        <span className="block truncate">
          {isMobile &&
          appContext.headerCtrl.headerData.station.place.length > 14
            ? `${appContext.headerCtrl.headerData.station.place.substring(0, 13)}~`
            : appContext.headerCtrl.headerData.station.place}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon
            className="h-5 w-5 text-light opacity-60"
            aria-hidden="true"
          />
        </span>
      </Listbox.Button>
      <Listbox.Options className="glass-dropdown absolute z-[60] overflow-auto mt-1 w-full p-1 text-light">
        {[...AllStationsCfgClient.getStations()].map(([key, station]) => (
          <Listbox.Option
            key={key}
            className="flex w-full items-center rounded-lg px-2 py-1.5 text-sm text-light hover:bg-white/10 cursor-pointer"
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
