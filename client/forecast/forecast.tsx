import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { observer } from "mobx-react";
import Text from "../text/text";
import { AppContext } from "..";
import Data4Forecast from "./data4forecast";

type ForecastProps = {
  appContext: AppContext;
};

const Forecast = observer(({ appContext }: ForecastProps) => (
  <Container className="text-center text-light border-primary bg-very-dark rounded mb-2 py-2">
    <div className="text-left font-weight-bold">FORECAST DATA</div>
    <Row className="mt-3 mb-3">
      <Col xs={12}>
        <Button
          onClick={() => {
            appContext.forecastCrtl.fetchData(
              appContext.headerData.lat,
              appContext.headerData.lon
            );
          }}
        >
          Refresh
        </Button>
      </Col>
    </Row>
    <hr />
    <Row>
      <Col xs={4}>
        <Text name="Temperature" value="" />
      </Col>
      <Col xs={4}>
        <Text name="Precipitation" value="" />
      </Col>
      <Col xs={4}>
        <Text name="WindSpeed" value="" />
      </Col>
    </Row>
    {[...appContext.forecastData.days.values()]
      .slice(0, 5)
      .map((forecastDay, index) => (
        <>
          <div key={forecastDay.timestamp.getMilliseconds()}>
            <Data4Forecast
              label={forecastDay.timestamp
                .toDateString()
                .substring(0, forecastDay.timestamp.toDateString().length - 5)}
              temperatureMax={forecastDay.air_temperature_max}
              temperatureMin={forecastDay.air_temperature_min}
              precipitationSum={forecastDay.precipitation_amount_sum}
              windSpeedMax={forecastDay.wind_speed_max}
              symbol_code_00={forecastDay.symbol_code_00}
              symbol_code_06={forecastDay.symbol_code_06}
              symbol_code_12={forecastDay.symbol_code_12}
              symbol_code_18={forecastDay.symbol_code_18}
              forecastRows={forecastDay.forecastRows}
              cloudAreaFractionSum={forecastDay.cloud_area_fraction_sum}
            />
          </div>
          {index < 4 && <hr />}
        </>
      ))}
  </Container>
));

export default Forecast;

/*
{appContext.forecastData.forecast?.properties.timeseries.map(
  (row: any, i: any) => (
    <p key={row.time}>
      {i} {row.data.instant}
    </p>
  )
)}
*/
