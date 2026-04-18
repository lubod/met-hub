/* eslint-disable react/destructuring-assignment */
/* eslint-disable camelcase */
import React from "react";
import { observer } from "mobx-react";
import ForecastChart from "./forecastChart";
import {
  Forecast1h,
  Forecast6h,
  ForecastDay,
  IGetForecastDataToDisplay,
} from "./forecastData";
import ForecastChartTemp from "./forecastChartTemp";
import ForecastCtrl from "./forecastCtrl";
import Myhr from "../misc/myhr";
import ForecastStepsList from "./forecastStepList";

const FORECAST_COLORS: Record<string, string> = {
  gray2: "#6c757d",
  orange: "#fd7e14",
  blue: "#0d6efd",
  light: "#f8f9fa",
  purple: "#6f42c1",
};

type CellProps = {
  value: string;
  color: string;
  maxLimit1?: number;
  maxLimit2?: number;
  maxLimit3?: number;
  minLimit1?: number;
  minLimit2?: number;
  minLimit3?: number;
};

function Cell({
  value,
  color,
  maxLimit1,
  maxLimit2,
  maxLimit3,
  minLimit1,
  minLimit2,
  minLimit3,
}: CellProps) {
  const val = parseFloat(value);
  let finalColor = color;
  if (color === "orange" && val < 0) finalColor = "blue";
  const hex = FORECAST_COLORS[finalColor] ?? "#ffffff";

  let bgOpacity = 0;
  if (maxLimit1 != null && val > maxLimit1) bgOpacity = 0.1;
  if (maxLimit2 != null && val > maxLimit2) bgOpacity = 0.25;
  if (maxLimit3 != null && val > maxLimit3) bgOpacity = 0.5;

  if (minLimit1 != null && val < minLimit1) bgOpacity = 0.1;
  if (minLimit2 != null && val < minLimit2) bgOpacity = 0.25;
  if (minLimit3 != null && val < minLimit3) bgOpacity = 0.5;

  return (
    <div
      className="text-center text-light border-s text-sm pb-3 basis-full min-w-11"
      style={{
        borderLeftColor: hex,
        backgroundColor:
          bgOpacity > 0
            ? `${hex}${Math.round(bgOpacity * 255)
                .toString(16)
                .padStart(2, "0")}`
            : undefined,
      }}
    >
      {value}
    </div>
  );
}

type RowsProps = {
  data: Array<IGetForecastDataToDisplay>;
};

function MyRows1({ data }: RowsProps) {
  const size = "34px";

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row w-full">
        {data.map((item: IGetForecastDataToDisplay) => (
          <Cell
            key={item.getDay() + item.getDay2()}
            value={item.getDay()}
            color="gray2"
          />
        ))}
      </div>
      <div className="flex flex-row w-full">
        {data.map((item: IGetForecastDataToDisplay) => (
          <Cell
            key={item.getDay() + item.getDay2()}
            value={item.getDay2()}
            color="gray2"
          />
        ))}
      </div>
      <div className="flex flex-row w-full">
        {data.map((item: IGetForecastDataToDisplay) => (
          <div
            className="text-center border-s border-gray2 flex justify-center basis-full min-w-11"
            key={item.getDay() + item.getDay2()}
          >
            {item.getSymbolCode() != null && (
              <img
                width={size}
                height={size}
                src={`svg/${item.getSymbolCode()}.svg`} // TODO
                alt={item.getSymbolCode()}
              />
            )}
            {item.getSymbolCode() == null && <>-</>}
          </div>
        ))}
      </div>
      <div className="flex flex-row w-full">
        {data.map((item: IGetForecastDataToDisplay) => (
          <Cell
            key={item.getDay() + item.getDay2()}
            value={item.getAirTemperatureMax()}
            color="orange"
            maxLimit1={24}
            maxLimit2={29}
            maxLimit3={34}
            minLimit1={0}
            minLimit2={-10}
            minLimit3={-20}
          />
        ))}
      </div>
      <div className="flex flex-row w-full">
        {data.map((item: IGetForecastDataToDisplay) => (
          <Cell
            key={item.getDay() + item.getDay2()}
            value={item.getAirTemperatureMin()}
            color="orange"
            maxLimit1={18}
            maxLimit2={21}
            maxLimit3={24}
            minLimit1={0}
            minLimit2={-10}
            minLimit3={-20}
          />
        ))}
      </div>
    </div>
  );
}

