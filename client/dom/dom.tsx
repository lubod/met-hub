/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { observer } from "mobx-react";
import moment from "moment";
import Text from "../misc/text";
import Room from "./room/room";
import DataWithTrend from "../misc/dataWithTrend";
import { DOM_MEASUREMENTS_DESC } from "../../common/domModel";
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
    appContext.domCtrl.domData.oldData
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
                      "DD MMM YYYY"
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
                      "HH:mm:ss"
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
              label={DOM_MEASUREMENTS_DESC.TEMPERATURE.label}
              value={
                appContext.domCtrl.domData.oldData
                  ? null
                  : appContext.domCtrl.domData.data.temp
              }
              unit={DOM_MEASUREMENTS_DESC.TEMPERATURE.unit}
              fix={DOM_MEASUREMENTS_DESC.TEMPERATURE.fix}
              data={appContext.domCtrl.domData.trendData.temp}
              range={DOM_MEASUREMENTS_DESC.TEMPERATURE.range}
              couldBeNegative={DOM_MEASUREMENTS_DESC.TEMPERATURE.couldBeNegative}
              onClick={() =>
                appContext.setMeasurementAndLoad(
                  DOM_MEASUREMENTS_DESC.TEMPERATURE
                )
              } // todo
              color={DOM_MEASUREMENTS_DESC.TEMPERATURE.color}
            />
          </Col>
          <Col xs={3}>
            <DataWithTrend
              label={DOM_MEASUREMENTS_DESC.HUMIDITY.label}
              value={
                appContext.domCtrl.domData.oldData
                  ? null
                  : appContext.domCtrl.domData.data.humidity
              }
              unit={DOM_MEASUREMENTS_DESC.HUMIDITY.unit}
              fix={DOM_MEASUREMENTS_DESC.HUMIDITY.fix}
              data={appContext.domCtrl.domData.trendData.humidity}
              range={DOM_MEASUREMENTS_DESC.HUMIDITY.range}
              couldBeNegative={DOM_MEASUREMENTS_DESC.HUMIDITY.couldBeNegative}
              onClick={() =>
                appContext.setMeasurementAndLoad(DOM_MEASUREMENTS_DESC.HUMIDITY)
              }
              color={DOM_MEASUREMENTS_DESC.HUMIDITY.color}
            />
          </Col>
          <Col xs={3}>
            <DataWithTrend
              label={DOM_MEASUREMENTS_DESC.RAIN.label}
              value={
                appContext.domCtrl.domData.oldData
                  ? null
                  : appContext.domCtrl.domData.data.rain
              }
              unit={DOM_MEASUREMENTS_DESC.RAIN.unit}
              fix={DOM_MEASUREMENTS_DESC.RAIN.fix}
              data={appContext.domCtrl.domData.trendData.rain}
              range={DOM_MEASUREMENTS_DESC.RAIN.range}
              couldBeNegative={DOM_MEASUREMENTS_DESC.RAIN.couldBeNegative}
              onClick={() =>
                appContext.setMeasurementAndLoad(DOM_MEASUREMENTS_DESC.RAIN)
              } // todo
              color={DOM_MEASUREMENTS_DESC.RAIN.color}
            />
          </Col>
          <Col xs={3}>
            <DataWithTrend
              label={DOM_MEASUREMENTS_DESC.TARIF.label}
              value={
                appContext.domCtrl.domData.oldData
                  ? null
                  : appContext.domCtrl.domData.data.tarif
              }
              unit={DOM_MEASUREMENTS_DESC.TARIF.unit}
              fix={DOM_MEASUREMENTS_DESC.TARIF.fix}
              data={appContext.domCtrl.domData.trendData.tarif}
              range={DOM_MEASUREMENTS_DESC.TARIF.range}
              couldBeNegative={DOM_MEASUREMENTS_DESC.TARIF.couldBeNegative}
              onClick={() =>
                appContext.setMeasurementAndLoad(DOM_MEASUREMENTS_DESC.TARIF)
              } // todo
              color={DOM_MEASUREMENTS_DESC.TARIF.color}
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
          floorTrend={appContext.domCtrl.domData.trendData.obyvacka_podlaha}
          airTrend={appContext.domCtrl.domData.trendData.obyvacka_vzduch}
          air={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.obyvacka_vzduch
          }
          floor={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.obyvacka_podlaha
          }
          required={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.obyvacka_reqall
          }
          heat={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.obyvacka_kuri
          }
          summer={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.obyvacka_leto
          }
          low={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.obyvacka_low
          }
          authData={appContext.authCtrl.authData}
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
        <Myhr />
        <Room
          room="GUEST ROOM"
          floorTrend={appContext.domCtrl.domData.trendData.pracovna_podlaha}
          airTrend={appContext.domCtrl.domData.trendData.pracovna_vzduch}
          air={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.pracovna_vzduch
          }
          floor={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.pracovna_podlaha
          }
          required={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.pracovna_reqall
          }
          heat={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.pracovna_kuri
          }
          summer={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.pracovna_leto
          }
          low={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.pracovna_low
          }
          authData={appContext.authCtrl.authData}
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
        <Myhr />
        <Room
          room="BED ROOM"
          floorTrend={appContext.domCtrl.domData.trendData.spalna_podlaha}
          airTrend={appContext.domCtrl.domData.trendData.spalna_vzduch}
          air={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.spalna_vzduch
          }
          floor={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.spalna_podlaha
          }
          required={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.spalna_reqall
          }
          heat={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.spalna_kuri
          }
          summer={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.spalna_leto
          }
          low={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.spalna_low
          }
          authData={appContext.authCtrl.authData}
          onClickAir={() =>
            appContext.setMeasurementAndLoad(DOM_MEASUREMENTS_DESC.BED_ROOM_AIR)
          }
          onClickFloor={() =>
            appContext.setMeasurementAndLoad(
              DOM_MEASUREMENTS_DESC.BED_ROOM_FLOOR
            )
          }
        />
        <Myhr />
        <Room
          room="BOYS"
          floorTrend={appContext.domCtrl.domData.trendData.chalani_podlaha}
          airTrend={appContext.domCtrl.domData.trendData.chalani_vzduch}
          air={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.chalani_vzduch
          }
          floor={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.chalani_podlaha
          }
          required={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.chalani_reqall
          }
          heat={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.chalani_kuri
          }
          summer={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.chalani_leto
          }
          low={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.chalani_low
          }
          authData={appContext.authCtrl.authData}
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
        <Myhr />
        <Room
          room="PETRA"
          floorTrend={appContext.domCtrl.domData.trendData.petra_podlaha}
          airTrend={appContext.domCtrl.domData.trendData.petra_vzduch}
          air={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.petra_vzduch
          }
          floor={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.petra_podlaha
          }
          required={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.petra_reqall
          }
          heat={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.petra_kuri
          }
          summer={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.petra_leto
          }
          low={
            appContext.domCtrl.domData.oldData
              ? null
              : appContext.domCtrl.domData.data.petra_low
          }
          authData={appContext.authCtrl.authData}
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
      </MyContainer>
    </div>
  );
});

export default Dom;
