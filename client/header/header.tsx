/* eslint-disable no-param-reassign */
import { observer } from "mobx-react";
import React from "react";
import { Row, Col, Button, Dropdown, DropdownButton } from "react-bootstrap";
import { AppContext } from "..";
import { DOM_MEASUREMENTS, DOM_MEASUREMENTS_DESC } from "../../common/domModel";
import { StationGarni1025ArcusCfg } from "../../common/stationGarni1025ArcusCfg";
import { StationGoGenMe3900Cfg } from "../../common/stationGoGenMe3900Cfg";
import {
  STATION_MEASUREMENTS,
  STATION_MEASUREMENTS_DESC,
} from "../../common/stationModel";
import { MyContainer } from "../data/mycontainer";
import StationCtrl from "../station/stationCtrl";
import StationData from "../station/stationData";
import Text from "../text/text";

type HeaderProps = {
  appContext: AppContext;
};

const Header = observer(({ appContext }: HeaderProps) => (
  <MyContainer>
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
              appContext.headerData.setId(e);
              if (appContext.headerData.id === "station_1") {
                appContext.chartsData.setMeasurements(STATION_MEASUREMENTS);
                appContext.chartsData.setMeasurementObject(
                  STATION_MEASUREMENTS_DESC.TEMPERATURE
                );
                appContext.stationCtrl.stop();
                appContext.stationData = new StationData();

                appContext.stationCtrl = new StationCtrl(
                  appContext.socket,
                  appContext.stationData,
                  appContext.authData,
                  appContext.chartsCtrl,
                  new StationGoGenMe3900Cfg()
                );
                appContext.stationCtrl.start();
              } else if (appContext.headerData.id === "dom") {
                appContext.chartsData.setMeasurements(DOM_MEASUREMENTS);
                appContext.chartsData.setMeasurementObject(
                  DOM_MEASUREMENTS_DESC.LIVING_ROOM_AIR
                );
              } else if (appContext.headerData.id === "station_2") {
                appContext.chartsData.setMeasurements(STATION_MEASUREMENTS);
                appContext.chartsData.setMeasurementObject(
                  STATION_MEASUREMENTS_DESC.TEMPERATURE
                );
                appContext.stationCtrl.stop();
                appContext.stationData = new StationData();

                appContext.stationCtrl = new StationCtrl(
                  appContext.socket,
                  appContext.stationData,
                  appContext.authData,
                  appContext.chartsCtrl,
                  new StationGarni1025ArcusCfg()
                );
                appContext.stationCtrl.start();
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
            <Dropdown.Item eventKey="station_1">
              Marianka - Station
            </Dropdown.Item>
            <Dropdown.Item eventKey="dom">Marianka - Dom</Dropdown.Item>
            <Dropdown.Item eventKey="station_2">
              Demanovska Dolina
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
  </MyContainer>
));

export default Header;
