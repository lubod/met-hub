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

  // console.info("render data4forecat");
  return (
    <div className="text-left">
      <Row>
        <Col xs={3}>
          <div
            className={`small ${labelStyle}`}
            onClick={() => setHourly(!hourly)}
            style={{ cursor: "pointer" }}
          >
            {moment(forecastDay.timestamp).format("ddd")}
          </div>
        </Col>
        <Col xs={3}>
          <span className="h4 mr-1">
            {forecastDay.air_temperature_max == null
              ? ""
              : forecastDay.air_temperature_max.toFixed(0)}
          </span>
          <span className="small"> / </span>
          <span className="h4 mr-1">
            {forecastDay.air_temperature_min == null
              ? ""
              : forecastDay.air_temperature_min.toFixed(0)}
          </span>
        </Col>
        <Col xs={3}>
          <span className="h4 mr-1">
            {forecastDay.precipitation_amount_sum == null ||
            forecastDay.precipitation_amount_sum === 0
              ? ""
              : forecastDay.precipitation_amount_sum.toFixed(1)}
          </span>
        </Col>
        <Col xs={3}>
          <span className="h4 mr-1">
            {forecastDay.wind_speed_max == null
              ? ""
              : (forecastDay.wind_speed_max * 3.6).toFixed(0)}
          </span>
        </Col>
      </Row>
      <Row className="mb-2">
        <Col xs={3}>
          {forecastDay.symbol_code_00 &&
            hourly === false &&
            days10r === false && (
              <img
                width="40px"
                height="40px"
                src={`svg/${forecastDay.symbol_code_00}.svg`}
                alt={forecastDay.symbol_code_00}
              />
            )}
        </Col>
        <Col xs={3}>
          {forecastDay.symbol_code_06 &&
            hourly === false &&
            days10r === false && (
              <img
                width="40px"
                height="40px"
                src={`svg/${forecastDay.symbol_code_06}.svg`}
                alt={forecastDay.symbol_code_06}
              />
            )}
        </Col>
        <Col xs={3}>
          {forecastDay.symbol_code_12 &&
            hourly === false &&
            days10r === false && (
              <img
                width="40px"
                height="40px"
                src={`svg/${forecastDay.symbol_code_12}.svg`}
                alt={forecastDay.symbol_code_12}
              />
            )}
        </Col>
        <Col xs={3}>
          {forecastDay.symbol_code_18 &&
            hourly === false &&
            days10r === false && (
              <img
                width="40px"
                height="40px"
                src={`svg/${forecastDay.symbol_code_18}.svg`}
                alt={forecastDay.symbol_code_18}
              />
            )}
        </Col>
      </Row>
      {hourly &&
        forecastDay.forecastRows.map((forecastRow) => (
          <Row key={forecastRow.timestamp.getTime()}>
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
