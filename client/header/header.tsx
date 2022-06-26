import { observer } from "mobx-react";
import React from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import AuthData from "../auth/authData";
import Text from "../text/text";
import HeaderData from "./headerData";

type HeaderProps = {
  headerData: HeaderData;
  authData: AuthData;
};

const Header = observer(({ headerData, authData }: HeaderProps) => (
  <Container className="text-center text-light border-primary bg-very-dark rounded mb-2 py-2">
    <Row className="align-items-center">
      <Col xs={4}>
        <Text
          name="Current time"
          value={headerData.ctime.toLocaleTimeString("sk-SK")}
        />
      </Col>
      <Col xs={4}>
        {authData.isAuth && (
          <DropdownButton
            id="dropdown-place-button"
            title="Place"
            onSelect={(e) => headerData.setPlace(e)}
          >
            <Dropdown.Item eventKey="stanica">Marianka - Station</Dropdown.Item>
            <Dropdown.Item eventKey="dom">Marianka - Dom</Dropdown.Item>
          </DropdownButton>
        )}
      </Col>
      <Col xs={4}>
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
