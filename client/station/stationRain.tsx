/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { observer } from "mobx-react";
import { Switch } from "@headlessui/react";
import { AppContext } from "..";
import Text from "../misc/text";
import StationFixedRain from "./stationFixedRain";
import StationFloatingRain from "./stationFloatingRain";

type Props = {
  appContext: AppContext;
};

const StationRain = observer(({ appContext }: Props) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-row justify-center gap-2">
      <Text>RAIN mm</Text>
      {appContext.authCtrl.authData.isAuth &&
        appContext.authCtrl.authData.id ===
          appContext.cCtrl.stationData.station.owner && (
          <div className="flex flex-row gap-2">
            <div className="flex flex-col place-content-center">
              <Switch
                checked={appContext.cCtrl.stationData.floatingRainData}
                onChange={(e) => {
                  appContext.cCtrl.stationData.setFloatingRainData(e);
                  if (appContext.cCtrl.stationData.floatingRainData) {
                    appContext.cCtrl.fetchRainData();
                  }
                }}
                className="bg-gray relative inline-flex h-[16px] w-[32px] shrink-0 cursor-pointer rounded-full ease-in-out"
              >
                {!appContext.cCtrl.stationData.floatingRainData && (
                  <span className="translate-x-0 pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full bg-blue shadow-lg ring-0 transition duration-200 ease-in-out" />
                )}
                {appContext.cCtrl.stationData.floatingRainData && (
                  <span className="translate-x-4 pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full bg-blue shadow-lg ring-0 transition duration-200 ease-in-out" />
                )}
              </Switch>
            </div>
            <div className="text-md text-light font-normal font-sans text-center">
              Fix / Floating
            </div>
          </div>
        )}
    </div>
    {appContext.cCtrl.stationData.floatingRainData === false && (
      <StationFixedRain appContext={appContext} />
    )}
    {appContext.cCtrl.stationData.floatingRainData === true && (
      <StationFloatingRain appContext={appContext} />
    )}
  </div>
));

export default StationRain;
