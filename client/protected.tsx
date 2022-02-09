import React, { useContext } from "react";
import {
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { AppContextP } from ".";
import Dom from "./dom/dom";
import HomePage from "./homepage";
import Station from "./station/station";
import "./style.scss";
import Time from "./time/time";

const Protected = function () {
  console.info("Protected render");
  const appContext = useContext(AppContextP);

  if (!appContext.auth.isAuthenticated()) {
    return <HomePage />;
  }
  return (
    <Container className="container-max-width text-center py-2">
      <Row>
        <Time />
        <Col sm={6} className="px-2">
          <Station />
        </Col>
        <Col sm={6} className="px-2">
          <Dom />
        </Col>
      </Row>
    </Container>
  );
};

export default Protected;
