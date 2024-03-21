import React from "react";
import { observer } from "mobx-react";
import Chart from "./chart";
import WindDirChart from "./windDirChart";
import RainChart from "./rainChart";
import Myhr from "../misc/myhr";
import { Container } from "../misc/container";
import { AppContext } from "..";
import ChartsHeader from "./chartsHeader";
import ChartsStats from "./chartsStats";
import ChartsMap from "./chartsMap";

type ChartsProps = {
  appContext: AppContext;
};

const Charts = observer(
  ({
    appContext,
  }: // range
  ChartsProps) => (
    // console.info("render charts", chartsData);
    // const map = useMap();
    // map.invalidateSize();
    <Container>
      <ChartsHeader appContext={appContext} />
      <Myhr />
      <ChartsStats appContext={appContext} />
      <Myhr />
      {appContext.chartsCtrl.chartsData.sensor != null &&
        appContext.chartsCtrl.chartsData.sensor.chartType === "" && (
          <Chart
            chdata={appContext.chartsCtrl.chartsData.hdata}
            xkey="timestamp"
            appContext={appContext}
          />
        )}
      {appContext.chartsCtrl.chartsData.sensor != null &&
        appContext.chartsCtrl.chartsData.sensor.chartType ===
          "winddir" && (
          <WindDirChart
            chdata={appContext.chartsCtrl.chartsData.hdata}
            xkey="timestamp"
            ykey={appContext.chartsCtrl.chartsData.sensor.col}
            color={appContext.chartsCtrl.chartsData.sensor.color}
            range={appContext.chartsCtrl.chartsData.cdata.range}
          />
        )}
      {appContext.chartsCtrl.chartsData.sensor != null &&
        appContext.chartsCtrl.chartsData.sensor.chartType === "rain" && (
          <RainChart
            chdata={appContext.chartsCtrl.chartsData.hdata}
            xkey="timestamp"
            ykey={appContext.chartsCtrl.chartsData.sensor.col}
            yDomainMin={appContext.chartsCtrl.chartsData.cdata.yDomainMin}
            yDomainMax={appContext.chartsCtrl.chartsData.cdata.yDomainMax}
            color={appContext.chartsCtrl.chartsData.sensor.color}
            range={appContext.chartsCtrl.chartsData.cdata.range}
          />
        )}
      <Myhr />
      {appContext.chartsCtrl.chartsData.sensor != null && (
        <ChartsMap appContext={appContext} />
      )}
    </Container>
  ),
);

export default Charts;
