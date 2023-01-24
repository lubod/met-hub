/* eslint-disable camelcase */
import React from "react";
import { Row, Col, DropdownButton, Dropdown, Button } from "react-bootstrap";
import { observer } from "mobx-react";
import moment from "moment";
import styled from "styled-components";
import ForecastChart from "./forecastChart";
import { IForecast1h, IForecast6h, IForecastDay } from "./forecastData";
import ForecastChartTemp from "./forecastChartTemp";
import ForecastCtrl from "./forecastCtrl";

const ScrollDiv = styled.div`
  // display: flex;
  // flex-wrap: nowrap;
  // overflow-x: auto;
`;

const MyRow = styled(Row)`
  // flex: 0 0 auto;
`;

type Props = {
  days: Array<IForecastDay>;
  forecast_6h: Array<IForecast6h>;
  forecast_1h: Array<IForecast1h>;
  forecastCtrl: ForecastCtrl;
};

const ForecastCharts = observer(
  ({ days, forecast_6h, forecast_1h, forecastCtrl }: Props) => {
    const size = "34px";

    let filtered1h: Array<IForecast1h> = [];
    let filtered6h: Array<IForecast6h> = [];
    let filtered24h: Array<IForecastDay> = [];
    let lastTimestamp = null;
    let firstTimestamp = null;

    function changeOffset(direction: number) {
      if (forecastCtrl.forecastData.hours === 1) {
        if (
          forecastCtrl.forecastData.offset1h + direction >= 0 &&
          forecastCtrl.forecastData.offset1h + direction <=
            forecast_1h.length - 9
        ) {
          forecastCtrl.forecastData.setOffset1h(
            forecastCtrl.forecastData.offset1h + direction
          );
        } else if (forecastCtrl.forecastData.offset1h + direction < 0) {
          forecastCtrl.forecastData.setOffset1h(0);
        } else if (
          forecastCtrl.forecastData.offset1h + direction >
          forecast_1h.length - 9
        ) {
          forecastCtrl.forecastData.setOffset1h(forecast_1h.length - 9);
        }
      } else if (forecastCtrl.forecastData.hours === 6) {
        if (
          forecastCtrl.forecastData.offset6h + direction >= 0 &&
          forecastCtrl.forecastData.offset6h + direction <=
            forecast_6h.length - 9
        ) {
          forecastCtrl.forecastData.setOffset6h(
            forecastCtrl.forecastData.offset6h + direction
          );
        } else if (forecastCtrl.forecastData.offset6h + direction < 0) {
          forecastCtrl.forecastData.setOffset6h(0);
        } else if (
          forecastCtrl.forecastData.offset6h + direction >
          forecast_6h.length - 9
        ) {
          forecastCtrl.forecastData.setOffset6h(forecast_6h.length - 9);
        }
      }
    }

    if (days.length > 0 && forecastCtrl.forecastData.hours === 24) {
      filtered24h = days.filter((el, i) => i < 9);
    }

    if (forecast_6h.length > 0 && forecastCtrl.forecastData.hours === 6) {
      filtered6h = forecast_6h
        .filter((el, i) => i >= forecastCtrl.forecastData.offset6h)
        .filter((el, i) => i < 9);
    }

    if (days.length > 0 && forecastCtrl.forecastData.hours === 1) {
      filtered1h = forecast_1h
        .filter((el, i) => i >= forecastCtrl.forecastData.offset1h)
        .filter((el, i) => i < 9);
    }

    if (filtered6h.length > 0 && forecastCtrl.forecastData.hours === 6) {
      lastTimestamp = new Date(filtered6h[filtered6h.length - 1].timestamp);
      lastTimestamp.setHours(lastTimestamp.getHours() + 6);
      firstTimestamp = filtered6h[0].timestamp;
    }

    if (filtered1h.length > 0 && forecastCtrl.forecastData.hours === 1) {
      lastTimestamp = new Date(filtered1h[filtered1h.length - 1].timestamp);
      lastTimestamp.setHours(
        lastTimestamp.getHours() + forecastCtrl.forecastData.hours
      );
      firstTimestamp = filtered1h[0].timestamp;
    }

    if (filtered24h.length > 0 && forecastCtrl.forecastData.hours === 24) {
      lastTimestamp = new Date(filtered24h[filtered24h.length - 1].timestamp);
      lastTimestamp.setHours(
        lastTimestamp.getHours() + forecastCtrl.forecastData.hours
      );
      firstTimestamp = filtered24h[0].timestamp;
    }

    console.info(
      firstTimestamp,
      lastTimestamp,
      forecastCtrl.forecastData.offset1h
    );

    return (
      <>
        <Row className="mb-3">
          <Col xs={4}>
            {(forecastCtrl.forecastData.hours === 1 ||
              forecastCtrl.forecastData.hours === 6) && (
              <Button variant="secondary" onClick={() => changeOffset(-9)}>
                Prev
              </Button>
            )}
          </Col>
          <Col xs={4}>
            <DropdownButton
              id="dropdown-hours-button"
              title={`${forecastCtrl.forecastData.hours} hours`}
              onSelect={(e) => {
                forecastCtrl.forecastData.setHours(parseInt(e, 10));
              }}
            >
              <Dropdown.Item eventKey="1">1 hour</Dropdown.Item>
              <Dropdown.Item eventKey="6">6 hours</Dropdown.Item>
              <Dropdown.Item eventKey="24">24 hours</Dropdown.Item>
            </DropdownButton>
          </Col>
          <Col xs={4}>
            {(forecastCtrl.forecastData.hours === 1 ||
              forecastCtrl.forecastData.hours === 6) && (
              <Button variant="secondary" onClick={() => changeOffset(9)}>
                Next
              </Button>
            )}
          </Col>
        </Row>
        <ScrollDiv>
          {forecastCtrl.forecastData.hours === 24 && (
            <>
              <Row className="ms-0 me-0">
                {filtered24h.map((item: IForecastDay) => (
                  <Col
                    className="text-center small ps-0 pe-0 border-start border-secondary"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <div>{moment(item.timestamp).format("ddd")}</div>
                  </Col>
                ))}
              </Row>
              <Row className="ms-0 me-0">
                {filtered24h.map((item: IForecastDay) => (
                  <Col
                    className="text-center small ps-0 pe-0 border-start border-secondary"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <div>{moment(item.timestamp).format("HH")}</div>
                  </Col>
                ))}
              </Row>
              <Row className="ms-0 me-0">
                {filtered24h.map((item: IForecastDay) => (
                  <Col
                    className="text-center ps-0 pe-0 border-start border-secondary"
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
                    {item.symbol_code_day == null && <>-</>}
                  </Col>
                ))}
              </Row>
              <Row className="ms-0 me-0">
                {filtered24h.map((item: IForecastDay) => (
                  <Col
                    className="text-center small ps-0 pe-0 border-start border-secondary"
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
                    className="text-center small ps-0 pe-0 border-start border-secondary"
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
          {forecastCtrl.forecastData.hours === 6 && (
            <>
              <Row className="ms-0 me-0">
                {filtered6h.map((item: IForecast6h) => (
                  <Col
                    className="text-center small ps-0 pe-0 border-start border-secondary"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <div>{moment(item.timestamp).format("ddd")}</div>
                  </Col>
                ))}
              </Row>
              <Row className="ms-0 me-0">
                {filtered6h.map((item: IForecast6h) => (
                  <Col
                    className="text-center small ps-0 pe-0 border-start border-secondary"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <div>{moment(item.timestamp).format("HH")}</div>
                  </Col>
                ))}
              </Row>
              <Row className="ms-0 me-0">
                {filtered6h.map((item) => (
                  <Col
                    className="text-center ps-0 pe-0 border-start border-secondary"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    {item.symbol_code_6h != null && (
                      <img
                        width={size}
                        height={size}
                        src={`svg/${item.symbol_code_6h}.svg`}
                        alt={item.symbol_code_6h}
                      />
                    )}
                    {item.symbol_code_6h == null && <>-</>}
                  </Col>
                ))}
              </Row>
              <Row className="ms-0 me-0">
                {filtered6h.map((item: IForecast6h) => (
                  <Col
                    className="text-center small ps-0 pe-0 border-start border-secondary"
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
                    className="text-center small ps-0 pe-0 border-start border-secondary"
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
          {forecastCtrl.forecastData.hours === 1 && (
            <>
              <MyRow className="ms-0 me-0">
                {filtered1h.map((item: IForecast1h) => (
                  <Col
                    className="text-center small ps-0 pe-0 border-start border-secondary"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <div>{moment(item.timestamp).format("ddd")}</div>
                  </Col>
                ))}
              </MyRow>
              <MyRow className="ms-0 me-0">
                {filtered1h.map((item: IForecast1h) => (
                  <Col
                    className="text-center small ps-0 pe-0 border-start border-secondary"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <div>{moment(item.timestamp).format("HH")}</div>
                  </Col>
                ))}
              </MyRow>
              <MyRow className="ms-0 me-0">
                {filtered1h.map((item: IForecast1h) => (
                  <Col
                    className="text-center ps-0 pe-0 border-start border-secondary"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    {item.symbol_code_1h != null && (
                      <img
                        width={size}
                        height={size}
                        src={`svg/${item.symbol_code_1h}.svg`}
                        alt={item.symbol_code_1h}
                      />
                    )}
                    {item.symbol_code_1h == null && <>-</>}
                  </Col>
                ))}
              </MyRow>
              <MyRow className="ms-0 me-0">
                {filtered1h.map((item: IForecast1h) => (
                  <Col
                    className="text-center small ps-0 pe-0 border-start border-secondary"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <div>{item.air_temperature.toFixed(0)}</div>
                  </Col>
                ))}
              </MyRow>
              <MyRow className="ms-0 me-0">
                {filtered1h.map((item: IForecast1h) => (
                  <Col
                    className="text-center small ps-0 pe-0 border-start border-secondary"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <div>
                      {item.precipitation_amount === 0
                        ? "-"
                        : item.precipitation_amount.toFixed(1)}
                    </div>
                  </Col>
                ))}
              </MyRow>
            </>
          )}
          <Row className="mb-0">
            <ForecastChartTemp
              data={days}
              lastTimestamp={lastTimestamp}
              firstTimestamp={firstTimestamp}
              hours={forecastCtrl.forecastData.hours}
            />
          </Row>
          <Row className="mb-3">
            <ForecastChart
              data={days}
              lastTimestamp={lastTimestamp}
              firstTimestamp={firstTimestamp}
              hours={forecastCtrl.forecastData.hours}
            />
          </Row>
        </ScrollDiv>
      </>
    );
  }
);

export default ForecastCharts;
