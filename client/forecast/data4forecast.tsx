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
};

const Data4Forecast = function ({
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
}: DataProps) {
  const [hourly, setHourly] = useState(false);

  const windDirText = function (dir: number) {
    if (dir >= 360 - 22.5 || dir < 0 + 22.5) {
      return "N";
    }
    if (dir >= 45 - 22.5 && dir < 45 + 22.5) {
      return "NE";
    }
    if (dir >= 90 - 22.5 && dir < 90 + 22.5) {
      return "E";
    }
    if (dir >= 135 - 22.5 && dir < 135 + 22.5) {
      return "SE";
    }
    if (dir >= 180 - 22.5 && dir < 180 + 22.5) {
      return "S";
    }
    if (dir >= 225 - 22.5 && dir < 225 + 22.5) {
      return "SW";
    }
    if (dir >= 270 - 22.5 && dir < 270 + 22.5) {
      return "W";
    }
    if (dir >= 315 - 22.5 && dir < 315 + 22.5) {
      return "NW";
    }
    return "";
  };

  // console.info("render data4forecat");
  return (
    <div className="text-left">
      <Row>
        <Col xs={6}>
          <div className="small text-warning font-weight-bold">{label}</div>
        </Col>
        <Col xs={6}>
          <Form>
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Hourly"
              checked={hourly}
              onChange={(e) => {
                setHourly(e.target.checked);
              }}
            />
          </Form>
        </Col>
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
            {precipitationSum == null || precipitationSum === 0 ? "" : "mm"}{" "}
          </span>
        </Col>
        <Col xs={4}>
          <span className="h4 mr-1">
            {windSpeedMax == null ? "" : (windSpeedMax * 3.6).toFixed(0)}
          </span>
          <span className="small">km/h </span>
        </Col>
      </Row>
      <Row>
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
          <Row>
            <Col xs={2}>{forecastRow.timestamp.getHours()}</Col>
            <Col xs={2}>
              <img
                width="25px"
                height="25px"
                src={`svg/${forecastRow.symbol_code_1h}.svg`}
                alt={forecastRow.symbol_code_1h}
              />
            </Col>
            <Col xs={2}>
              {parseFloat(forecastRow.air_temperature).toFixed(0)}
            </Col>
            <Col xs={2}>{forecastRow.precipitation_amount}</Col>
            <Col xs={2}>
              {(parseFloat(forecastRow.wind_speed) * 3.6).toFixed(0)}
            </Col>
            <Col xs={2}>
              {windDirText(parseFloat(forecastRow.wind_from_direction))}
            </Col>
          </Row>
        ))}
    </div>
  );
};

export default Data4Forecast;
