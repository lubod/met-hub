import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { observer } from 'mobx-react';
import Data from '../data/data';
import Text from '../text/text';
import Room from '../room/room';
import Trend from '../trend/trend';
import { DomDataP } from '..';

const Dom = observer(() => {
  console.info('dom render');

  const oldData = false;
  const dom = useContext(DomDataP);

  return (
    <div className="main">
      <Container className="text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded">
        <Row className={oldData ? 'text-danger' : ''}>
          <Col xs={4}>
            <Text name="Place" value={dom.data.place} />
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
            <Data name="Temperature" value={oldData ? null : dom.data.temp} unit="°C" fix={1} />
            <Trend data={dom.trendData.temp} range={2} />
          </Col>
          <Col xs={4}>
            <Data name="Humidity" value={oldData ? null : dom.data.humidity} unit="%" fix={0} />
            <Trend data={dom.trendData.humidity} range={10} />
          </Col>
          <Col xs={4}>
            <Data name="Rain" value={oldData ? null : dom.data.rain} unit="" fix={0} />
            <Trend data={dom.trendData.rain} range={1} />
          </Col>
        </Row>
      </Container>
      <Container className="text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded">
        <Row className="text-left text-info font-weight-bold">
          <Col xs={3}>
            Air
          </Col>
          <Col xs={3}>
            Floor
          </Col>
          <Col xs={3}>
            Req
          </Col>
          <Col xs={2}>
            HSL
          </Col>
        </Row>
        <Room
          room="Living room"
          floorTrend={dom.trendData.obyvacka_podlaha}
          airTrend={dom.trendData.obyvacka_vzduch}
          air={oldData ? null : dom.data.obyvacka_vzduch}
          floor={oldData ? null : dom.data.obyvacka_podlaha}
          required={oldData ? null : dom.data.obyvacka_req}
          heat={oldData ? null : dom.data.obyvacka_kuri}
          summer={oldData ? null : dom.data.obyvacka_leto}
          low={oldData ? null : dom.data.obyvacka_low}
        />
        <Room
          room="Guest room"
          floorTrend={dom.trendData.pracovna_podlaha}
          airTrend={dom.trendData.pracovna_vzduch}
          air={oldData ? null : dom.data.pracovna_vzduch}
          floor={oldData ? null : dom.data.pracovna_podlaha}
          required={oldData ? null : dom.data.pracovna_req}
          heat={oldData ? null : dom.data.pracovna_kuri}
          summer={oldData ? null : dom.data.pracovna_leto}
          low={oldData ? null : dom.data.pracovna_low}
        />
        <Room
          room="Bed room"
          floorTrend={dom.trendData.spalna_podlaha}
          airTrend={dom.trendData.spalna_vzduch}
          air={oldData ? null : dom.data.spalna_vzduch}
          floor={oldData ? null : dom.data.spalna_podlaha}
          required={oldData ? null : dom.data.spalna_req}
          heat={oldData ? null : dom.data.spalna_kuri}
          summer={oldData ? null : dom.data.spalna_leto}
          low={oldData ? null : dom.data.spalna_low}
        />
        <Room
          room="Boys"
          floorTrend={dom.trendData.chalani_podlaha}
          airTrend={dom.trendData.chalani_vzduch}
          air={oldData ? null : dom.data.chalani_vzduch}
          floor={oldData ? null : dom.data.chalani_podlaha}
          required={oldData ? null : dom.data.chalani_req}
          heat={oldData ? null : dom.data.chalani_kuri}
          summer={oldData ? null : dom.data.chalani_leto}
          low={oldData ? null : dom.data.chalani_low}
        />
        <Room
          room="Petra"
          floorTrend={dom.trendData.petra_podlaha}
          airTrend={dom.trendData.petra_vzduch}
          air={oldData ? null : dom.data.petra_vzduch}
          floor={oldData ? null : dom.data.petra_podlaha}
          required={oldData ? null : dom.data.petra_req}
          heat={oldData ? null : dom.data.petra_kuri}
          summer={oldData ? null : dom.data.petra_leto}
          low={oldData ? null : dom.data.petra_low}
        />
      </Container>
    </div>
  );
});

export default Dom;
