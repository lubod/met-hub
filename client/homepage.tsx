import React, { useContext } from "react";
import "./style.scss";
import { Button, Col, Container, Row } from "react-bootstrap";
import Protected from "./protected";
import Station from "./station/station";
import { AppContextP } from ".";
import Time from "./time/time";

const HomePage = function () {
  console.info("Homepage render");
  const appContext = useContext(AppContextP);

  // const logout = () => {
  //   appContext.auth.logout();
  // };

  if (appContext.auth.isAuthenticated()) {
    // const { name } = auth.getProfile();

    return <Protected />;
  }

  return (
    <Container className="container-max-width text-center py-2">
      <Row>
        <Col sm={6} className="px-2">
          <Time />
          <Station />
        </Col>
        <Col sm={6} className="px-2">
          <Container className="text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded">
            <h1 className="text-info">met-hub.com</h1>
            <p>
              This is a free site for non-professional meteorological stations.
              Currently you can see data from GoGEN ME 3900 (b7)
            </p>
          </Container>
          <Container className="text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded">
            <p>Login to see more stations and historical data</p>
            <Button variant="primary" onClick={appContext.auth.login}>
              Login
            </Button>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