function MyRows2({ data }: RowsProps) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row w-full">
        {data.map((item: IGetForecastDataToDisplay) => (
          <Cell
            value={item.getPrecipitationAmount()}
            color="blue"
            key={item.getDay() + item.getDay2()}
            maxLimit1={0.01}
            maxLimit2={3}
            maxLimit3={10}
          />
        ))}
      </div>
      <div className="flex flex-row w-full">
        {data.map((item: IGetForecastDataToDisplay) => (
          <Cell
            key={item.getDay() + item.getDay2()}
            value={item.getCloudAreaFraction()}
            color="light"
            maxLimit1={50}
            maxLimit2={70}
            maxLimit3={90}
          />
        ))}
      </div>
      <div className="flex flex-row w-full">
        {data.map((item: IGetForecastDataToDisplay) => (
          <Cell
            key={item.getDay() + item.getDay2()}
            value={item.getWindSpeed()}
            color="purple"
            maxLimit1={19}
            maxLimit2={29}
            maxLimit3={39}
          />
        ))}
      </div>
      <div className="flex flex-row w-full">
        {data.map((item: IGetForecastDataToDisplay) => {
          const windSpeed = parseFloat(item.getWindSpeed());
          const hex = FORECAST_COLORS.purple;
          let bgOpacity = 0;
          if (windSpeed > 19) bgOpacity = 0.1;
          if (windSpeed > 29) bgOpacity = 0.25;
          if (windSpeed > 39) bgOpacity = 0.5;

          return (
            <div
              className="text-center border-s border-purple flex justify-center basis-full min-w-11 py-1"
              key={item.getDay() + item.getDay2()}
              style={{
                backgroundColor:
                  bgOpacity > 0
                    ? `${hex}${Math.round(bgOpacity * 255)
                        .toString(16)
                        .padStart(2, "0")}`
                    : undefined,
              }}
            >
              <svg width="25px" height="25px">
                <polygon
                  points="8 3, 12 21, 16 3"
                  fill="white"
                  stroke="white"
                  transform={`rotate(${item.getWindDir()} 12 12)`}
                />
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type Props = {
  days: Array<ForecastDay>;
  forecast_6h: Array<Forecast6h>;
  forecast_1h: Array<Forecast1h>;
  forecastCtrl: ForecastCtrl;
};

const ForecastCharts = observer(
  ({ days, forecast_6h, forecast_1h, forecastCtrl }: Props) => {
    let lastTimestamp = null;
    let firstTimestamp = null;
    let cols;
    const { hours } = forecastCtrl.forecastData.step;
    switch (hours) {
      case 1:
        cols = forecast_1h.length;
        break;
      case 6:
        cols = forecast_6h.length;
        break;
      default:
        cols = days.length;
    }

    if (forecast_6h.length > 0 && hours === 6) {
      firstTimestamp = forecast_6h[0].timestamp;
      lastTimestamp = new Date(
        forecast_6h[forecast_6h.length - 1].timestamp.getTime() + 6 * 3600000,
      );
    }

    if (forecast_1h.length > 0 && hours === 1) {
      firstTimestamp = forecast_1h[0].timestamp;
      lastTimestamp = new Date(
        forecast_1h[forecast_1h.length - 1].timestamp.getTime() + 1 * 3600000,
      );
    }

    if (days.length > 0 && hours === 24) {
      firstTimestamp = new Date(days[0].timestamp);
      firstTimestamp.setHours(0, 0, 0, 0);
      lastTimestamp = new Date(
        firstTimestamp.getTime() + days.length * 24 * 3600000,
      );
    }

    console.info(
      firstTimestamp,
      lastTimestamp,
      forecastCtrl.forecastData.offset1h,
    );

    return (
      <>
        <div className="mb-4 flex flex-row justify-center">
          <ForecastStepsList forecastCtrl={forecastCtrl} />
        </div>
        <div className="flex flex-col overflow-x-auto scrollbar-hide">
          {forecastCtrl.forecastData.step.hours === 24 && (
            <MyRows1 data={days} />
          )}
          {forecastCtrl.forecastData.step.hours === 6 && (
            <MyRows1 data={forecast_6h} />
          )}
          {forecastCtrl.forecastData.step.hours === 1 && (
            <MyRows1 data={forecast_1h} />
          )}
          {firstTimestamp != null && lastTimestamp != null && (
            <div className="">
              <ForecastChartTemp
                data={days}
                lastTimestamp={lastTimestamp}
                firstTimestamp={firstTimestamp}
                hours={forecastCtrl.forecastData.step.hours}
                offset6h={forecastCtrl.forecastData.offset6h}
                width={cols * 44}
              />
            </div>
          )}
          <Myhr />
          {forecastCtrl.forecastData.step.hours === 24 && (
            <MyRows2 data={days} />
          )}
          {forecastCtrl.forecastData.step.hours === 6 && (
            <MyRows2 data={forecast_6h} />
          )}
          {forecastCtrl.forecastData.step.hours === 1 && (
            <MyRows2 data={forecast_1h} />
          )}
          {firstTimestamp != null && lastTimestamp != null && (
            <div className="mb-3">
              <ForecastChart
                data={days}
                lastTimestamp={lastTimestamp}
                firstTimestamp={firstTimestamp}
                hours={forecastCtrl.forecastData.step.hours}
                offset6h={forecastCtrl.forecastData.offset6h}
                width={cols * 44}
              />
            </div>
          )}
        </div>
      </>
    );
  },
);

export default ForecastCharts;
