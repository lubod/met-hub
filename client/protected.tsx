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

type ProtectedProps = {
  appContext: AppContext;
};

const Protected = observer(({ appContext }: ProtectedProps) => {
  console.info("Protected render", appContext.authData.isAuth);

  return (
    <div>
      {!appContext.authData.isAuth && <HomePage appContext={appContext} />}
      {appContext.authData.isAuth && (
        <Container className="container-max-width text-center mx-auto">
          <Row className="">
            <Header appContext={appContext} />
          </Row>
          <Row>
            <Col sm={4} className="ps-1 pe-1">
              {appContext.headerData.id.startsWith("station") && (
                <Station appContext={appContext} />
              )}
              {appContext.headerData.id === "dom" && (
                <Dom appContext={appContext} />
              )}
            </Col>
            <Col sm={4} className="ps-1 pe-1">
              <Forecast appContext={appContext} />
            </Col>
            <Col sm={4} className="ps-1 pe-1">
              <Charts appContext={appContext} />
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
});

export default Protected;
// <Dom domData={domData} authData={authData} />
