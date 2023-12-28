/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { observer } from "mobx-react";
import moment from "moment";
import Text from "../misc/text";
import Room from "./room/room";
import DataWithTrend from "../misc/dataWithTrend";
import { DOM_SENSORS_DESC } from "../../common/domModel";
import { AppContext } from "..";
import { LoadImg } from "../misc/loadImg";
import { Myhr } from "../misc/myhr";
import { MyContainer } from "../misc/mycontainer";

type DomProps = {
  appContext: AppContext;
};

const Dom = observer(({ appContext }: DomProps) => {
  console.info(
    "dom render",
    appContext.authCtrl.authData.isAuth,
    appContext.domCtrl.domData.oldData,
  );

  return (
    <div className="main">
      <MyContainer>
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
              <LoadImg
                rotate={
                  appContext.domCtrl.domData.loading ||
                  appContext.domCtrl.domData.oldData
                }
                src="icons8-refresh-25.svg"
                alt=""
              />
            </Button>
          </Col>
        </Row>
        <Row
          className={appContext.domCtrl.domData.oldData ? "text-danger" : ""}
        >
          <Col xs={6}>
            <Text
              name="Data date"
              value={
                appContext.domCtrl.domData.data.timestamp === null
                  ? "-"
                  : moment(appContext.domCtrl.domData.data.timestamp).format(
                      "DD MMM YYYY",
                    )
              }
            />
          </Col>
          <Col xs={6}>
            <Text
              name="Data time"
              value={
                appContext.domCtrl.domData.data.timestamp === null
                  ? "-"
                  : moment(appContext.domCtrl.domData.data.timestamp).format(
                      "HH:mm:ss",
                    )
              }
            />
          </Col>
        </Row>
        <Myhr />
        <div className="text-left font-weight-bold">GARDEN HOUSE</div>
        <Row>
          <Col xs={3}>
            <DataWithTrend
              label={DOM_SENSORS_DESC.TEMPERATURE.label}
              value={
                appContext.domCtrl.domData.oldData
                  ? null
                  : appContext.domCtrl.domData.data.temp
              }
              unit={DOM_SENSORS_DESC.TEMPERATURE.unit}
              fix={DOM_SENSORS_DESC.TEMPERATURE.fix}
              data={appContext.domCtrl.domData.trendData.temp}
              range={DOM_SENSORS_DESC.TEMPERATURE.range}
              couldBeNegative={DOM_SENSORS_DESC.TEMPERATURE.couldBeNegative}
              onClick={() =>
                appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.TEMPERATURE)
              } // todo
              color={DOM_SENSORS_DESC.TEMPERATURE.color}
            />
          </Col>
          <Col xs={3}>
            <DataWithTrend
              label={DOM_SENSORS_DESC.HUMIDITY.label}
              value={
                appContext.domCtrl.domData.oldData
                  ? null
                  : appContext.domCtrl.domData.data.humidity
              }
              unit={DOM_SENSORS_DESC.HUMIDITY.unit}
              fix={DOM_SENSORS_DESC.HUMIDITY.fix}
              data={appContext.domCtrl.domData.trendData.humidity}
              range={DOM_SENSORS_DESC.HUMIDITY.range}
              couldBeNegative={DOM_SENSORS_DESC.HUMIDITY.couldBeNegative}
              onClick={() =>
                appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.HUMIDITY)
              }
              color={DOM_SENSORS_DESC.HUMIDITY.color}
            />
          </Col>
          <Col xs={3}>
            <DataWithTrend
              label={DOM_SENSORS_DESC.RAIN.label}
              value={
                appContext.domCtrl.domData.oldData
                  ? null
                  : Number(appContext.domCtrl.domData.data.rain)
              }
              unit={DOM_SENSORS_DESC.RAIN.unit}
              fix={DOM_SENSORS_DESC.RAIN.fix}
              data={appContext.domCtrl.domData.trendData.rain.map((x) => Number(x))}
              range={DOM_SENSORS_DESC.RAIN.range}
              couldBeNegative={DOM_SENSORS_DESC.RAIN.couldBeNegative}
              onClick={() =>
                appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.RAIN)
              } // todo
              color={DOM_SENSORS_DESC.RAIN.color}
            />
          </Col>
          <Col xs={3}>
            <DataWithTrend
              label={DOM_SENSORS_DESC.TARIF.label}
              value={
                appContext.domCtrl.domData.oldData
                  ? null
                  : appContext.domCtrl.domData.data.tarif
              }
              unit={DOM_SENSORS_DESC.TARIF.unit}
              fix={DOM_SENSORS_DESC.TARIF.fix}
              data={appContext.domCtrl.domData.trendData.tarif}
              range={DOM_SENSORS_DESC.TARIF.range}
              couldBeNegative={DOM_SENSORS_DESC.TARIF.couldBeNegative}
              onClick={() =>
                appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.TARIF)
              } // todo
              color={DOM_SENSORS_DESC.TARIF.color}
            />
          </Col>
        </Row>
        <Myhr />
        <Row className="text-left text-white-50 font-weight-bold">
          <Col xs={3}>Air</Col>
          <Col xs={3}>Floor</Col>
          <Col xs={3}>Req</Col>
          <Col xs={2}>HSL</Col>
        </Row>
        <Room
          room="LIVING ROOM"
          floorTrend={appContext.domCtrl.domData.trendData.living_room_floor}
          airTrend={appContext.domCtrl.domData.trendData.living_room_air}
          air={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.living_room_air
          }
          floor={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.living_room_floor
          }
          required={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.living_room_reqall
          }
          heat={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.living_room_heat
          }
          off={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.living_room_off
          }
          low={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.living_room_low
          }
          authData={appContext.authCtrl.authData}
          onClickAir={() =>
            appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.LIVING_ROOM_AIR)
          }
          onClickFloor={() =>
            appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.LIVING_ROOM_FLOOR)
          }
        />
        <Myhr />
        <Room
          room="GUEST ROOM"
          floorTrend={appContext.domCtrl.domData.trendData.guest_room_floor}
          airTrend={appContext.domCtrl.domData.trendData.guest_room_air}
          air={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.guest_room_air
          }
          floor={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.guest_room_floor
          }
          required={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.guest_room_reqall
          }
          heat={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.guest_room_heat
          }
          off={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.guest_room_off
          }
          low={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.guest_room_low
          }
          authData={appContext.authCtrl.authData}
          onClickAir={() =>
            appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.GUEST_ROOM_AIR)
          }
          onClickFloor={() =>
            appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.GUEST_ROOM_FLOOR)
          }
        />
        <Myhr />
        <Room
          room="BED ROOM"
          floorTrend={appContext.domCtrl.domData.trendData.bed_room_floor}
          airTrend={appContext.domCtrl.domData.trendData.bed_room_air}
          air={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.bed_room_air
          }
          floor={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.bed_room_floor
          }
          required={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.bed_room_reqall
          }
          heat={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.bed_room_heat
          }
          off={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.bed_room_off
          }
          low={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.bed_room_low
          }
          authData={appContext.authCtrl.authData}
          onClickAir={() =>
            appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.BED_ROOM_AIR)
          }
          onClickFloor={() =>
            appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.BED_ROOM_FLOOR)
          }
        />
        <Myhr />
        <Room
          room="BOYS"
          floorTrend={appContext.domCtrl.domData.trendData.boys_room_floor}
          airTrend={appContext.domCtrl.domData.trendData.boys_room_air}
          air={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.boys_room_air
          }
          floor={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.boys_room_floor
          }
          required={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.boys_room_reqall
          }
          heat={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.boys_room_heat
          }
          off={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.boys_room_off
          }
          low={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.boys_room_low
          }
          authData={appContext.authCtrl.authData}
          onClickAir={() =>
            appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.BOYS_ROOM_AIR)
          }
          onClickFloor={() =>
            appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.BOYS_ROOM_FLOOR)
          }
        />
        <Myhr />
        <Room
          room="PETRA"
          floorTrend={appContext.domCtrl.domData.trendData.petra_room_floor}
          airTrend={appContext.domCtrl.domData.trendData.petra_room_air}
          air={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.petra_room_air
          }
          floor={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.petra_room_floor
          }
          required={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.petra_room_reqall
          }
          heat={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.petra_room_heat
          }
          off={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.petra_room_off
          }
          low={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.petra_room_low
          }
          authData={appContext.authCtrl.authData}
          onClickAir={() =>
            appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.PETRA_ROOM_AIR)
          }
          onClickFloor={() =>
            appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.PETRA_ROOM_FLOOR)
          }
        />
      </MyContainer>
    </div>
  );
});

export default Dom;
