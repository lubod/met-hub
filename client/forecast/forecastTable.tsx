/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import { Row, Col } from "react-bootstrap";
import { observer } from "mobx-react";
import moment from "moment";
import { IForecastDay } from "./forecastData";
import ForecastCtrl from "./forecastCtrl";

type Props = {
  days: Array<IForecastDay>;
  forecastCtrl: ForecastCtrl;
};

const ForecastTable = observer(({ days, forecastCtrl }: Props) => {
  const labelStyle = "text-secondary";
  const textStyle = "h4";
  const size = "50px";

  function calculateOffset(index: number) {
    if (index === 1) {
      return days[0].forecastRows.length;
    }
    if (index === 2) {
      return days[0].forecastRows.length + days[1].forecastRows.length;
    }
    return 0;
  }

  function calculateSubOffset12(index: number) {
    if (index === 0) {
      const subOffset = 12 - (24 - days[0].forecastRows.length);
      return subOffset > 0 ? subOffset : 0;
    }
    return 12;
  }

  return (
    <>
      <Row className="py-2">
        {days.map((forecastDay, index) => (
          <Col xs={4}>
            <div
              className={`small ${labelStyle}`}
              onClick={() =>
                forecastCtrl.forecastData.setOffset(calculateOffset(index))
              }
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
        {days.map((forecastDay, index) => (
          <Col xs={4}>
            <span
              className="text-center"
              style={{ display: "flex", justifyContent: "center" }}
            >
              {forecastDay.symbol_code_day != null && (
                <img
                  width={size}
                  height={size}
                  src={`svg/${forecastDay.symbol_code_day}.svg`} // TODO
                  alt={forecastDay.symbol_code_day}
                  onClick={() =>
                    forecastCtrl.forecastData.setOffset(
                      calculateOffset(index) + calculateSubOffset12(index)
                    )
                  }
                  style={{ cursor: "pointer" }}
                />
              )}
              {forecastDay.symbol_code_day == null && <>-</>}
            </span>
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
    </>
  );
});

export default ForecastTable;