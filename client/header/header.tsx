/* eslint-disable no-param-reassign */
import { observer } from "mobx-react";
import moment from "moment";
import React from "react";
import { Row, Col, Button, Dropdown, DropdownButton } from "react-bootstrap";
import { isMobile } from "react-device-detect";
import { AppContext } from "..";
import { AllStationsCfgClient } from "../../common/allStationsCfgClient";
import { DOM_MEASUREMENTS, DOM_MEASUREMENTS_DESC } from "../../common/domModel";
import {
  STATION_MEASUREMENTS,
  STATION_MEASUREMENTS_DESC,
} from "../../common/stationModel";
import { MyContainer } from "../misc/mycontainer";
import Text from "../misc/text";

type Props = {
  appContext: AppContext;
};

const Header = observer(({ appContext }: Props) => {
  let { place } = AllStationsCfgClient.getStationByID(
    appContext.headerCtrl.headerData.stationID
  );

  if (place.length > 8 && isMobile) {
    place = `${place.substring(0, 7)}~`;
  }

  if (place.length > 60) {
    place = `${place.substring(0, 59)}~`;
  }

  return (
    <MyContainer>
      <Row className="align-items-center">
        <Col xs={4}>
          <Text
            name="Current time"
            value={moment(appContext.headerCtrl.headerData.ctime).format(
              "HH:mm:ss"
            )}
          />
        </Col>
        <Col xs={4}>
          {appContext.headerCtrl.headerData.isExternalID === false && (
            <DropdownButton
              id="dropdown-place-button"
              title={place}
              onSelect={(stationID) => {
                console.info("stationID", stationID);
                localStorage.setItem("lastStationID", stationID);
                appContext.headerCtrl.headerData.setStationID(stationID);
                if (appContext.headerCtrl.headerData.stationID === "dom") {
                  appContext.chartsCtrl.chartsData.setMeasurements(
                    DOM_MEASUREMENTS
                  );
                  appContext.chartsCtrl.chartsData.setMeasurementObject(
                    DOM_MEASUREMENTS_DESC.LIVING_ROOM_AIR
                  );
                  appContext.stationCtrl.stop();
                  appContext.domCtrl.start();
                } else {
                  // todo
                  appContext.chartsCtrl.chartsData.setMeasurements(
                    STATION_MEASUREMENTS
                  );
                  appContext.chartsCtrl.chartsData.setMeasurementObject(
                    STATION_MEASUREMENTS_DESC.TEMPERATURE
                  );
                  appContext.domCtrl.stop();
                  appContext.stationCtrl.setStation(stationID);
                }

                appContext.chartsCtrl.chartsData.setStationID(
                  stationID,
                  AllStationsCfgClient.getStationByID(stationID).lat,
                  AllStationsCfgClient.getStationByID(stationID).lon
                );
                appContext.chartsCtrl.reload();

                appContext.forecastCtrl.forecastData.setStationID(
                  stationID,
                  AllStationsCfgClient.getStationByID(stationID).lat,
                  AllStationsCfgClient.getStationByID(stationID).lon
                );
                appContext.forecastCtrl.fetchData(); // TODO
                appContext.forecastCtrl.fetchAstronomicalData(new Date());
              }}
            >
              {[...AllStationsCfgClient.getStations().entries()]
                .filter(
                  ([key, value]) =>
                    key != null &&
                    (value.public ||
                      (!value.public && appContext.authCtrl.authData.isAuth))
                )
                .map(([fkey, fvalue]) => (
                  <Dropdown.Item eventKey={fkey}>{fvalue.place}</Dropdown.Item>
                ))}
            </DropdownButton>
          )}
          {appContext.headerCtrl.headerData.isExternalID === true && (
            <Text
              name=""
              value={
                AllStationsCfgClient.getStationByID(
                  appContext.headerCtrl.headerData.stationID
                ).place
              }
            />
          )}
        </Col>
        {appContext.headerCtrl.headerData.isExternalID === false && (
          <Col xs={4}>
            {appContext.authCtrl.authData.isAuth && (
              <Button
                variant="primary"
                onClick={() => appContext.authCtrl.logout()}
              >
                Logout {appContext.authCtrl.authData.profile}
              </Button>
            )}
          </Col>
        )}
        {appContext.headerCtrl.headerData.isExternalID === true && (
          <Col xs={4}>
            <a href="https://www.met-hub.com">
              <Text name="Powered by" value="www.met-hub.com" />
            </a>
          </Col>
        )}
      </Row>
    </MyContainer>
  );
});

export default Header;
