/* eslint-disable camelcase */
import React, { useState } from "react";
import { Row, Col, DropdownButton, Dropdown } from "react-bootstrap";
import { observer } from "mobx-react";
import moment from "moment";
import ForecastChart from "./forecastChart";
import { IForecast1h, IForecast6h, IForecastDay } from "./forecastData";
import ForecastChartTemp from "./forecastChartTemp";

type Props = {
  days: Array<IForecastDay>;
  forecast_6h: Array<IForecast6h>;
  forecast_1h: Array<IForecast1h>;
};

const size = "34px";

const ForecastCharts = observer(({ days, forecast_6h, forecast_1h }: Props) => {
  const [hours, setHours] = useState(6);

  let filtered24h: Array<IForecastDay> = [];
  if (days.length > 0 && hours === 24) {
    filtered24h = days.filter((el, i) => i < 9);
  }

  let filtered6h: Array<IForecast6h> = [];
  if (forecast_6h.length > 0 && hours === 6) {
    filtered6h = forecast_6h
      .filter((el, i) => i % 6 === 0)
      .filter((el, i) => i < 9);
  }

  let filtered1h: Array<IForecast1h> = [];
  if (days.length > 0 && hours === 1) {
    filtered1h = forecast_1h.filter((el, i) => i < 9);
  }

  if (days.length > 0 && hours === 3) {
    filtered1h = forecast_1h
      .filter((el, i) => i % 3 === 0)
      .filter((el, i) => i < 9);
  }

  let lastTimestamp = null;
  if (filtered6h.length > 0 && hours === 6) {
    lastTimestamp = new Date(filtered6h[filtered6h.length - 1].timestamp);
    lastTimestamp.setHours(lastTimestamp.getHours() + 6);
  }

  if (filtered1h.length > 0 && (hours === 1 || hours === 3)) {
    lastTimestamp = new Date(filtered1h[filtered1h.length - 1].timestamp);
    lastTimestamp.setHours(lastTimestamp.getHours() + hours);
  }

  if (filtered24h.length > 0 && hours === 24) {
    lastTimestamp = new Date(filtered24h[filtered24h.length - 1].timestamp);
    lastTimestamp.setHours(lastTimestamp.getHours() + hours);
  }

  console.info(lastTimestamp);

  return (
    <>
      <DropdownButton
        id="dropdown-hours-button"
        title={`${hours} hours`}
        onSelect={(e) => {
          setHours(parseInt(e, 10));
        }}
      >
        <Dropdown.Item eventKey="1">1 hour</Dropdown.Item>
        <Dropdown.Item eventKey="3">3 hours</Dropdown.Item>
        <Dropdown.Item eventKey="6">6 hours</Dropdown.Item>
        <Dropdown.Item eventKey="24">24 hours</Dropdown.Item>
      </DropdownButton>

      <div className="mb-2" />
      {hours === 24 && (
        <>
          <Row className="ms-0 me-0">
            {filtered24h.map((item: IForecastDay) => (
              <Col
                className="text-center small ps-0 pe-0 border-end border-secondary"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div>{moment(item.timestamp).format("ddd")}</div>
              </Col>
            ))}
          </Row>
          <Row className="ms-0 me-0">
            {filtered24h.map((item: IForecastDay) => (
              <Col
                className="text-center small ps-0 pe-0 border-end border-secondary"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div>{moment(item.timestamp).format("HH")}</div>
              </Col>
            ))}
          </Row>
          <Row className="ms-0 me-0">
            {filtered24h.map((item: IForecastDay) => (
              <Col
                className="text-center ps-0 pe-0 border-end border-secondary"
                style={{ display: "flex", justifyContent: "center" }}
              >
                {item.symbol_code_day != null && (
                  <img
                    width={size}
                    height={size}
                    src={`svg/${item.symbol_code_day}.svg`} // TODO
                    alt={item.symbol_code_day}
                  />
                )}
              </Col>
            ))}
          </Row>
          <Row className="ms-0 me-0">
            {filtered24h.map((item: IForecastDay) => (
              <Col
                className="text-center small ps-0 pe-0 border-end border-secondary"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div>
                  {item.air_temperature_max?.toFixed(0)}/
                  {item.air_temperature_min?.toFixed(0)}
                </div>
              </Col>
            ))}
          </Row>
          <Row className="ms-0 me-0">
            {filtered24h.map((item: IForecastDay) => (
              <Col
                className="text-center small ps-0 pe-0 border-end border-secondary"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div>
                  {item.precipitation_amount_sum === 0
                    ? "-"
                    : item.precipitation_amount_sum.toFixed(1)}
                </div>
              </Col>
            ))}
          </Row>
        </>
      )}
      {hours === 6 && (
        <>
          <Row className="ms-0 me-0">
            {filtered6h.map((item: IForecast6h) => (
              <Col
                className="text-center small ps-0 pe-0 border-end border-secondary"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div>{moment(item.timestamp).format("ddd")}</div>
              </Col>
            ))}
          </Row>
          <Row className="ms-0 me-0">
            {filtered6h.map((item: IForecast6h) => (
              <Col
                className="text-center small ps-0 pe-0 border-end border-secondary"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div>{moment(item.timestamp).format("HH")}</div>
              </Col>
            ))}
          </Row>
          <Row className="ms-0 me-0">
            {filtered6h.map((item) => (
              <Col
                className="text-center ps-0 pe-0 border-end border-secondary"
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
          <Row className="ms-0 me-0">
            {filtered6h.map((item: IForecast6h) => (
              <Col
                className="text-center small ps-0 pe-0 border-end border-secondary"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div>
                  {item.air_temperature_max?.toFixed(0)}/
                  {item.air_temperature_min?.toFixed(0)}
                </div>
              </Col>
            ))}
          </Row>
          <Row className="ms-0 me-0">
            {filtered6h.map((item: IForecast6h) => (
              <Col
                className="text-center small ps-0 pe-0 border-end border-secondary"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div>
                  {item.precipitation_amount === 0
                    ? "-"
                    : item.precipitation_amount.toFixed(1)}
                </div>
              </Col>
            ))}
          </Row>
        </>
      )}
      {(hours === 1 || hours === 3) && (
        <>
          <Row className="ms-0 me-0">
            {filtered1h.map((item: IForecast1h) => (
              <Col
                className="text-center small ps-0 pe-0 border-end border-secondary"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div>{moment(item.timestamp).format("ddd")}</div>
              </Col>
            ))}
          </Row>
          <Row className="ms-0 me-0">
            {filtered1h.map((item: IForecast1h) => (
              <Col
                className="text-center small ps-0 pe-0 border-end border-secondary"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div>{moment(item.timestamp).format("HH")}</div>
              </Col>
            ))}
          </Row>
          <Row className="ms-0 me-0">
            {filtered1h.map((item: IForecast1h) => (
              <Col
                className="text-center ps-0 pe-0 border-end border-secondary"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <img
                  width={size}
                  height={size}
                  src={`svg/${item.symbol_code_1h}.svg`}
                  alt={item.symbol_code_1h}
                />
              </Col>
            ))}
          </Row>
          <Row className="ms-0 me-0">
            {filtered1h.map((item: IForecast1h) => (
              <Col
                className="text-center small ps-0 pe-0 border-end border-secondary"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div>{item.air_temperature.toFixed(1)}</div>
              </Col>
            ))}
          </Row>
          <Row className="ms-0 me-0">
            {filtered1h.map((item: IForecast1h) => (
              <Col
                className="text-center small ps-0 pe-0 border-end border-secondary"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div>
                  {item.precipitation_amount === 0
                    ? "-"
                    : item.precipitation_amount.toFixed(1)}
                </div>
              </Col>
            ))}
          </Row>
        </>
      )}
      <Row className="mb-0">
        <ForecastChartTemp
          data={days}
          lastTimestamp={lastTimestamp}
          hours={hours}
        />
      </Row>
      <Row className="mb-3">
        <ForecastChart
          data={days}
          lastTimestamp={lastTimestamp}
          hours={hours}
        />
      </Row>
    </>
  );
});

export default ForecastCharts;
