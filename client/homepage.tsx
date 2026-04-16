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
    appContext.forecastCtrl.forecastData.station != null &&
    appContext.headerCtrl.headerData.station?.id !== "dom";
  const showAbout: boolean =
    appContext.authCtrl.authData.isAuth === false &&
    appContext.headerCtrl.headerData.isExternalID === false;
  const showCharts: boolean =
    appContext.chartsCtrl.chartsData.station != null &&
    appContext.authCtrl.authData.isAuth === true &&
    appContext.headerCtrl.headerData.isExternalID === false &&
    appContext.headerCtrl.headerData.station?.id !== "dom";

  return (
    <div className="max-w-7xl mx-auto px-3 py-3 flex flex-col gap-3">
      <div className="relative z-50">
        <Header appContext={appContext} />
      </div>
      <div className="flex flex-col gap-3 relative z-0">
        <div className="flex flex-col md:flex-row gap-3">
          {(showStation || showDom) && (
            <div className="w-full md:w-[480px] shrink-0 flex flex-col">
              {showStation && (
                <Station appContext={appContext} className="h-full" />
              )}
              {showDom && <Dom appContext={appContext} className="h-full" />}
            </div>
          )}
          <div className="flex flex-col gap-3 flex-1 min-w-0 w-full">
            {showForecast && (
              <Forecast appContext={appContext} className="h-full" />
            )}
            {showAbout && (
              <About appContext={appContext} className="h-full !max-w-none" />
            )}
          </div>
        </div>
        {showCharts && <Charts appContext={appContext} />}
      </div>
    </div>
  );
});

export default HomePage;

// {appContext.authCtrl.authData.isAuth && (
//  <Charts appContext={appContext} />
// )}
