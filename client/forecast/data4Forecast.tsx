/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/style-prop-object */
/* eslint-disable camelcase */
import moment from "moment";
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { IForecastDay } from "./forecastData";

type Data4ForecastProps = {
  forecastDay: IForecastDay;
  days10r: boolean;
};

function Data4Forecast({ forecastDay, days10r }: Data4ForecastProps) {
  const [hourly, setHourly] = useState(false);

  let labelStyle = "text-primary";
  if (
    forecastDay.precipitation_amount_sum == null ||
    forecastDay.precipitation_amount_sum === 0
  ) {
    labelStyle = "text-warning";
    if (
      forecastDay.forecastRows.length > 0 &&
      forecastDay.cloud_area_fraction_sum / forecastDay.forecastRows.length > 50
    ) {
      labelStyle = "text-light";
    }
  }

  let textStyle = "h4";
  if (days10r) {
    textStyle = "small";
  }

  // console.info("render data4forecat");
  return (
    <div className="text-left">
      <Row>
        <Col xs={4}>
          <div
            className={`small ${labelStyle}`}
            onClick={() => setHourly(!hourly)}
            style={{ cursor: "pointer" }}
          >
            <span className={textStyle}>
              {moment(forecastDay.timestamp).format("ddd")}
            </span>
          </div>
        </Col>
        <Row>
          <Col xs={4}>
            <span className={textStyle}>
              {forecastDay.air_temperature_max == null
                ? ""
                : forecastDay.air_temperature_max.toFixed(0)}
            </span>
            <span className={textStyle}> / </span>
            <span className={textStyle}>
              {forecastDay.air_temperature_min == null
                ? ""
                : forecastDay.air_temperature_min.toFixed(0)}
            </span>
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <span className={textStyle}>
              {forecastDay.precipitation_amount_sum == null ||
              forecastDay.precipitation_amount_sum === 0
                ? ""
                : forecastDay.precipitation_amount_sum.toFixed(1)}
            </span>
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <span className={textStyle}>
              {forecastDay.wind_speed_max == null
                ? ""
                : (forecastDay.wind_speed_max * 3.6).toFixed(0)}
            </span>
          </Col>
        </Row>
      </Row>
      {hourly &&
        forecastDay.forecastRows.map((forecastRow) => (
          <Row key={forecastRow.timestamp.getTime()} className="small">
            <Col xs={2}>{forecastRow.timestamp.getHours()}</Col>
            <Col xs={2}>
              <img
                width="25px"
                height="25px"
                src={`svg/${
                  forecastRow.symbol_code_1h != null
                    ? forecastRow.symbol_code_1h
                    : forecastRow.symbol_code_6h
                }.svg`}
                alt={
                  forecastRow.symbol_code_1h != null
                    ? forecastRow.symbol_code_1h
                    : forecastRow.symbol_code_6h
                }
              />
            </Col>
            <Col xs={2}>
              {parseFloat(forecastRow.air_temperature).toFixed(0)}
            </Col>
            <Col xs={2}>
              {parseFloat(forecastRow.precipitation_amount) === 0
                ? ""
                : forecastRow.precipitation_amount}
            </Col>
            <Col xs={2}>
              {(parseFloat(forecastRow.wind_speed) * 3.6).toFixed(0)}
            </Col>
            <Col xs={2}>
              <svg width="25px" height="25px">
                <polygon
                  points="8 3, 12 21, 16 3"
                  fill="white"
                  stroke="white"
                  transform={`rotate(${forecastRow.wind_from_direction} 12 12)`}
                />
              </svg>
            </Col>
          </Row>
        ))}
    </div>
  );
}

export default Data4Forecast;
