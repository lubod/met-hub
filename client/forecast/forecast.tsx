import React, { useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { observer } from "mobx-react";
import moment from "moment";
import Text from "../misc/text";
import { AppContext } from "..";
import Data4Forecast from "./data4Forecast";
import { LoadImg } from "../misc/loadImg";
import { Myhr } from "../misc/myhr";
import { MyContainer } from "../misc/mycontainer";
import ForecastChart from "./forecastChart";

type ForecastProps = {
  appContext: AppContext;
};

const numberOfForecastDays = 3;

const Forecast = observer(({ appContext }: ForecastProps) => {
  const [days10, setDays10] = useState(false);

  return (
    <MyContainer>
      <Row className="mt-3">
        <Col xs={6} className="text-left font-weight-bold">
          <div>FORECAST DATA</div>
        </Col>
        <Col xs={4} />
        <Col xs={2}>
          <Button
            variant="link btn-sm"
            onClick={() => {
              appContext.forecastCrtl.fetchData();
              appContext.forecastCrtl.fetchAstronomicalData(new Date());
            }}
          >
            <LoadImg
              rotate={appContext.forecastData.loading}
              src="icons8-refresh-25.svg"
              alt=""
            />
          </Button>
        </Col>
      </Row>
      <Row className="">
        <div className="text-left my-2">
          <div className="small text-white-50 font-weight-bold">
            Data and weather icons source:
          </div>
          <div className="my-1 small text-white-50 font-weight-bold">
            <a href="https://www.met.no/en">
              Norwegian Meteorological Institute
            </a>
          </div>
        </div>
      </Row>
      <Myhr />
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
        .slice(0, numberOfForecastDays)
        .map((forecastDay, index) => (
          <>
            <div key={forecastDay.timestamp.getTime()}>
              <Data4Forecast
                label={forecastDay.timestamp
                  .toDateString()
                  .substring(
                    0,
                    forecastDay.timestamp.toDateString().length - 5
                  )}
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
            {index < numberOfForecastDays - 1 && <Myhr />}
          </>
        ))}
      <Myhr />
      <Row>
        <Col xs={6}>
          <div className="small font-weight-bold">Charts</div>
        </Col>
        <Col xs={1} />
        <Col xs={4}>
          <Form>
            <Form.Check
              type="switch"
              id="custom-switch"
              label="10 days"
              checked={days10}
              onChange={(e) => {
                setDays10(e.target.checked);
              }}
              className="small"
            />
          </Form>
        </Col>
      </Row>
      <Row>
        {days10 === false && (
          <ForecastChart
            data={[...appContext.forecastData.days.values()]}
            index={3}
          />
        )}
        {days10 === true && (
          <ForecastChart
            data={[...appContext.forecastData.days.values()]}
            index={10}
          />
        )}
      </Row>
      <Myhr />
      <Row>
        <Col xs={6}>
          <Text
            name="Sunrise"
            value={
              appContext.forecastData.sunrise == null
                ? "-"
                : moment(appContext.forecastData.sunrise).format("HH:mm")
            }
          />
        </Col>
        <Col xs={6}>
          <Text
            name="Sunset"
            value={
              appContext.forecastData.sunset == null
                ? "-"
                : moment(appContext.forecastData.sunset).format("HH:mm")
            }
          />
        </Col>
      </Row>
    </MyContainer>
  );
});

export default Forecast;
