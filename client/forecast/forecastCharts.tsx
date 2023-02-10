/* eslint-disable react/destructuring-assignment */
/* eslint-disable camelcase */
import React from "react";
import { Row, Col, DropdownButton, Dropdown, Button } from "react-bootstrap";
import { observer } from "mobx-react";
import styled from "styled-components";
import ForecastChart from "./forecastChart";
import {
  Forecast1h,
  Forecast6h,
  ForecastDay,
  IGetForecastDataToDisplay,
} from "./forecastData";
import ForecastChartTemp from "./forecastChartTemp";
import ForecastCtrl from "./forecastCtrl";
import { Myhr } from "../misc/myhr";

const ScrollDiv = styled.div`
  // display: flex;
  // flex-wrap: nowrap;
  // overflow-x: auto;
`;

type ColProps = {
  value: string;
  extraClass: string;
};

function MyCol({ value, extraClass }: ColProps) {
  const style = {
    display: "flex",
    justifyContent: "center",
  };
  return (
    <Col
      className={`text-center small ps-0 pe-0 pb-2 border-start ${extraClass}`}
      style={style}
    >
      {value}
    </Col>
  );
}

type RowsProps = {
  data: Array<IGetForecastDataToDisplay>;
};

function MyRows1({ data }: RowsProps) {
  const size = "34px";
  const rowClassName = "ms-0 me-0";

  return (
    <>
      <Row className={rowClassName}>
        {data.map((item: IGetForecastDataToDisplay) => (
          <MyCol value={item.getDay()} extraClass="border-secondary" />
        ))}
      </Row>
      <Row className={rowClassName}>
        {data.map((item: IGetForecastDataToDisplay) => (
          <MyCol value={item.getDay2()} extraClass="border-secondary" />
        ))}
      </Row>
      <Row className={rowClassName}>
        {data.map((item: IGetForecastDataToDisplay) => (
          <Col
            className="text-center ps-0 pe-0 border-start border-secondary"
            style={{ display: "flex", justifyContent: "center" }}
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
          </Col>
        ))}
      </Row>
      <Row className={rowClassName}>
        {data.map((item: IGetForecastDataToDisplay) => (
          <MyCol value={item.getAirTemperatureMax()} extraClass="border-info" />
        ))}
      </Row>
      <Row className={rowClassName}>
        {data.map((item: IGetForecastDataToDisplay) => (
          <MyCol value={item.getAirTemperatureMin()} extraClass="border-info" />
        ))}
      </Row>
    </>
  );
}

function MyRows2({ data }: RowsProps) {
  const rowClassName = "ms-0 me-0";

  return (
    <>
      <Row className={rowClassName}>
        {data.map((item: IGetForecastDataToDisplay) => (
          <MyCol
            value={item.getPrecipitationAmount()}
            extraClass="border-primary"
          />
        ))}
      </Row>
      <Row className={rowClassName}>
        {data.map((item: IGetForecastDataToDisplay) => (
          <MyCol value={item.getCloudAreaFraction()} extraClass="" />
        ))}
      </Row>
      <Row className={rowClassName}>
        {data.map((item: IGetForecastDataToDisplay) => (
          <MyCol value={item.getWindSpeed()} extraClass="border-success" />
        ))}
      </Row>
      <Row className={rowClassName}>
        {data.map((item: IGetForecastDataToDisplay) => (
          <Col
            className="text-center ps-0 pe-0 border-start border-success"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <svg width="25px" height="25px">
              <polygon
                points="8 3, 12 21, 16 3"
                fill="white"
                stroke="white"
                transform={`rotate(${item.getWindDir()} 12 12)`}
              />
            </svg>
          </Col>
        ))}
      </Row>
    </>
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
      if (forecastCtrl.forecastData.hours === 1) {
        if (
          forecastCtrl.forecastData.offset1h + direction >= 0 &&
          forecastCtrl.forecastData.offset1h + direction <=
            forecast_1h.length - cols
        ) {
          forecastCtrl.forecastData.setOffset1h(
            forecastCtrl.forecastData.offset1h + direction
          );
        } else if (forecastCtrl.forecastData.offset1h + direction < 0) {
          forecastCtrl.forecastData.setOffset1h(0);
        } else if (
          forecastCtrl.forecastData.offset1h + direction >
          forecast_1h.length - cols
        ) {
          forecastCtrl.forecastData.setOffset1h(forecast_1h.length - cols);
        }
      } else if (forecastCtrl.forecastData.hours === 6) {
        if (
          forecastCtrl.forecastData.offset6h + direction >= 0 &&
          forecastCtrl.forecastData.offset6h + direction <=
            forecast_6h.length - cols
        ) {
          forecastCtrl.forecastData.setOffset6h(
            forecastCtrl.forecastData.offset6h + direction
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

    if (days.length > 0 && forecastCtrl.forecastData.hours === 24) {
      filtered24h = days.filter((el, i) => i < cols);
    }

    if (forecast_6h.length > 0 && forecastCtrl.forecastData.hours === 6) {
      filtered6h = forecast_6h
        .filter((el, i) => i >= forecastCtrl.forecastData.offset6h)
        .filter((el, i) => i < cols);
    }

    if (days.length > 0 && forecastCtrl.forecastData.hours === 1) {
      filtered1h = forecast_1h
        .filter((el, i) => i >= forecastCtrl.forecastData.offset1h)
        .filter((el, i) => i < cols);
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
              <Button variant="secondary" onClick={() => changeOffset(-cols)}>
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
              <Button variant="secondary" onClick={() => changeOffset(cols)}>
                Next
              </Button>
            )}
          </Col>
        </Row>
        <ScrollDiv>
          {forecastCtrl.forecastData.hours === 24 && (
            <MyRows1 data={filtered24h} />
          )}
          {forecastCtrl.forecastData.hours === 6 && (
            <MyRows1 data={filtered6h} />
          )}
          {forecastCtrl.forecastData.hours === 1 && (
            <MyRows1 data={filtered1h} />
          )}
          <Row className="mb-0">
            <ForecastChartTemp
              data={days}
              lastTimestamp={lastTimestamp}
              firstTimestamp={firstTimestamp}
              hours={forecastCtrl.forecastData.hours}
              offset6h={forecastCtrl.forecastData.offset6h}
            />
          </Row>
          <Myhr className="mt-3" />
          {forecastCtrl.forecastData.hours === 24 && (
            <MyRows2 data={filtered24h} />
          )}
          {forecastCtrl.forecastData.hours === 6 && (
            <MyRows2 data={filtered6h} />
          )}
          {forecastCtrl.forecastData.hours === 1 && (
            <MyRows2 data={filtered1h} />
          )}
          <Row className="mb-3">
            <ForecastChart
              data={days}
              lastTimestamp={lastTimestamp}
              firstTimestamp={firstTimestamp}
              hours={forecastCtrl.forecastData.hours}
              offset6h={forecastCtrl.forecastData.offset6h}
            />
          </Row>
        </ScrollDiv>
      </>
    );
  }
);

export default ForecastCharts;
