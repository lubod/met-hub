/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { observer } from "mobx-react";
import Text from "../text/text";
import Room from "../room/room";
import { AppContextP, DomDataP } from "..";
import DataWithTrend from "../dataWithTrend/dataWithTrend";
import MapModal from "../mapModal";

const Dom = observer(() => {
  const [modalShow, setModalShow] = React.useState(false);
  const appContext = useContext(AppContextP);
  const dom = useContext(DomDataP);

  const handleClose = () => {
    setModalShow(false);
  };

  const handleShow = () => {
    if (appContext.auth.isAuthenticated()) {
      setModalShow(true);
    }
  };

  console.info("dom render");

  return (
    <div className="main">
      <Container className="text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded">
        <Row className={dom.oldData ? "text-danger" : ""}>
          <Col xs={4} onClick={handleShow}>
            <Text name="Place" value={dom.data.place} />
            <div onClick={(e) => e.stopPropagation()}>
              <MapModal modalShow={modalShow} handleClose={handleClose} />
            </div>
          </Col>
          <Col xs={4}>
            <Text name="Date" value={dom.data.date} />
          </Col>
          <Col xs={4}>
            <Text name="Time" value={dom.data.time} />
          </Col>
        </Row>
      </Container>
      <Container className="text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded">
        <div className="text-left font-weight-bold">GARDEN HOUSE</div>
        <Row>
          <Col xs={4}>
            <DataWithTrend
              name="Temperature"
              value={dom.oldData ? null : dom.data.temp}
              unit="°C"
              fix={1}
              data={dom.trendData.temp}
              range={1.6}
              couldBeNegative
              measurement="vonku:temp"
            />
          </Col>
          <Col xs={4}>
            <DataWithTrend
              name="Humidity"
              value={dom.oldData ? null : dom.data.humidity}
              unit="%"
              fix={0}
              data={dom.trendData.humidity}
              range={10}
              couldBeNegative={false}
              measurement="vonku:humidity"
            />
          </Col>
          <Col xs={4}>
            <DataWithTrend
              name="Rain"
              value={dom.oldData ? null : dom.data.rain}
              unit=""
              fix={0}
              data={dom.trendData.rain}
              range={1}
              couldBeNegative={false}
              measurement="vonku:rain"
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
          floorTrend={dom.trendData.obyvacka_podlaha}
          airTrend={dom.trendData.obyvacka_vzduch}
          air={dom.oldData ? null : dom.data.obyvacka_vzduch}
          floor={dom.oldData ? null : dom.data.obyvacka_podlaha}
          required={dom.oldData ? null : dom.data.obyvacka_reqall}
          heat={dom.oldData ? null : dom.data.obyvacka_kuri}
          summer={dom.oldData ? null : dom.data.obyvacka_leto}
          low={dom.oldData ? null : dom.data.obyvacka_low}
          measurementAir="obyvacka_vzduch:temp:reqall"
          measurementFloor="obyvacka_podlaha:temp:kuri"
        />
        <Room
          room="Guest room"
          floorTrend={dom.trendData.pracovna_podlaha}
          airTrend={dom.trendData.pracovna_vzduch}
          air={dom.oldData ? null : dom.data.pracovna_vzduch}
          floor={dom.oldData ? null : dom.data.pracovna_podlaha}
          required={dom.oldData ? null : dom.data.pracovna_reqall}
          heat={dom.oldData ? null : dom.data.pracovna_kuri}
          summer={dom.oldData ? null : dom.data.pracovna_leto}
          low={dom.oldData ? null : dom.data.pracovna_low}
          measurementAir="pracovna_vzduch:temp:reqall"
          measurementFloor="pracovna_podlaha:temp:kuri"
        />
        <Room
          room="Bed room"
          floorTrend={dom.trendData.spalna_podlaha}
          airTrend={dom.trendData.spalna_vzduch}
          air={dom.oldData ? null : dom.data.spalna_vzduch}
          floor={dom.oldData ? null : dom.data.spalna_podlaha}
          required={dom.oldData ? null : dom.data.spalna_reqall}
          heat={dom.oldData ? null : dom.data.spalna_kuri}
          summer={dom.oldData ? null : dom.data.spalna_leto}
          low={dom.oldData ? null : dom.data.spalna_low}
          measurementAir="spalna_vzduch:temp:reqall"
          measurementFloor="spalna_podlaha:temp:kuri"
        />
        <Room
          room="Boys"
          floorTrend={dom.trendData.chalani_podlaha}
          airTrend={dom.trendData.chalani_vzduch}
          air={dom.oldData ? null : dom.data.chalani_vzduch}
          floor={dom.oldData ? null : dom.data.chalani_podlaha}
          required={dom.oldData ? null : dom.data.chalani_reqall}
          heat={dom.oldData ? null : dom.data.chalani_kuri}
          summer={dom.oldData ? null : dom.data.chalani_leto}
          low={dom.oldData ? null : dom.data.chalani_low}
          measurementAir="chalani_vzduch:temp:reqall"
          measurementFloor="chalani_podlaha:temp:kuri"
        />
        <Room
          room="Petra"
          floorTrend={dom.trendData.petra_podlaha}
          airTrend={dom.trendData.petra_vzduch}
          air={dom.oldData ? null : dom.data.petra_vzduch}
          floor={dom.oldData ? null : dom.data.petra_podlaha}
          required={dom.oldData ? null : dom.data.petra_reqall}
          heat={dom.oldData ? null : dom.data.petra_kuri}
          summer={dom.oldData ? null : dom.data.petra_leto}
          low={dom.oldData ? null : dom.data.petra_low}
          measurementAir="petra_vzduch:temp:reqall"
          measurementFloor="petra_podlaha:temp:kuri"
        />
      </Container>
    </div>
  );
});

export default Dom;
