import React from "react";
import { observer } from "mobx-react";
import Station from "./station/station";
import Header from "./header/header";
import { AppContext } from ".";
import Forecast from "./forecast/forecast";
import About from "./about";
import Charts from "./charts/charts";
import Dom from "./dom/dom";

type Props = {
  appContext: AppContext;
};

const HomePage = observer(({ appContext }: Props) => {
  console.info("Homepage render", appContext.authCtrl.authData.isAuth);

  const showStation: boolean =
    appContext.headerCtrl.headerData.station != null &&
    appContext.headerCtrl.headerData.station.id !== "dom";
  const showDom: boolean =
    appContext.headerCtrl.headerData.station != null &&
    appContext.headerCtrl.headerData.station.id === "dom";
  const showForecast: boolean =
    appContext.forecastCtrl.forecastData.station != null;
  const showAbout: boolean =
    appContext.authCtrl.authData.isAuth === false &&
    appContext.headerCtrl.headerData.isExternalID === false;
  const showCharts: boolean =
    appContext.chartsCtrl.chartsData.station != null &&
    appContext.authCtrl.authData.isAuth === true &&
    appContext.headerCtrl.headerData.isExternalID === false;

  return (
    <div>
      <div className="flex flex-col gap-2 container mx-auto">
        <Header appContext={appContext} />
        <div className="flex flex-col justify-stretch md:flex-row gap-2">
          {showStation && <Station appContext={appContext} />}
          {showDom && <Dom appContext={appContext} />}
          {showForecast && <Forecast appContext={appContext} />}
          {showAbout && <About appContext={appContext} />}
          {showCharts && <Charts appContext={appContext} />}
        </div>
      </div>
    </div>
  );
});

export default HomePage;

// {appContext.authCtrl.authData.isAuth && (
//  <Charts appContext={appContext} />
// )}
