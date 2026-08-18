/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { observer } from "mobx-react";
import { AppContext } from "..";
import Text from "../misc/text";
import StationFixedRain from "./stationFixedRain";
import StationFloatingRain from "./stationFloatingRain";

type Props = {
  appContext: AppContext;
};

const StationRain = observer(({ appContext }: Props) => {
  const isFloating = appContext.cCtrl.stationData.floatingRainData;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <Text>RAIN (mm)</Text>
        {appContext.authCtrl.authData.isAuth && (
          <div className="flex items-center p-0.5 rounded-lg bg-black/30 border border-white/[0.06]">
            <button
              type="button"
              className={`segmented-btn ${!isFloating ? "active" : ""}`}
              onClick={() => {
                appContext.cCtrl.stationData.setFloatingRainData(false);
              }}
            >
              Fixed
            </button>
            <button
              type="button"
              className={`segmented-btn ${isFloating ? "active" : ""}`}
              onClick={() => {
                appContext.cCtrl.stationData.setFloatingRainData(true);
                appContext.cCtrl.fetchRainData();
              }}
            >
              Floating
            </button>
          </div>
        )}
      </div>
      {!isFloating && <StationFixedRain appContext={appContext} />}
      {isFloating && <StationFloatingRain appContext={appContext} />}
    </div>
  );
});

export default StationRain;
