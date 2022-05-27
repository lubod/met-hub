import React from "react";
import "./style.scss";
import { Col, Container, Row } from "react-bootstrap";
import { observer } from "mobx-react";
import Protected from "./protected";
import Station from "./station/station";
import Header from "./header/header";
import StationData from "./station/stationData";
import DomData from "./dom/domData";
import { AuthData } from "./auth";
import HeaderData from "./header/headerData";

type HomePageProps = {
  headerData: HeaderData;
  stationData: StationData;
  domData: DomData;
  authData: AuthData;
};

const HomePage = observer(
  ({ headerData, stationData, domData, authData }: HomePageProps) => {
    console.info("Homepage render", authData.isAuth);

    return (
      <div>
        {!authData.isAuth && (
          <Container className="container-max-width text-center py-2">
            <Row>
              <Col sm={6} className="px-2">
                <Header headerData={headerData} authData={authData} />
                <Station stationData={stationData} authData={authData} />
              </Col>
              <Col sm={6} className="px-2">
                <Container className="text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded">
                  <h1 className="text-info">met-hub.com</h1>
                  <p>
                    This is a free site for non-professional meteorological
                    stations. Currently you can see data from GoGEN ME 3900
                    (v12)
                  </p>
                </Container>
                <Container className="text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded">
                  <p>Login to see more stations and historical data</p>
                </Container>
              </Col>
            </Row>
          </Container>
        )}
        {authData.isAuth && (
          <Protected
            headerData={headerData}
            stationData={stationData}
            domData={domData}
            authData={authData}
          />
        )}
      </div>
    );
  }
);

export default HomePage;
