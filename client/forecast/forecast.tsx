import React from "react";
import { observer } from "mobx-react";
import Myhr from "../misc/myhr";
import { Container } from "../misc/container";
import ForecastCharts from "./forecastCharts";
import ForecastHeader from "./forecastHeader";
import { AppContext } from "..";

type Props = {
  appContext: AppContext;
  className?: string;
};

const Forecast = observer(({ appContext, className }: Props) => (
  <Container className={className}>
    <ForecastHeader appContext={appContext} />
    <Myhr />
    <ForecastCharts
      days={[...appContext.forecastCtrl.forecastData.days.values()]}
      forecast_6h={appContext.forecastCtrl.forecastData.forecast_6h}
      forecast_1h={appContext.forecastCtrl.forecastData.forecast_1h}
      forecastCtrl={appContext.forecastCtrl}
    />
    <Myhr />
    <div className="flex flex-row justify-center text-sm text-gray gap-1">
      <div>Data & icons source:</div>
      <a
        className="text-cyan/70 hover:text-cyan underline"
        href="https://www.met.no/en"
      >
        Norwegian Meteo Institute
      </a>
    </div>
  </Container>
));

export default Forecast;
