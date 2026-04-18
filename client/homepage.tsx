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
    appContext.headerCtrl.headerData.isExternalID === false;

  return (
    <div className="max-w-7xl mx-auto px-3 py-3 flex flex-col gap-5">
      <div className="relative z-50">
        <Header appContext={appContext} />
      </div>
      <div className="flex flex-col gap-5 relative z-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {(showStation || showDom) && (
            <div className="w-full lg:col-span-4 xl:col-span-3 flex flex-col lg:sticky lg:top-4 lg:self-start">
              {showStation && (
                <Station appContext={appContext} className="h-full" />
              )}
              {showDom && <Dom appContext={appContext} className="h-full" />}
            </div>
          )}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-5 min-w-0 w-full">
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
