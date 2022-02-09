import { observer } from "mobx-react";
import React, { useContext } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { AppContextP, AppDataP } from "..";
import Text from "../text/text";

const Time = observer(() => {
  const app = useContext(AppDataP);
  const appContext = useContext(AppContextP);

  return (
    <Container className="text-center text-light my-2 py-2 mx-auto border-primary bg-very-dark rounded shadow">
      <Row>
        <Col xs={6}>
          <Text
            name="Current time"
            value={app.ctime.toLocaleTimeString("sk-SK")}
          />
        </Col>
        <Col xs={6}>
          {appContext.auth.isAuthenticated() && (
            <Button variant="primary" onClick={() => appContext.auth.logout()}>
              Logout
            </Button>
          )}
          {!appContext.auth.isAuthenticated() && (
            <Button variant="primary" onClick={() => appContext.auth.login()}>
              Login
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
});

export default Time;
