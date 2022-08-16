import { observer } from "mobx-react";
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import DomData from "./dom/domData";
import HomePage from "./homepage";
import Station from "./station/station";
import StationData from "./station/stationData";
import Header from "./header/header";
import HeaderData from "./header/headerData";
import Dom from "./dom/dom";
import AuthData from "./auth/authData";
import Charts from "./charts/charts";
import ChartsData from "./charts/chartsData";
import { STATION_MEASUREMENTS } from "../common/stationModel";
import { DOM_MEASUREMENTS } from "../common/domModel";

type ProtectedProps = {
  headerData: HeaderData;
  stationData: StationData;
  domData: DomData;
  authData: AuthData;
  chartsData: ChartsData;
};

const Protected = observer(
  ({
    headerData,
    stationData,
    domData,
    authData,
    chartsData,
  }: ProtectedProps) => {
    console.info("Protected render", authData.isAuth);

    return (
      <div>
        {!authData.isAuth && (
          <HomePage
            headerData={headerData}
            stationData={stationData}
            domData={domData}
            authData={authData}
            chartsData={chartsData}
          />
        )}
        {authData.isAuth && (
          <Container className="container-max-width text-center mx-auto">
            <Row className="">
              <Header headerData={headerData} authData={authData} />
            </Row>
            <Row>
              <Col sm={6} className="ps-1 pe-1">
                {headerData.place === "stanica" && (
                  <Station
                    stationData={stationData}
                    authData={authData}
                    chartsData={chartsData}
                  />
                )}
                {headerData.place === "dom" && (
                  <Dom
                    domData={domData}
                    authData={authData}
                    chartsData={chartsData}
                  />
                )}
              </Col>
              <Col sm={6} className="ps-1 pe-1">
                {headerData.place === "stanica" && (
                  <Charts
                    chartsData={chartsData}
                    measurements={STATION_MEASUREMENTS}
                  />
                )}
                {headerData.place === "dom" && (
                  <Charts
                    chartsData={chartsData}
                    measurements={DOM_MEASUREMENTS}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Container className="text-center text-light border-primary bg-very-dark rounded mb-2 py-2">
                -
              </Container>
            </Row>
          </Container>
        )}
      </div>
    );
  }
);

export default Protected;
// <Dom domData={domData} authData={authData} />
