/* eslint-disable no-param-reassign */
import { observer } from "mobx-react";
import moment from "moment";
import React from "react";
import { Row, Col, Button, Dropdown, DropdownButton } from "react-bootstrap";
import { isMobile } from "react-device-detect";
import { AppContext } from "..";
import { AllStationsCfgClient } from "../../common/allStationsCfgClient";
import { MyContainer } from "../misc/mycontainer";
import Text from "../misc/text";
import AddStation from "./addStation";

type Props = {
  appContext: AppContext;
};

const Header = observer(({ appContext }: Props) => {
  // console.info("Header render");
  const { station } = appContext.headerCtrl.headerData;

  let place: string = "";
  if (station != null) {
    place = station.place;

    if (place.length > 8 && isMobile) {
      place = `${place.substring(0, 7)}~`;
    }

    if (place.length > 60) {
      place = `${place.substring(0, 59)}~`;
    }
  }

  return (
    <>
      <MyContainer>
        <Row className="align-items-center">
          <Col xs={4}>
            <Text
              name="Current time"
              value={moment(appContext.headerCtrl.headerData.ctime).format(
                "HH:mm:ss",
              )}
            />
          </Col>
          <Col xs={4}>
            {appContext.headerCtrl.headerData.isExternalID === false &&
              appContext.headerCtrl.headerData.allStations != null && (
                <DropdownButton
                  id="dropdown-place-button"
                  title={place}
                  onSelect={(stationID) => {
                    const selectedStation =
                      AllStationsCfgClient.getStationByID(stationID);
                    appContext.setStation(selectedStation);
                  }}
                >
                  {appContext.headerCtrl.headerData.allStations.map((s) => (
                    <Dropdown.Item key={s.id} eventKey={s.id}>
                      {s.place}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              )}
            {appContext.headerCtrl.headerData.isExternalID === true && (
              <Text
                name=""
                value={appContext.headerCtrl.headerData.station.place}
              />
            )}
          </Col>
          {appContext.headerCtrl.headerData.isExternalID === false && (
            <Col xs={4}>
              {appContext.authCtrl.authData.isAuth && (
                <>
                  <Button
                    variant="primary"
                    onClick={() => appContext.authCtrl.logout()}
                    className="me-2"
                  >
                    {appContext.authCtrl.authData.given_name.charAt(0) +
                      appContext.authCtrl.authData.family_name.charAt(0)}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      appContext.headerCtrl.headerData.setShowModal(true)
                    }
                  >
                    Add
                  </Button>
                </>
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
      <AddStation appContext={appContext} />
    </>
  );
});

export default Header;
