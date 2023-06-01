import { observer } from "mobx-react";
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import HomePage from "./homepage";
import Station from "./station/station";
import Charts from "./charts/charts";
import { AppContext } from ".";
import Header from "./header/header";
import Dom from "./dom/dom";
import Forecast from "./forecast/forecast";

type Props = {
  appContext: AppContext;
};

const Protected = observer(({ appContext }: Props) => {
  console.info("Protected render", appContext.authCtrl.authData.isAuth);

  return (
    <div>
      {!appContext.authCtrl.authData.isAuth && (
        <HomePage appContext={appContext} />
      )}
      {appContext.authCtrl.authData.isAuth && (
        <Container className="container-max-width text-center mx-auto">
          <Row className="">
            <Header appContext={appContext} />
          </Row>
          <Row>
            <Col sm={4} className="ps-1 pe-1">
              {appContext.stationCtrl.stationData.station != null &&
                appContext.stationCtrl.stationData.station.id !== "dom" && (
                  <Station appContext={appContext} />
                )}
              {appContext.headerCtrl.headerData.station != null && // todo
                appContext.headerCtrl.headerData.station.id === "dom" && (
                  <Dom appContext={appContext} />
                )}
            </Col>
            <Col sm={4} className="ps-1 pe-1">
              {appContext.forecastCtrl.forecastData.station != null && (
                <Forecast forecastCtrl={appContext.forecastCtrl} />
              )}
            </Col>
            <Col sm={4} className="ps-1 pe-1">
              {appContext.chartsCtrl.chartsData.station != null && (
                <Charts appContext={appContext} />
              )}
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
});

export default Protected;
// <Dom domData={domData} authData={authData} />
