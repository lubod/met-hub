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
import { AppContext } from "..";
import { DOM_MEASUREMENTS, DOM_MEASUREMENTS_DESC } from "../../common/domModel";
import {
  STATION_MEASUREMENTS,
  STATION_MEASUREMENTS_DESC,
} from "../../common/stationModel";
import Text from "../text/text";

type HeaderProps = {
  appContext: AppContext;
};

const Header = observer(({ appContext }: HeaderProps) => (
  <Container className="text-center text-light border-primary bg-very-dark rounded mb-2 py-2">
    <Row className="align-items-center">
      <Col xs={4}>
        <Text
          name="Current time"
          value={appContext.headerData.ctime.toLocaleTimeString("sk-SK")}
        />
      </Col>
      <Col xs={4}>
        {appContext.authData.isAuth && (
          <DropdownButton
            id="dropdown-place-button"
            title="Place"
            onSelect={(e) => {
              appContext.headerData.setPlace(e);
              if (appContext.headerData.place === "stanica") {
                appContext.chartsData.setMeasurements(STATION_MEASUREMENTS);
                appContext.chartsData.setMeasurementObject(
                  STATION_MEASUREMENTS_DESC.TEMPERATURE
                );
              } else if (appContext.headerData.place === "dom") {
                appContext.chartsData.setMeasurements(DOM_MEASUREMENTS);
                appContext.chartsData.setMeasurementObject(
                  DOM_MEASUREMENTS_DESC.LIVING_ROOM_AIR
                );
              }
              appContext.chartsCtrl.load(
                appContext.chartsData.offset,
                appContext.chartsData.page,
                appContext.chartsData.measurement
              );
              appContext.forecastCrtl.fetchData(
                appContext.headerData.lat,
                appContext.headerData.lon
              );
            }}
          >
            <Dropdown.Item eventKey="stanica">Marianka - Station</Dropdown.Item>
            <Dropdown.Item eventKey="dom">Marianka - Dom</Dropdown.Item>
            <Dropdown.Item eventKey="stanica2">
              Demanovaska Dolina
            </Dropdown.Item>
          </DropdownButton>
        )}
      </Col>
      <Col xs={4}>
        {appContext.authData.isAuth && (
          <Button
            variant="primary"
            onClick={() => appContext.authData.logout()}
          >
            Logout
          </Button>
        )}
        {!appContext.authData.isAuth && (
          <Button variant="primary" onClick={() => appContext.authData.login()}>
            Login
          </Button>
        )}
      </Col>
    </Row>
  </Container>
));

export default Header;
