/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { observer } from "mobx-react";
import Text from "../text/text";
import Room from "../room/room";
import DataWithTrend from "../dataWithTrend/dataWithTrend";
import MapModal from "../mapModal";
import DomData from "./domData";
import { AuthData } from "../auth";

type DomProps = {
  domData: DomData;
  authData: AuthData;
};

const Dom = observer(({ domData, authData }: DomProps) => {
  const [modalShow, setModalShow] = React.useState(false);

  const handleClose = () => {
    setModalShow(false);
  };

  const handleShow = () => {
    if (authData.isAuth) {
      setModalShow(true);
    }
  };

  console.info("dom render", authData.isAuth, domData.oldData);

  return (
    <div className="main">
      <Container className="text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded">
        <Row className={domData.oldData ? "text-danger" : ""}>
          <Col xs={4} onClick={handleShow}>
            <Text name="Place" value={domData.data.place} />
            <div onClick={(e) => e.stopPropagation()}>
              <MapModal modalShow={modalShow} handleClose={handleClose} />
            </div>
          </Col>
          <Col xs={4}>
            <Text name="Date" value={domData.data.date} />
          </Col>
          <Col xs={4}>
            <Text name="Data time" value={domData.data.time} />
          </Col>
        </Row>
      </Container>
      <Container className="text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded">
        <div className="text-left font-weight-bold">GARDEN HOUSE</div>
        <Row>
          <Col xs={4}>
            <DataWithTrend
              name="Temperature"
              value={domData.oldData ? null : domData.data.temp}
              unit="°C"
              fix={1}
              data={domData.trendData.temp}
              range={1.6}
              couldBeNegative
              measurement="vonku:temp"
              authData={authData}
            />
          </Col>
          <Col xs={4}>
            <DataWithTrend
              name="Humidity"
              value={domData.oldData ? null : domData.data.humidity}
              unit="%"
              fix={0}
              data={domData.trendData.humidity}
              range={10}
              couldBeNegative={false}
              measurement="vonku:humidity"
              authData={authData}
            />
          </Col>
          <Col xs={4}>
            <DataWithTrend
              name="Rain"
              value={domData.oldData ? null : domData.data.rain}
              unit=""
              fix={0}
              data={domData.trendData.rain}
              range={1}
              couldBeNegative={false}
              measurement="vonku:rain"
              authData={authData}
            />
          </Col>
        </Row>
      </Container>
      <Container className="text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded">
        <Row className="text-left text-info font-weight-bold">
          <Col xs={3}>Air</Col>
          <Col xs={3}>Floor</Col>
          <Col xs={3}>Req</Col>
          <Col xs={2}>HSL</Col>
        </Row>
        <Room
          room="Living room"
          floorTrend={domData.trendData.obyvacka_podlaha}
          airTrend={domData.trendData.obyvacka_vzduch}
          air={domData.oldData ? null : domData.data.obyvacka_vzduch}
          floor={domData.oldData ? null : domData.data.obyvacka_podlaha}
          required={domData.oldData ? null : domData.data.obyvacka_reqall}
          heat={domData.oldData ? null : domData.data.obyvacka_kuri}
          summer={domData.oldData ? null : domData.data.obyvacka_leto}
          low={domData.oldData ? null : domData.data.obyvacka_low}
          measurementAir="obyvacka_vzduch:temp:reqall"
          measurementFloor="obyvacka_podlaha:temp:kuri"
          authData={authData}
        />
        <Room
          room="Guest room"
          floorTrend={domData.trendData.pracovna_podlaha}
          airTrend={domData.trendData.pracovna_vzduch}
          air={domData.oldData ? null : domData.data.pracovna_vzduch}
          floor={domData.oldData ? null : domData.data.pracovna_podlaha}
          required={domData.oldData ? null : domData.data.pracovna_reqall}
          heat={domData.oldData ? null : domData.data.pracovna_kuri}
          summer={domData.oldData ? null : domData.data.pracovna_leto}
          low={domData.oldData ? null : domData.data.pracovna_low}
          measurementAir="pracovna_vzduch:temp:reqall"
          measurementFloor="pracovna_podlaha:temp:kuri"
          authData={authData}
        />
        <Room
          room="Bed room"
          floorTrend={domData.trendData.spalna_podlaha}
          airTrend={domData.trendData.spalna_vzduch}
          air={domData.oldData ? null : domData.data.spalna_vzduch}
          floor={domData.oldData ? null : domData.data.spalna_podlaha}
          required={domData.oldData ? null : domData.data.spalna_reqall}
          heat={domData.oldData ? null : domData.data.spalna_kuri}
          summer={domData.oldData ? null : domData.data.spalna_leto}
          low={domData.oldData ? null : domData.data.spalna_low}
          measurementAir="spalna_vzduch:temp:reqall"
          measurementFloor="spalna_podlaha:temp:kuri"
          authData={authData}
        />
        <Room
          room="Boys"
          floorTrend={domData.trendData.chalani_podlaha}
          airTrend={domData.trendData.chalani_vzduch}
          air={domData.oldData ? null : domData.data.chalani_vzduch}
          floor={domData.oldData ? null : domData.data.chalani_podlaha}
          required={domData.oldData ? null : domData.data.chalani_reqall}
          heat={domData.oldData ? null : domData.data.chalani_kuri}
          summer={domData.oldData ? null : domData.data.chalani_leto}
          low={domData.oldData ? null : domData.data.chalani_low}
          measurementAir="chalani_vzduch:temp:reqall"
          measurementFloor="chalani_podlaha:temp:kuri"
          authData={authData}
        />
        <Room
          room="Petra"
          floorTrend={domData.trendData.petra_podlaha}
          airTrend={domData.trendData.petra_vzduch}
          air={domData.oldData ? null : domData.data.petra_vzduch}
          floor={domData.oldData ? null : domData.data.petra_podlaha}
          required={domData.oldData ? null : domData.data.petra_reqall}
          heat={domData.oldData ? null : domData.data.petra_kuri}
          summer={domData.oldData ? null : domData.data.petra_leto}
          low={domData.oldData ? null : domData.data.petra_low}
          measurementAir="petra_vzduch:temp:reqall"
          measurementFloor="petra_podlaha:temp:kuri"
          authData={authData}
        />
      </Container>
    </div>
  );
});

export default Dom;
