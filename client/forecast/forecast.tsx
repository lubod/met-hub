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
  <Container className={`flex flex-col gap-6 ${className}`}>
    <ForecastHeader appContext={appContext} />
    <Myhr />
    <ForecastCharts
      days={[...appContext.forecastCtrl.forecastData.days.values()]}
      forecast_6h={appContext.forecastCtrl.forecastData.forecast_6h}
      forecast_1h={appContext.forecastCtrl.forecastData.forecast_1h}
      forecastCtrl={appContext.forecastCtrl}
    />
    <Myhr />
    <div className="flex flex-row justify-center text-xs text-light/50 gap-1.5 pt-1 pb-2">
      <span>Data & icons source:</span>
      <a
        className="text-cyan/80 hover:text-cyan underline font-medium transition-colors"
        href="https://www.met.no/en"
        target="_blank"
        rel="noopener noreferrer"
      >
        Norwegian Meteorological Institute
      </a>
    </div>
  </Container>
));

export default Forecast;
