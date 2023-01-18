import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { observer } from "mobx-react";
import moment from "moment";
import Text from "../misc/text";
import { LoadImg } from "../misc/loadImg";
import { Myhr } from "../misc/myhr";
import { MyContainer } from "../misc/mycontainer";
import ForecastTable from "./forecastTable";
import ForecastCharts from "./forecastCharts";
import ForecastCtrl from "./forecastCtrl";

type Props = {
  forecastCtrl: ForecastCtrl;
};

const Forecast = observer(({ forecastCtrl }: Props) => (
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
            forecastCtrl.fetchData();
            forecastCtrl.fetchAstronomicalData(new Date());
          }}
        >
          <LoadImg
            rotate={forecastCtrl.forecastData.loading}
            src="icons8-refresh-25.svg"
            alt=""
          />
        </Button>
      </Col>
    </Row>
    <Row>
      <Col xs={4} />
      <Col xs={5}>-</Col>
    </Row>
    <Row className="">
      <Col xs={12}>
        <div className="text-left my-2">
          <span className="small text-white-50 font-weight-bold">
            Data & icons source:
          </span>{" "}
          <span className="my-1 small text-white-50 font-weight-bold">
            <a href="https://www.met.no/en">Norwegian Meteo Institute</a>
          </span>
        </div>
      </Col>
    </Row>
    <Myhr />
    <ForecastTable
      days={[...forecastCtrl.forecastData.days.values()].slice(0, 3)}
      forecastCtrl={forecastCtrl}
    />
    <Myhr />
    <ForecastCharts
      days={[...forecastCtrl.forecastData.days.values()]}
      forecast_6h={forecastCtrl.forecastData.forecast_6h}
      forecast_1h={forecastCtrl.forecastData.forecast_1h}
      forecastCtrl={forecastCtrl}
    />
    <Myhr />
    <Row>
      <Col xs={6}>
        <Text
          name="Sunrise"
          value={
            forecastCtrl.forecastData.sunrise == null
              ? "-"
              : moment(forecastCtrl.forecastData.sunrise).format("HH:mm")
          }
        />
      </Col>
      <Col xs={6}>
        <Text
          name="Sunset"
          value={
            forecastCtrl.forecastData.sunset == null
              ? "-"
              : moment(forecastCtrl.forecastData.sunset).format("HH:mm")
          }
        />
      </Col>
    </Row>
  </MyContainer>
));

export default Forecast;
