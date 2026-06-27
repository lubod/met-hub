import React from "react";
import { observer } from "mobx-react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
import moment from "../misc/dateFormatter";

type ET0RainChartProps = {
  chdata: any[];
  xkey: string;
  range: any;
};

function ET0RainChart({ chdata, xkey, range }: ET0RainChartProps) {
  function formatXAxis(tickItem: string) {
    return moment(parseInt(tickItem, 10)).format(range.format);
  }

  function formatLabel(label: string) {
    return moment(parseInt(label, 10)).format("DD.MM.YYYY HH:mm:ss");
  }

  let maxVal = 1;
  if (chdata) {
    chdata.forEach((d) => {
      const et0 = d.max ?? 0;
      const rain = d.rain ?? 0;
      if (et0 > maxVal) maxVal = et0;
      if (rain > maxVal) maxVal = rain;
    });
  }
  const yDomainMax = Math.ceil(maxVal * 1.15);

  return (
    <div className="text-left w-full flex flex-col gap-2">
      <div className="flex flex-row flex-wrap gap-4 mb-2 text-xs justify-end pr-4 select-none">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm opacity-80" style={{ backgroundColor: "#8dbe9d" }} />
          <span className="text-[rgba(232,230,227,0.65)] font-medium">Grass ET₀ (Evapotranspiration)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm opacity-80" style={{ backgroundColor: "#6ba3a8" }} />
          <span className="text-[rgba(232,230,227,0.65)] font-medium">Rainfall</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" aspect={7.0 / 4.0}>
        <BarChart
          data={chdata}
          margin={{
            top: 10,
            right: 10,
            left: -15,
            bottom: 0,
          }}
        >
          <CartesianGrid stroke="rgba(255, 255, 255, 0.05)" horizontal vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey={xkey}
            tick={{ fill: "rgba(232, 230, 227, 0.45)", fontSize: 10 }}
            tickFormatter={formatXAxis}
            axisLine={false}
            tickLine={false}
            domain={["auto", "auto"]}
            scale="time"
          />
          <YAxis
            type="number"
            domain={[0, yDomainMax]}
            tick={{ fill: "rgba(232, 230, 227, 0.45)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v} mm`}
            width={45}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(26, 31, 46, 0.9)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "0.5rem",
              fontSize: "0.75rem",
              color: "#e8e6e3",
              padding: "6px 10px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
            }}
            itemStyle={{ color: "#e8e6e3" }}
            labelStyle={{ color: "rgba(232, 230, 227, 0.6)", fontWeight: 600, marginBottom: "4px" }}
            labelFormatter={formatLabel}
          />
          <Bar
            dataKey="max"
            name="ET0"
            fill="#8dbe9d"
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
          />
          <Bar
            dataKey="rain"
            name="Rain"
            fill="#6ba3a8"
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

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
              {appContext.chartsCtrl.chartsData.sensor.id === "et0" && (
                <ET0RainChart
                  chdata={appContext.chartsCtrl.chartsData.hdata}
                  xkey="timestamp"
                  range={appContext.chartsCtrl.chartsData.cdata.range}
                />
              )}
              {appContext.chartsCtrl.chartsData.sensor.chartType === "rain" && appContext.chartsCtrl.chartsData.sensor.id !== "et0" && (
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
