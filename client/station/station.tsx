/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { observer } from "mobx-react";
import WindRose from "../wind-rose/wind-rose";
import Data from "../data/data";
import Text from "../text/text";
import DataWithTrend from "../dataWithTrend/dataWithTrend";
import MapModal from "../mapModal";
import StationData from "./stationData";
import AuthData from "../auth/authData";

type StationProps = {
  stationData: StationData;
  authData: AuthData;
};

const Station = observer(({ stationData, authData }: StationProps) => {
  const [modalShow, setModalShow] = React.useState(false);

  const handleClose = () => {
    setModalShow(false);
  };

  const handleShow = () => {
    if (authData.isAuth) {
      setModalShow(true);
    }
  };

  console.info("station render", authData.isAuth, stationData.oldData);

  return (
    <div className="main">
      <Container className="text-center text-light my-2 py-2 mx-auto border-primary bg-very-dark rounded shadow">
        <Row className={stationData.oldData ? "text-danger" : ""}>
          <Col xs={4} onClick={handleShow}>
            <Text name="Place" value={stationData.data.place} />
            <div onClick={(e) => e.stopPropagation()}>
              <MapModal modalShow={modalShow} handleClose={handleClose} />
            </div>
          </Col>
          <Col xs={4}>
            <Text name="Date" value={stationData.data.date} />
          </Col>
          <Col xs={4}>
            <Text name="Data time" value={stationData.data.time} />
          </Col>
        </Row>
      </Container>
      <Container className="text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded">
        <WindRose
          gustTrend={stationData.trendData.windgust}
          speedTrend={stationData.trendData.windspeed}
          dirTrend={stationData.trendData.winddir}
          speed={stationData.oldData ? null : stationData.data.windspeed}
          dir={stationData.oldData ? null : stationData.data.winddir}
          gust={stationData.oldData ? null : stationData.data.windgust}
          dailyGust={stationData.oldData ? null : stationData.data.maxdailygust}
          authData={authData}
        />
      </Container>
      <Container className="text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded">
        <Row>
          <Col xs={4}>
            <DataWithTrend
              name="Temperature"
              value={stationData.oldData ? null : stationData.data.temp}
              unit="°C"
              fix={1}
              data={stationData.trendData.temp}
              range={1.6}
              couldBeNegative
              measurement="stanica:temp"
              authData={authData}
            />
          </Col>
          <Col xs={4}>
            <DataWithTrend
              name="Humidity"
              value={stationData.oldData ? null : stationData.data.humidity}
              unit="%"
              fix={0}
              data={stationData.trendData.humidity}
              range={10}
              couldBeNegative={false}
              measurement="stanica:humidity"
              authData={authData}
            />
          </Col>
          <Col xs={4}>
            <DataWithTrend
              name="Pressure"
              value={stationData.oldData ? null : stationData.data.pressurerel}
              unit="hPa"
              fix={1}
              data={stationData.trendData.pressurerel}
              range={1}
              couldBeNegative={false}
              measurement="stanica:pressurerel"
              authData={authData}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <DataWithTrend
              name="Radiation"
              value={
                stationData.oldData ? null : stationData.data.solarradiation
              }
              unit="W/m2"
              fix={0}
              data={stationData.trendData.solarradiation}
              range={100}
              couldBeNegative={false}
              measurement="stanica:solarradiation"
              authData={authData}
            />
          </Col>
          <Col xs={4}>
            <DataWithTrend
              name="UV"
              value={stationData.oldData ? null : stationData.data.uv}
              unit=""
              fix={0}
              data={stationData.trendData.uv}
              range={3}
              couldBeNegative={false}
              measurement="stanica:uv"
              authData={authData}
            />
          </Col>
          <Col xs={4}>
            <DataWithTrend
              name="Rain Rate"
              value={stationData.oldData ? null : stationData.data.rainrate}
              unit="mm/h"
              fix={1}
              data={stationData.trendData.rainrate}
              range={1}
              couldBeNegative={false}
              measurement="stanica:rainrate"
              authData={authData}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <Data
              name="Event Rain"
              value={stationData.oldData ? null : stationData.data.eventrain}
              unit="mm"
              fix={1}
            />
          </Col>
          <Col xs={4}>
            <Data
              name="Hourly"
              value={stationData.oldData ? null : stationData.data.hourlyrain}
              unit="mm"
              fix={1}
            />
          </Col>
          <Col xs={4}>
            <Data
              name="Daily"
              value={stationData.oldData ? null : stationData.data.dailyrain}
              unit="mm"
              fix={1}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <Data
              name="Weekly"
              value={stationData.oldData ? null : stationData.data.weeklyrain}
              unit="mm"
              fix={1}
            />
          </Col>
          <Col xs={4}>
            <Data
              name="Monthly"
              value={stationData.oldData ? null : stationData.data.monthlyrain}
              unit="mm"
              fix={1}
            />
          </Col>
          <Col xs={4}>
            <Data
              name="Total"
              value={stationData.oldData ? null : stationData.data.totalrain}
              unit="mm"
              fix={1}
            />
          </Col>
        </Row>
      </Container>
      {authData.isAuth && (
        <Container className="text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded">
          <div className="text-left font-weight-bold">IN</div>
          <Row>
            <Col xs={6}>
              <DataWithTrend
                name="Temperature"
                value={stationData.oldData ? null : stationData.data.tempin}
                unit="°C"
                fix={1}
                data={stationData.trendData.tempin}
                range={1.6}
                couldBeNegative
                measurement="stanica:tempin"
                authData={authData}
              />
            </Col>
            <Col xs={6}>
              <DataWithTrend
                name="Humidity"
                value={stationData.oldData ? null : stationData.data.humidityin}
                unit="%"
                fix={0}
                data={stationData.trendData.humidityin}
                range={10}
                couldBeNegative={false}
                measurement="stanica:humidityin"
                authData={authData}
              />
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
});

export default Station;
