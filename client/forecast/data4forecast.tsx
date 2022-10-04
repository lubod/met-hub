/* eslint-disable react/style-prop-object */
/* eslint-disable camelcase */
import React, { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { IForecastRow } from "./forecastData";

type DataProps = {
  label: string;
  temperatureMin: number;
  temperatureMax: number;
  precipitationSum: number;
  windSpeedMax: number;
  symbol_code_00: string;
  symbol_code_06: string;
  symbol_code_12: string;
  symbol_code_18: string;
  forecastRows: IForecastRow[];
  cloudAreaFractionSum: number;
};

function Data4Forecast ({
  label,
  temperatureMax,
  temperatureMin,
  precipitationSum,
  windSpeedMax,
  symbol_code_00,
  symbol_code_06,
  symbol_code_12,
  symbol_code_18,
  forecastRows,
  cloudAreaFractionSum,
}: DataProps) {
  const [hourly, setHourly] = useState(false);

  let labelStyle = "text-primary";
  if (precipitationSum == null || precipitationSum === 0) {
    labelStyle = "text-warning";
    if (
      forecastRows.length > 0 &&
      cloudAreaFractionSum / forecastRows.length > 50
    ) {
      labelStyle = "text-light";
    }
  }

  // console.info("render data4forecat");
  return (
    <div className="text-left">
      <Row className="mb-2">
        <Col xs={6}>
          <div className={`small ${labelStyle} font-weight-bold`}>{label}</div>
        </Col>
        <Col xs={1} />
        <Col xs={4}>
          <Form>
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Hourly"
              checked={hourly}
              onChange={(e) => {
                setHourly(e.target.checked);
              }}
              className={`small ${labelStyle}`}
            />
          </Form>
        </Col>
        <Col xs={1} />
      </Row>
      <Row>
        <Col xs={4}>
          <span className="h4 mr-1">
            {temperatureMax == null ? "" : temperatureMax.toFixed(0)}
          </span>
          <span className="small"> / </span>
          <span className="h4 mr-1">
            {temperatureMin == null ? "" : temperatureMin.toFixed(0)}
          </span>
          <span className="small">°C </span>
        </Col>
        <Col xs={4}>
          <span className="h4 mr-1">
            {precipitationSum == null || precipitationSum === 0
              ? ""
              : precipitationSum.toFixed(1)}
          </span>
          <span className="small">
            {precipitationSum == null || precipitationSum === 0 ? "" : "mm"}
          </span>
        </Col>
        <Col xs={4}>
          <span className="h4 mr-1">
            {windSpeedMax == null ? "" : (windSpeedMax * 3.6).toFixed(0)}
          </span>
          <span className="small">km/h </span>
        </Col>
      </Row>
      <Row className="mb-2">
        <Col xs={3}>
          {symbol_code_00 && hourly === false && (
            <img
              width="40px"
              height="40px"
              src={`svg/${symbol_code_00}.svg`}
              alt={symbol_code_00}
            />
          )}
        </Col>
        <Col xs={3}>
          {symbol_code_06 && hourly === false && (
            <img
              width="40px"
              height="40px"
              src={`svg/${symbol_code_06}.svg`}
              alt={symbol_code_06}
            />
          )}
        </Col>
        <Col xs={3}>
          {symbol_code_12 && hourly === false && (
            <img
              width="40px"
              height="40px"
              src={`svg/${symbol_code_12}.svg`}
              alt={symbol_code_12}
            />
          )}
        </Col>
        <Col xs={3}>
          {symbol_code_18 && hourly === false && (
            <img
              width="40px"
              height="40px"
              src={`svg/${symbol_code_18}.svg`}
              alt={symbol_code_18}
            />
          )}
        </Col>
      </Row>
      {hourly &&
        forecastRows.map((forecastRow) => (
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
};

export default Data4Forecast;
