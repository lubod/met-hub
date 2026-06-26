import React from "react";
import { observer } from "mobx-react";
import Chart from "./chart";
import WindDirChart from "./windDirChart";
import RainChart from "./rainChart";
import Myhr from "../misc/myhr";
import { Container } from "../misc/container";
import { AppContext } from "..";
import Text from "../misc/text";
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
    // console.debug("render charts", chartsData);
    // const map = useMap();
    // map.invalidateSize();
    <div
      className={
        appContext.headerCtrl.headerData.station?.id !== "dom" &&
        appContext.chartsCtrl.chartsData.sensor != null
          ? "grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch"
          : ""
      }
    >
      {/* Column 1: Map (Left) */}
      {appContext.chartsCtrl.chartsData.sensor != null &&
        appContext.headerCtrl.headerData.station?.id !== "dom" && (
          <Container className="lg:col-span-5 xl:col-span-4 h-full flex flex-col justify-stretch">
            <div className="flex flex-col gap-4 w-full h-full">
              <div className="flex flex-row justify-between">
                <Text>Location</Text>
              </div>
              <Myhr />
              <ChartsMap appContext={appContext} />
            </div>
          </Container>
        )}

      {/* Column 2: Selectors, Stats, and Charts (Right) */}
      <Container
        className={
          appContext.headerCtrl.headerData.station?.id !== "dom" &&
          appContext.chartsCtrl.chartsData.sensor != null
            ? "lg:col-span-7 xl:col-span-8"
            : ""
        }
      >
        <div className="flex flex-col gap-4 w-full h-full">
          <ChartsHeader appContext={appContext} />
          <Myhr />
          <ChartsStats appContext={appContext} />
          {appContext.chartsCtrl.chartsData.sensor != null && (
            <>
              <Myhr />
              {appContext.chartsCtrl.chartsData.sensor.chartType === "" && (
                <Chart
                  chdata={appContext.chartsCtrl.chartsData.hdata}
                  xkey="timestamp"
                  appContext={appContext}
                />
              )}
              {appContext.chartsCtrl.chartsData.sensor.chartType === "winddir" && (
                <WindDirChart
                  chdata={appContext.chartsCtrl.chartsData.hdata}
                  xkey="timestamp"
                  ykey={appContext.chartsCtrl.chartsData.sensor.col}
                  color={appContext.chartsCtrl.chartsData.sensor.color}
                  range={appContext.chartsCtrl.chartsData.cdata.range}
                />
              )}
              {appContext.chartsCtrl.chartsData.sensor.chartType === "rain" && (
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
            </>
          )}
        </div>
      </Container>
    </div>
  ),
);

export default Charts;
