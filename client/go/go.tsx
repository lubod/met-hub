import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { observer } from "mobx-react";
import { AppContext } from "..";
import Forecast from "../forecast/forecast";

type Props = {
  appContext: AppContext;
};

const Go = observer(({ appContext }: Props) => {
  console.info("Go render");

  return (
    <div>
      <Container className="container-max-width text-center mx-auto vh-100">
        <Row>
          <Col sm={3} className="ps-1 pe-1">
            <Forecast forecastCtrl={appContext.forecastCtrl} />
          </Col>
        </Row>
      </Container>
    </div>
  );
});

export default Go;
