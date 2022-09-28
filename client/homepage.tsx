import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { observer } from "mobx-react";
import Protected from "./protected";
import Station from "./station/station";
import Header from "./header/header";
import { AppContext } from ".";
import Forecast from "./forecast/forecast";

type HomePageProps = {
  appContext: AppContext;
};

const HomePage = observer(({ appContext }: HomePageProps) => {
  console.info("Homepage render", appContext.authData.isAuth);

  return (
    <div>
      {!appContext.authData.isAuth && (
        <Container className="container-max-width text-center mx-auto">
          <Row className="">
            <Header appContext={appContext} />
          </Row>
          <Row>
            <Col sm={4} className="ps-1 pe-1">
              <Station appContext={appContext} />
            </Col>
            <Col sm={4} className="ps-1 pe-1">
              <Forecast appContext={appContext} />
            </Col>
            <Col sm={4} className="ps-1 pe-1">
              <Container className="text-center text-light border-secondary bg-very-dark rounded mb-2 py-2">
                <h1 className="text-primary">met-hub.com</h1>
                <p>
                  This is a free site for non-professional meteorological
                  stations based on open-source project{" "}
                  <a href="https://github.com/lubod/met-hub">met-hub</a>
                </p>
                <hr />
                <p>Currently you can see data from GoGEN ME 3900</p>
                <p>Login to see more stations and historical data</p>
              </Container>
            </Col>
          </Row>
          <Row>
            <Container className="text-center text-light border-primary bg-very-dark rounded mb-2 py-2">
              - v21 -
            </Container>
          </Row>
        </Container>
      )}
      {appContext.authData.isAuth && <Protected appContext={appContext} />}
    </div>
  );
});

export default HomePage;
