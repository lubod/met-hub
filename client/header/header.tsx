/* eslint-disable no-param-reassign */
import { observer } from "mobx-react";
import moment from "moment";
import React from "react";
import { Row, Col, Button, Dropdown, DropdownButton } from "react-bootstrap";
import { AppContext } from "..";
import { AllStationsCfgClient } from "../../common/allStationsCfgClient";
import { DOM_MEASUREMENTS, DOM_MEASUREMENTS_DESC } from "../../common/domModel";
import {
  STATION_MEASUREMENTS,
  STATION_MEASUREMENTS_DESC,
} from "../../common/stationModel";
import { MyContainer } from "../data/mycontainer";
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
          value={moment(appContext.headerData.ctime).format("HH:mm:ss")}
        />
      </Col>
      <Col xs={4}>
        <DropdownButton
          id="dropdown-place-button"
          title={
            AllStationsCfgClient.getStationByID(appContext.headerData.stationID)
              .place
          }
          onSelect={(stationID) => {
            console.info("stationID", stationID);
            localStorage.setItem("lastStationID", stationID);
            appContext.headerData.setStationID(stationID);
            if (appContext.headerData.stationID === "dom") {
              appContext.chartsData.setMeasurements(DOM_MEASUREMENTS);
              appContext.chartsData.setMeasurementObject(
                DOM_MEASUREMENTS_DESC.LIVING_ROOM_AIR
              );
              appContext.stationCtrl.stop();
              appContext.domCtrl.start();
            } else {
              // todo
              appContext.chartsData.setMeasurements(STATION_MEASUREMENTS);
              appContext.chartsData.setMeasurementObject(
                STATION_MEASUREMENTS_DESC.TEMPERATURE
              );
              appContext.domCtrl.stop();
              appContext.stationCtrl.setStation(stationID);
            }

            appContext.chartsData.setStationID(
              stationID,
              AllStationsCfgClient.getStationByID(stationID).lat,
              AllStationsCfgClient.getStationByID(stationID).lon
            );
            appContext.chartsCtrl.reload();

            appContext.forecastData.setStationID(
              stationID,
              AllStationsCfgClient.getStationByID(stationID).lat,
              AllStationsCfgClient.getStationByID(stationID).lon
            );
            appContext.forecastCrtl.fetchData(); // TODO
            appContext.forecastCrtl.fetchAstronomicalData(new Date());
          }}
        >
          {[...AllStationsCfgClient.getStations().entries()]
            .filter(
              ([key, value]) =>
                key != null &&
                (value.public || (!value.public && appContext.authData.isAuth))
            )
            .map(([fkey, fvalue]) => (
              <Dropdown.Item eventKey={fkey}>{fvalue.place}</Dropdown.Item>
            ))}
        </DropdownButton>
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
