/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { observer } from "mobx-react";
import Text from "../text/text";
import Room from "./room/room";
import DataWithTrend from "../dataWithTrend/dataWithTrend";
import { DOM_MEASUREMENTS_DESC } from "../../common/domModel";
import { AppContext } from "..";

type DomProps = {
  appContext: AppContext;
};

const Dom = observer(({ appContext }: DomProps) => {
  console.info(
    "dom render",
    appContext.authData.isAuth,
    appContext.domData.oldData
  );

  return (
    <div className="main">
      <Container className="text-center text-light border-secondary bg-very-dark rounded mb-2 py-2">
        <Row className="mt-3">
          <Col xs={6} className="text-left font-weight-bold">
            <div>CURRENT DATA</div>
          </Col>
          <Col xs={4} />
          <Col xs={2}>
            <Button
              variant="link btn-sm"
              onClick={() => {
                appContext.domCtrl.fetchData();
                appContext.domCtrl.fetchTrendData();
              }}
            >
              <img src="icons8-refresh-25.svg" alt="" />
            </Button>
          </Col>
        </Row>
        <Row className={appContext.domData.oldData ? "text-danger" : ""}>
          <Col xs={4}>
            <Text name="Place" value={appContext.domData.data.place} />
          </Col>
          <Col xs={4}>
            <Text name="Date" value={appContext.domData.data.date} />
          </Col>
          <Col xs={4}>
            <Text name="Data time" value={appContext.domData.data.time} />
          </Col>
        </Row>
        <hr />
        <div className="text-left font-weight-bold">GARDEN HOUSE</div>
        <Row>
          <Col xs={4}>
            <DataWithTrend
              label="Temperature"
              value={
                appContext.domData.oldData ? null : appContext.domData.data.temp
              }
              unit="°C"
              fix={1}
              data={appContext.domData.trendData.temp}
              range={1.6}
              couldBeNegative
              onClick={() =>
                appContext.setMeasurementAndLoad(
                  DOM_MEASUREMENTS_DESC.TEMPERATURE
                )
              } // todo
              color={DOM_MEASUREMENTS_DESC.TEMPERATURE.color}
            />
          </Col>
          <Col xs={4}>
            <DataWithTrend
              label="Humidity"
              value={
                appContext.domData.oldData
                  ? null
                  : appContext.domData.data.humidity
              }
              unit="%"
              fix={0}
              data={appContext.domData.trendData.humidity}
              range={10}
              couldBeNegative={false}
              onClick={() =>
                appContext.setMeasurementAndLoad(DOM_MEASUREMENTS_DESC.HUMIDITY)
              }
              color={DOM_MEASUREMENTS_DESC.HUMIDITY.color}
            />
          </Col>
          <Col xs={4}>
            <DataWithTrend
              label="Rain"
              value={
                appContext.domData.oldData ? null : appContext.domData.data.rain
              }
              unit=""
              fix={0}
              data={appContext.domData.trendData.rain}
              range={1}
              couldBeNegative={false}
              onClick={() =>
                appContext.setMeasurementAndLoad(DOM_MEASUREMENTS_DESC.RAIN)
              } // todo
              color={DOM_MEASUREMENTS_DESC.RAIN.color}
            />
          </Col>
        </Row>
        <hr />
        <Row className="text-left text-info font-weight-bold">
          <Col xs={3}>Air</Col>
          <Col xs={3}>Floor</Col>
          <Col xs={3}>Req</Col>
          <Col xs={2}>HSL</Col>
        </Row>
        <Room
          room="LIVING ROOM"
          floorTrend={appContext.domData.trendData.obyvacka_podlaha}
          airTrend={appContext.domData.trendData.obyvacka_vzduch}
          air={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.obyvacka_vzduch
          }
          floor={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.obyvacka_podlaha
          }
          required={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.obyvacka_reqall
          }
          heat={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.obyvacka_kuri
          }
          summer={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.obyvacka_leto
          }
          low={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.obyvacka_low
          }
          authData={appContext.authData}
          onClickAir={() =>
            appContext.setMeasurementAndLoad(
              DOM_MEASUREMENTS_DESC.LIVING_ROOM_AIR
            )
          }
          onClickFloor={() =>
            appContext.setMeasurementAndLoad(
              DOM_MEASUREMENTS_DESC.LIVING_ROOM_FLOOR
            )
          }
        />
        <hr />
        <Room
          room="GUEST ROOM"
          floorTrend={appContext.domData.trendData.pracovna_podlaha}
          airTrend={appContext.domData.trendData.pracovna_vzduch}
          air={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.pracovna_vzduch
          }
          floor={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.pracovna_podlaha
          }
          required={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.pracovna_reqall
          }
          heat={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.pracovna_kuri
          }
          summer={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.pracovna_leto
          }
          low={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.pracovna_low
          }
          authData={appContext.authData}
          onClickAir={() =>
            appContext.setMeasurementAndLoad(
              DOM_MEASUREMENTS_DESC.GUEST_ROOM_AIR
            )
          }
          onClickFloor={() =>
            appContext.setMeasurementAndLoad(
              DOM_MEASUREMENTS_DESC.GUEST_ROOM_FLOOR
            )
          }
        />
        <hr />
        <Room
          room="BED ROOM"
          floorTrend={appContext.domData.trendData.spalna_podlaha}
          airTrend={appContext.domData.trendData.spalna_vzduch}
          air={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.spalna_vzduch
          }
          floor={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.spalna_podlaha
          }
          required={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.spalna_reqall
          }
          heat={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.spalna_kuri
          }
          summer={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.spalna_leto
          }
          low={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.spalna_low
          }
          authData={appContext.authData}
          onClickAir={() =>
            appContext.setMeasurementAndLoad(DOM_MEASUREMENTS_DESC.BED_ROOM_AIR)
          }
          onClickFloor={() =>
            appContext.setMeasurementAndLoad(
              DOM_MEASUREMENTS_DESC.BED_ROOM_FLOOR
            )
          }
        />
        <hr />
        <Room
          room="BOYS"
          floorTrend={appContext.domData.trendData.chalani_podlaha}
          airTrend={appContext.domData.trendData.chalani_vzduch}
          air={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.chalani_vzduch
          }
          floor={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.chalani_podlaha
          }
          required={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.chalani_reqall
          }
          heat={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.chalani_kuri
          }
          summer={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.chalani_leto
          }
          low={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.chalani_low
          }
          authData={appContext.authData}
          onClickAir={() =>
            appContext.setMeasurementAndLoad(
              DOM_MEASUREMENTS_DESC.BOYS_ROOM_AIR
            )
          }
          onClickFloor={() =>
            appContext.setMeasurementAndLoad(
              DOM_MEASUREMENTS_DESC.BOYS_ROOM_FLOOR
            )
          }
        />
        <hr />
        <Room
          room="PETRA"
          floorTrend={appContext.domData.trendData.petra_podlaha}
          airTrend={appContext.domData.trendData.petra_vzduch}
          air={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.petra_vzduch
          }
          floor={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.petra_podlaha
          }
          required={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.petra_reqall
          }
          heat={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.petra_kuri
          }
          summer={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.petra_leto
          }
          low={
            appContext.domData.oldData
              ? null
              : appContext.domData.data.petra_low
          }
          authData={appContext.authData}
          onClickAir={() =>
            appContext.setMeasurementAndLoad(
              DOM_MEASUREMENTS_DESC.PETRA_ROOM_AIR
            )
          }
          onClickFloor={() =>
            appContext.setMeasurementAndLoad(
              DOM_MEASUREMENTS_DESC.PETRA_ROOM_FLOOR
            )
          }
        />
      </Container>
    </div>
  );
});

export default Dom;
