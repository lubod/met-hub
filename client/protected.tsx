import { observer } from "mobx-react";
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { AuthData } from "./auth";
import Dom from "./dom/dom";
import DomData from "./dom/domData";
import HomePage from "./homepage";
import Station from "./station/station";
import StationData from "./station/stationData";
import "./style.scss";
import Header from "./header/header";
import HeaderData from "./header/headerData";

type ProtectedProps = {
  headerData: HeaderData;
  stationData: StationData;
  domData: DomData;
  authData: AuthData;
};

const Protected = observer(
  ({ headerData, stationData, domData, authData }: ProtectedProps) => {
    console.info("Protected render", authData.isAuth);

    return (
      <div>
        {!authData.isAuth && (
          <HomePage
            headerData={headerData}
            stationData={stationData}
            domData={domData}
            authData={authData}
          />
        )}
        {authData.isAuth && (
          <Container className="container-max-width text-center py-2">
            <Row>
              <Header headerData={headerData} authData={authData} />
              <Col sm={6} className="px-2">
                <Station stationData={stationData} authData={authData} />
              </Col>
              <Col sm={6} className="px-2">
                <Dom domData={domData} authData={authData} />
              </Col>
            </Row>
          </Container>
        )}
      </div>
    );
  }
);

export default Protected;
