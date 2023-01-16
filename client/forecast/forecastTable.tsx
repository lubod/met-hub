import React from "react";
import { Row, Col } from "react-bootstrap";
import { observer } from "mobx-react";
import moment from "moment";
import { IForecastDay } from "./forecastData";

type Props = {
  days: Array<IForecastDay>;
  days10r: boolean;
};

const ForecastTable = observer(({ days, days10r }: Props) => {
  const labelStyle = "text-secondary";
  const textStyle = "h4";

  return (
    <>
      <Row className="py-2">
        {days.map((forecastDay) => (
          <Col xs={4}>
            <div
              className={`small ${labelStyle}`}
              // onClick={() => setHourly(!hourly)}
              style={{ cursor: "pointer" }}
            >
              <span className={textStyle}>
                {moment(forecastDay.timestamp).format("ddd")}
              </span>
            </div>
          </Col>
        ))}
      </Row>
      <Row className="py-2">
        {days.map((forecastDay) => (
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
            <span className="small">°C</span>
          </Col>
        ))}
      </Row>
      <Row className="py-2">
        {days.map((forecastDay) => (
          <Col xs={4}>
            <span className={textStyle}>
              {forecastDay.precipitation_amount_sum == null ||
              forecastDay.precipitation_amount_sum === 0
                ? "-"
                : forecastDay.precipitation_amount_sum.toFixed(1)}
            </span>
            <span className="small">
              {forecastDay.precipitation_amount_sum == null ||
              forecastDay.precipitation_amount_sum === 0
                ? ""
                : "mm"}
            </span>
          </Col>
        ))}
      </Row>
      <Row className="py-2">
        {days.map((forecastDay) => (
          <Col xs={4}>
            <span className={textStyle}>
              {forecastDay.wind_speed_max == null
                ? ""
                : (forecastDay.wind_speed_max * 3.6).toFixed(0)}
            </span>
            <span className="small">km</span>
          </Col>
        ))}
      </Row>

      {days10r && <div className="mb-4" />}
    </>
  );
});

export default ForecastTable;
