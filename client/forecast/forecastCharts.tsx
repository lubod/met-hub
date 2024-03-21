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

type CellProps = {
  value: string;
  color: string;
  maxLimit1: number;
  maxLimit2: number;
  maxLimit3: number;
};

function Cell({ value, color, maxLimit1, maxLimit2, maxLimit3 }: CellProps) {
  let bg = "";
  if (maxLimit1 != null && parseFloat(value) > maxLimit1) {
    bg = `bg-${color} bg-opacity-10`;
  }
  if (maxLimit2 != null && parseFloat(value) > maxLimit2) {
    bg = `bg-${color} bg-opacity-25`;
  }
  if (maxLimit3 != null && parseFloat(value) > maxLimit3) {
    bg = `bg-${color} bg-opacity-50`;
  }

  return (
    <div
      className={`text-center text-light border-s border-${color} ${bg} basis-full text-sm pb-3 min-w-11`}
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
    <div className="flex flex-col">
      <div className="flex flex-row">
        {data.map((item: IGetForecastDataToDisplay) => (
          <Cell
            key={item.getDay() + item.getDay2()}
            value={item.getDay()}
            color="gray2"
            maxLimit1={null}
            maxLimit2={null}
            maxLimit3={null}
          />
        ))}
      </div>
      <div className="flex flex-row">
        {data.map((item: IGetForecastDataToDisplay) => (
          <Cell
            key={item.getDay() + item.getDay2()}
            value={item.getDay2()}
            color="gray2"
            maxLimit1={null}
            maxLimit2={null}
            maxLimit3={null}
          />
        ))}
      </div>
      <div className="flex flex-row">
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
      <div className="flex flex-row">
        {data.map((item: IGetForecastDataToDisplay) => (
          <Cell
            key={item.getDay() + item.getDay2()}
            value={item.getAirTemperatureMax()}
            color="orange"
            maxLimit1={24}
            maxLimit2={29}
            maxLimit3={34}
          />
        ))}
      </div>
      <div className="flex flex-row">
        {data.map((item: IGetForecastDataToDisplay) => (
          <Cell
            key={item.getDay() + item.getDay2()}
            value={item.getAirTemperatureMin()}
            color="orange"
            maxLimit1={18}
            maxLimit2={21}
            maxLimit3={24}
          />
        ))}
      </div>
    </div>
  );
}

function MyRows2({ data }: RowsProps) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
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
      <div className="flex flex-row">
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
      <div className="flex flex-row">
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
      <div className="flex flex-row">
        {data.map((item: IGetForecastDataToDisplay) => (
          <div
            className="text-center border-s border-purple flex justify-center basis-full min-w-11"
            key={item.getDay() + item.getDay2()}
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
        ))}
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
    switch (forecastCtrl.forecastData.step.hours) {
      case 1:
        cols = forecast_1h.length;
        break;
      case 6:
        cols = forecast_6h.length;
        break;
      default:
        cols = days.length;
    }

    if (forecast_6h.length > 0 && forecastCtrl.forecastData.step.hours === 6) {
      lastTimestamp = new Date(forecast_6h[forecast_6h.length - 1].timestamp);
      firstTimestamp = forecast_6h[0].timestamp;
    }

    if (forecast_1h.length > 0 && forecastCtrl.forecastData.step.hours === 1) {
      lastTimestamp = new Date(forecast_1h[forecast_1h.length - 1].timestamp);
      firstTimestamp = forecast_1h[0].timestamp;
    }

    if (days.length > 0 && forecastCtrl.forecastData.step.hours === 24) {
      lastTimestamp = new Date(days[days.length - 1].timestamp);
      firstTimestamp = days[0].timestamp;
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
        </div>
      </>
    );
  },
);

export default ForecastCharts;
