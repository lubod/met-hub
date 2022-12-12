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
import MY_COLORS from "../../common/colors";

type ForecastProps = {
  appContext: AppContext;
};

let numberOfForecastDays = 3;
let daysStyle = "mb-4";

const Forecast = observer(({ appContext }: ForecastProps) => {
  const [days10r, setDays10r] = useState(false);

  function setDaysRows(show10: boolean) {
    setDays10r(show10);
    if (show10) {
      numberOfForecastDays = 10;
      daysStyle = "";
    } else {
      numberOfForecastDays = 3;
      daysStyle = "mb-4";
    }
  }

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
        <Col xs={3}>
          <Text name="Day" value="" />
        </Col>
        <Col xs={3}>
          <Text name="Temperature °C" value="" />
        </Col>
        <Col xs={3}>
          <Text name="Rain mm" value="" />
        </Col>
        <Col xs={3}>
          <Text name="WindSpeed km/h" value="" />
        </Col>
      </Row>
      <Row className="mb-2">
        <Col xs={6} />
        <Col xs={5}>
          <Form>
            <Form.Check
              type="switch"
              id="custom-switch-1"
              label="3 / 10 days"
              checked={days10r}
              onChange={(e) => {
                setDaysRows(e.target.checked);
              }}
              className="small"
            />
          </Form>
        </Col>
      </Row>
      {[...appContext.forecastData.days.values()]
        .slice(0, numberOfForecastDays)
        .map((forecastDay) => (
          <div key={forecastDay.timestamp.getTime()} className={daysStyle}>
            <Data4Forecast forecastDay={forecastDay} days10r={days10r} />
          </div>
        ))}
      {days10r && <div className="mb-4" />}
      <Myhr />
      <Row>
        <Col xs={6}>
          <div className="small text-white-50 font-weight-bold">
            Temperature <span style={{ color: MY_COLORS.orange }}>&#8226;</span>
          </div>
        </Col>
      </Row>
      <Row className="mb-3">
        {days10r === false && (
          <ForecastChart
            data={[...appContext.forecastData.days.values()]}
            index={3}
          />
        )}
        {days10r === true && (
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
