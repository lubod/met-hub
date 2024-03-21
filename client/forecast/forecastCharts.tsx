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
      className={`text-center text-light border-s border-${color} ${bg} basis-full text-sm pb-3`}
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
            className="text-center border-s border-gray2 flex justify-center basis-full"
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
            className="text-center border-s border-purple flex justify-center basis-full"
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
    let filtered1h: Array<Forecast1h> = [];
    let filtered6h: Array<Forecast6h> = [];
    let filtered24h: Array<ForecastDay> = [];
    let lastTimestamp = null;
    let firstTimestamp = null;
    const cols = 8;

    function changeOffset(direction: number) {
      if (forecastCtrl.forecastData.step.hours === 1) {
        if (
          forecastCtrl.forecastData.offset1h + direction >= 0 &&
          forecastCtrl.forecastData.offset1h + direction <=
            forecast_1h.length - cols
        ) {
          forecastCtrl.forecastData.setOffset1h(
            forecastCtrl.forecastData.offset1h + direction,
          );
        } else if (forecastCtrl.forecastData.offset1h + direction < 0) {
          forecastCtrl.forecastData.setOffset1h(0);
        } else if (
          forecastCtrl.forecastData.offset1h + direction >
          forecast_1h.length - cols
        ) {
          forecastCtrl.forecastData.setOffset1h(forecast_1h.length - cols);
        }
      } else if (forecastCtrl.forecastData.step.hours === 6) {
        if (
          forecastCtrl.forecastData.offset6h + direction >= 0 &&
          forecastCtrl.forecastData.offset6h + direction <=
            forecast_6h.length - cols
        ) {
          forecastCtrl.forecastData.setOffset6h(
            forecastCtrl.forecastData.offset6h + direction,
          );
        } else if (forecastCtrl.forecastData.offset6h + direction < 0) {
          forecastCtrl.forecastData.setOffset6h(0);
        } else if (
          forecastCtrl.forecastData.offset6h + direction >
          forecast_6h.length - cols
        ) {
          forecastCtrl.forecastData.setOffset6h(forecast_6h.length - cols);
        }
      }
    }

    if (days.length > 0 && forecastCtrl.forecastData.step.hours === 24) {
      filtered24h = days.filter((el, i) => i < cols);
    }

    if (forecast_6h.length > 0 && forecastCtrl.forecastData.step.hours === 6) {
      filtered6h = forecast_6h
        .filter((el, i) => i >= forecastCtrl.forecastData.offset6h)
        .filter((el, i) => i < cols);
    }

    if (days.length > 0 && forecastCtrl.forecastData.step.hours === 1) {
      filtered1h = forecast_1h
        .filter((el, i) => i >= forecastCtrl.forecastData.offset1h)
        .filter((el, i) => i < cols);
    }

    if (filtered6h.length > 0 && forecastCtrl.forecastData.step.hours === 6) {
      lastTimestamp = new Date(filtered6h[filtered6h.length - 1].timestamp);
      lastTimestamp.setHours(lastTimestamp.getHours() + 6);
      firstTimestamp = filtered6h[0].timestamp;
    }

    if (filtered1h.length > 0 && forecastCtrl.forecastData.step.hours === 1) {
      lastTimestamp = new Date(filtered1h[filtered1h.length - 1].timestamp);
      lastTimestamp.setHours(
        lastTimestamp.getHours() + forecastCtrl.forecastData.step.hours,
      );
      firstTimestamp = filtered1h[0].timestamp;
    }

    if (filtered24h.length > 0 && forecastCtrl.forecastData.step.hours === 24) {
      lastTimestamp = new Date(filtered24h[filtered24h.length - 1].timestamp);
      lastTimestamp.setHours(
        lastTimestamp.getHours() + forecastCtrl.forecastData.step.hours,
      );
      firstTimestamp = filtered24h[0].timestamp;
    }

    console.info(
      firstTimestamp,
      lastTimestamp,
      forecastCtrl.forecastData.offset1h,
    );

    return (
      <>
        <div className="mb-4 flex flex-row justify-between">
          <div>
            {(forecastCtrl.forecastData.step.hours === 1 ||
              forecastCtrl.forecastData.step.hours === 6) && (
              <button
                className="bg-gray2 text-light py-1.5 px-3 rounded-md hover:bg-gray3"
                type="button"
                onClick={() => changeOffset(-cols)}
              >
                Prev
              </button>
            )}
          </div>
          <ForecastStepsList forecastCtrl={forecastCtrl} />
          <div>
            {(forecastCtrl.forecastData.step.hours === 1 ||
              forecastCtrl.forecastData.step.hours === 6) && (
              <button
                className="bg-gray2 text-light rounded-md hover:bg-gray3 py-1.5 px-3"
                type="button"
                onClick={() => changeOffset(cols)}
              >
                Next
              </button>
            )}
          </div>
        </div>
        <div>
          {forecastCtrl.forecastData.step.hours === 24 && (
            <MyRows1 data={filtered24h} />
          )}
          {forecastCtrl.forecastData.step.hours === 6 && (
            <MyRows1 data={filtered6h} />
          )}
          {forecastCtrl.forecastData.step.hours === 1 && (
            <MyRows1 data={filtered1h} />
          )}
          <div className="mb-0">
            <ForecastChartTemp
              data={days}
              lastTimestamp={lastTimestamp}
              firstTimestamp={firstTimestamp}
              hours={forecastCtrl.forecastData.step.hours}
              offset6h={forecastCtrl.forecastData.offset6h}
            />
          </div>
          <Myhr />
          {forecastCtrl.forecastData.step.hours === 24 && (
            <MyRows2 data={filtered24h} />
          )}
          {forecastCtrl.forecastData.step.hours === 6 && (
            <MyRows2 data={filtered6h} />
          )}
          {forecastCtrl.forecastData.step.hours === 1 && (
            <MyRows2 data={filtered1h} />
          )}
          <div className="mb-3">
            <ForecastChart
              data={days}
              lastTimestamp={lastTimestamp}
              firstTimestamp={firstTimestamp}
              hours={forecastCtrl.forecastData.step.hours}
              offset6h={forecastCtrl.forecastData.offset6h}
            />
          </div>
        </div>
      </>
    );
  },
);

export default ForecastCharts;
