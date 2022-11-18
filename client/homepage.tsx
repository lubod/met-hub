import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { observer } from "mobx-react";
import Protected from "./protected";
import Station from "./station/station";
import Header from "./header/header";
import { AppContext } from ".";
import Forecast from "./forecast/forecast";
import { Myhr } from "./data/myhr";
import { MyContainer } from "./data/mycontainer";

type HomePageProps = {
  appContext: AppContext;
};

const HomePage = observer(({ appContext }: HomePageProps) => {
  console.info("Homepage render", appContext.authData.isAuth);
  let colSize = 4;
  if (appContext.headerData.isExternalID) {
    colSize = 6;
  }

  return (
    <div>
      {!appContext.authData.isAuth && (
        <Container className="container-max-width text-center mx-auto">
          <Row className="">
            <Header appContext={appContext} />
          </Row>
          <Row>
            <Col sm={colSize} className="ps-1 pe-1">
              <Station appContext={appContext} />
            </Col>
            <Col sm={colSize} className="ps-1 pe-1">
              <Forecast appContext={appContext} />
            </Col>
            {appContext.headerData.isExternalID === false && (
              <Col sm={colSize} className="ps-1 pe-1">
                <MyContainer>
                  <h1 className="text-primary">met-hub.com</h1>
                  <p>
                    This is a free site for non-professional meteorological
                    stations based on open-source project{" "}
                    <a href="https://github.com/lubod/met-hub">met-hub</a>
                  </p>
                  <Myhr />
                  <p>
                    Currently you can see data from GoGEN ME 3900 or GARNI 1025
                    Arcus
                  </p>
                  <p>Login to see more stations and historical data</p>
                  <Myhr />
                  <p>- v23 -</p>
                </MyContainer>
              </Col>
            )}
          </Row>
        </Container>
      )}
      {appContext.authData.isAuth && <Protected appContext={appContext} />}
    </div>
  );
});

export default HomePage;
