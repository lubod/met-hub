/* eslint-disable camelcase */
import React from "react";
import { Row, Col } from "react-bootstrap";
import { observer } from "mobx-react";
import moment from "moment";
import ForecastChart from "./forecastChart";
import { IForecast6h, IForecastDay } from "./forecastData";
import ForecastChartTemp from "./forecastChartTemp";

type Props = {
  days: Array<IForecastDay>;
  forecast_6h: Array<IForecast6h>;
  days10r: boolean;
};

const size = "34px";

const ForecastCharts = observer(({ days, days10r, forecast_6h }: Props) => {
  const filtered = forecast_6h
    .filter((el, i) => i % 6 === 0)
    .filter((el, i) => i < 9);
  let lastTimestamp = null;
  if (filtered.length > 0) {
    lastTimestamp = new Date(filtered[filtered.length - 1].timestamp);
    lastTimestamp.setHours(lastTimestamp.getHours() + 6);
    console.info(lastTimestamp);
  }

  return (
    <>
      <Row className="ms-0 me-0">
        {filtered.map((item: IForecast6h) => (
          <Col
            className="text-center small ps-0 pe-0"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div>
              {moment(item.timestamp).format("ddd")}
            </div>
          </Col>
        ))}
      </Row>
      <Row className="ms-0 me-0">
        {filtered.map((item: IForecast6h) => (
          <Col
            className="text-center small ps-0 pe-0"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div>{moment(item.timestamp).format("HH")}</div>
          </Col>
        ))}
      </Row>
      <Row className="ms-0 me-0">
        {filtered.map((item) => (
          <Col
            className="text-center ps-0 pe-0"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <img
              width={size}
              height={size}
              src={`svg/${item.symbol_code_6h}.svg`}
              alt={item.symbol_code_6h}
            />
          </Col>
        ))}
      </Row>
      <Row className="mb-0">
        {days10r === false && (
          <ForecastChartTemp data={days} lastTimestamp={lastTimestamp} />
        )}
        {days10r === true && (
          <ForecastChartTemp data={days} lastTimestamp={lastTimestamp} />
        )}
      </Row>
      <Row className="ms-0 me-0">
        {filtered.map((item: IForecast6h) => (
          <Col
            className="text-center small ps-0 pe-0"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div>
              {item.air_temperature_max?.toFixed(0)}/
              {item.air_temperature_min?.toFixed(0)}
            </div>
          </Col>
        ))}
      </Row>
      <Row className="mb-3">
        {days10r === false && (
          <ForecastChart data={days} lastTimestamp={lastTimestamp} />
        )}
        {days10r === true && (
          <ForecastChart data={days} lastTimestamp={lastTimestamp} />
        )}
      </Row>
      <Row className="ms-0 me-0">
        {filtered.map((item: IForecast6h) => (
          <Col
            className="text-center small ps-0 pe-0"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div>{item.precipitation_amount}</div>
          </Col>
        ))}
      </Row>
    </>
  );
});

export default ForecastCharts;
