import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { observer } from "mobx-react";
import Protected from "./protected";
import Station from "./station/station";
import Header from "./header/header";
import StationData from "./station/stationData";
import DomData from "./dom/domData";
import AuthData from "./auth/authData";
import HeaderData from "./header/headerData";
import ChartsData from "./charts/chartsData";

type HomePageProps = {
  headerData: HeaderData;
  stationData: StationData;
  domData: DomData;
  authData: AuthData;
  chartsData: ChartsData;
};

const HomePage = observer(
  ({
    headerData,
    stationData,
    domData,
    authData,
    chartsData,
  }: HomePageProps) => {
    console.info("Homepage render", authData.isAuth);

    return (
      <div>
        {!authData.isAuth && (
          <Container className="container-max-width text-center mx-auto">
            <Row className="">
              <Header headerData={headerData} authData={authData} />
            </Row>
            <Row>
              <Col sm={6} className="ps-1 pe-1">
                <Station
                  stationData={stationData}
                  authData={authData}
                  chartsData={chartsData}
                />
              </Col>
              <Col sm={6} className="ps-1 pe-1">
                <Container className="text-center text-light border-secondary bg-very-dark rounded mb-2 py-2">
                  <h1 className="text-info">met-hub.com</h1>
                  <p>
                    This is a free site for non-professional meteorological
                    stations. Currently you can see data from GoGEN ME 3900
                  </p>
                </Container>
                <Container className="text-center text-light border-secondary bg-very-dark rounded mb-2 py-2">
                  <p>Login to see more stations and historical data</p>
                </Container>
              </Col>
            </Row>
            <Row>
              <Container className="text-center text-light border-primary bg-very-dark rounded mb-2 py-2">
                - v18 -
              </Container>
            </Row>
          </Container>
        )}
        {authData.isAuth && (
          <Protected
            headerData={headerData}
            stationData={stationData}
            domData={domData}
            authData={authData}
            chartsData={chartsData}
          />
        )}
      </div>
    );
  }
);

export default HomePage;
