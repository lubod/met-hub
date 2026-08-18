/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { observer } from "mobx-react";
import { AppContext } from "..";
import Text from "../misc/text";
import StationOut from "./stationOut";
import StationIn from "./stationIn";

type Props = {
  appContext: AppContext;
};

const StationOutIn = observer(({ appContext }: Props) => {
  const {isAuth} = appContext.authCtrl.authData;
  const isIndoor = isAuth && appContext.cCtrl.stationData.inData;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <Text>CONDITIONS</Text>
        {isAuth && (
          <div className="flex items-center p-0.5 rounded-lg bg-black/30 border border-white/[0.06]">
            <button
              type="button"
              className={`segmented-btn ${!isIndoor ? "active" : ""}`}
              onClick={() => {
                appContext.cCtrl.stationData.setInData(false);
              }}
            >
              Outdoor
            </button>
            <button
              type="button"
              className={`segmented-btn ${isIndoor ? "active" : ""}`}
              onClick={() => {
                appContext.cCtrl.stationData.setInData(true);
              }}
            >
              Indoor
            </button>
          </div>
        )}
      </div>
      {!isIndoor && <StationOut appContext={appContext} />}
      {isIndoor && <StationIn appContext={appContext} />}
    </div>
  );
});

export default StationOutIn;
