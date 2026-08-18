/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import { observer } from "mobx-react";
import WindRose from "./wind-rose";
import Myhr from "../misc/myhr";
import { Container } from "../misc/container";
import { AppContext } from "..";
import StationHeader from "./stationHeader";
import StationRain from "./stationRain";
import StationOutIn from "./stationOutIn";

type Props = {
  appContext: AppContext;
  className?: string;
};

const Station = observer(({ appContext, className }: Props) => {
  const isIndoor =
    appContext.authCtrl.authData.isAuth && appContext.cCtrl.stationData.inData;

  return (
    <Container className={className}>
      <StationHeader appContext={appContext} />
      <Myhr />
      <StationOutIn appContext={appContext} />
      {!isIndoor && (
        <>
          <Myhr />
          <WindRose appContext={appContext} />
          <Myhr />
          <StationRain appContext={appContext} />
        </>
      )}
    </Container>
  );
});

export default Station;
