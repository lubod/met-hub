import { observer } from "mobx-react";
import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import AuthData from "../auth/authData";
import Text from "../text/text";
import HeaderData from "./headerData";

type HeaderProps = {
  headerData: HeaderData;
  authData: AuthData;
};

const Header = observer(({ headerData, authData }: HeaderProps) => (
  <Container className="text-center text-light my-2 py-2 mx-auto border-primary bg-very-dark rounded shadow">
    <Row className="align-items-center">
      <Col xs={6}>
        <Text
          name="Current time"
          value={headerData.ctime.toLocaleTimeString("sk-SK")}
        />
      </Col>
      <Col xs={6}>
        {authData.isAuth && (
          <Button variant="primary" onClick={() => authData.logout()}>
            Logout
          </Button>
        )}
        {!authData.isAuth && (
          <Button variant="primary" onClick={() => authData.login()}>
            Login
          </Button>
        )}
      </Col>
    </Row>
  </Container>
));

export default Header;
