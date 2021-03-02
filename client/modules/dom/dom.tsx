import React, { useEffect, useState } from 'react';
import Data from '../data/data';
import Text from '../text/text';
import Room from '../room/room';
import { DomData, DomTrendData } from '../../models/model';
import { Container, Row, Col } from 'react-bootstrap';
import Trend from '../trend/trend';
import Socket from '../../socket';

type DomProps = {
  socket: Socket
}

export function Dom(props: DomProps) {
  const [domData, setDomData] = useState<DomData>(new DomData());
  const [domTrendData, setDomTrendData] = useState<DomTrendData>(new DomTrendData());

  const timestamp = new Date(domData.timestamp);
  const now = Date.now();
  const diff = now - timestamp.getTime();
  let oldData = false;

  if (diff > 180000) {
    oldData = true;
  }

  useEffect(() => {
    console.info('mount dom');
    if (props.socket) {
      console.info('socket on dom');
      props.socket.getSocket().on('dom', processData);
      props.socket.getSocket().on('domTrend', processTrendData);
      props.socket.getSocket().emit('dom', 'getLastData');
    }
    return () => {
      props.socket.getSocket().off('dom', processData);
      props.socket.getSocket().off('domTrend', processTrendData);
      console.info('unmount dom');
    };
  }, [props.socket]);

  function processData(json: any) {
    //        console.info(json);
    if (json != null) {
      const sdate = new Date(json.timestamp).toLocaleDateString('sk-SK').replace(' ', '');
      const stime = new Date(json.timestamp).toLocaleTimeString('sk-SK');

      setDomData({
        timestamp: json.timestamp,
        time: stime,
        date: sdate.substring(0, sdate.length - 6),
        temp: json.vonku.temp,
        humidity: json.vonku.humidity,
        rain: json.vonku.rain,
        place: 'Dom',
        obyvacka_vzduch: json.obyvacka_vzduch.temp,
        obyvacka_podlaha: json.obyvacka_podlaha.temp,
        obyvacka_req: json.obyvacka_vzduch.req,
        obyvacka_kuri: json.obyvacka_podlaha.kuri,
        obyvacka_leto: json.obyvacka_podlaha.leto,
        obyvacka_low: json.obyvacka_podlaha.low,
        pracovna_vzduch: json.pracovna_vzduch.temp,
        pracovna_podlaha: json.pracovna_podlaha.temp,
        pracovna_req: json.pracovna_vzduch.req,
        pracovna_kuri: json.pracovna_podlaha.kuri,
        pracovna_leto: json.pracovna_podlaha.leto,
        pracovna_low: json.pracovna_podlaha.low,
        spalna_vzduch: json.spalna_vzduch.temp,
        spalna_podlaha: json.spalna_podlaha.temp,
        spalna_req: json.spalna_vzduch.req,
        spalna_kuri: json.spalna_podlaha.kuri,
        spalna_leto: json.spalna_podlaha.leto,
        spalna_low: json.spalna_podlaha.low,
        chalani_vzduch: json.chalani_vzduch.temp,
        chalani_podlaha: json.chalani_podlaha.temp,
        chalani_req: json.chalani_vzduch.req,
        chalani_kuri: json.chalani_podlaha.kuri,
        chalani_leto: json.chalani_podlaha.leto,
        chalani_low: json.chalani_podlaha.low,
        petra_vzduch: json.petra_vzduch.temp,
        petra_podlaha: json.petra_podlaha.temp,
        petra_req: json.petra_vzduch.req,
        petra_kuri: json.petra_podlaha.kuri,
        petra_leto: json.petra_podlaha.leto,
        petra_low: json.petra_podlaha.low
      });
    }
  }

  function processTrendData(json: any) {
    //        console.info(json);
    if (json != null) {
      setDomTrendData({
        timestamp: json.timestamp,
        temp: json.temp,
        humidity: json.humidity,
        rain: json.rain,
        obyvacka_vzduch: json.obyvacka_vzduch,
        obyvacka_podlaha: json.obyvacka_podlaha,
        pracovna_vzduch: json.pracovna_vzduch,
        pracovna_podlaha: json.pracovna_podlaha,
        spalna_vzduch: json.spalna_vzduch,
        spalna_podlaha: json.spalna_podlaha,
        chalani_vzduch: json.chalani_vzduch,
        chalani_podlaha: json.chalani_podlaha,
        petra_vzduch: json.petra_vzduch,
        petra_podlaha: json.petra_podlaha
      });
    }
  }

  return (
    <div className='main'>
      <Container className='text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded'>
        <Row className={oldData ? 'text-danger' : ''}>
          <Col xs={4}>
            <Text name='Place' value={domData.place} ></Text>
          </Col>
          <Col xs={4}>
            <Text name='Date' value={domData.date} ></Text>
          </Col>
          <Col xs={4}>
            <Text name='Time' value={domData.time} ></Text>
          </Col>
        </Row>
      </Container>
      <Container className='text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded'>
        <div className='text-left font-weight-bold'>GARDEN HOUSE</div>
        <Row>
          <Col xs={4}>
            <Data name='Temperature' value={oldData ? null : domData.temp} unit='°C' fix={1}></Data>
            <Trend data={domTrendData.temp} range={2}></Trend>
          </Col>
          <Col xs={4}>
            <Data name='Humidity' value={oldData ? null : domData.humidity} unit='%' fix={0}></Data>
            <Trend data={domTrendData.humidity} range={10}></Trend>
          </Col>
          <Col xs={4}>
            <Data name='Rain' value={oldData ? null : domData.rain} unit='' fix={0}></Data>
            <Trend data={domTrendData.rain} range={1}></Trend>
          </Col>
        </Row>
      </Container>
      <Container className='text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded'>
        <Row className='text-left text-info font-weight-bold'>
          <Col xs={3}>Air
            </Col>
          <Col xs={3}>Floor
            </Col>
          <Col xs={3}>Req
            </Col>
          <Col xs={2}>HSL
            </Col>
        </Row>
        <Room room='Living room'
          floorTrend={domTrendData.obyvacka_podlaha}
          airTrend={domTrendData.obyvacka_vzduch}
          air={oldData ? null : domData.obyvacka_vzduch}
          floor={oldData ? null : domData.obyvacka_podlaha}
          required={oldData ? null : domData.obyvacka_req}
          heat={oldData ? null : domData.obyvacka_kuri}
          summer={oldData ? null : domData.obyvacka_leto}
          low={oldData ? null : domData.obyvacka_low} />
        <Room room='Guest room'
          floorTrend={domTrendData.pracovna_podlaha}
          airTrend={domTrendData.pracovna_vzduch}
          air={oldData ? null : domData.pracovna_vzduch}
          floor={oldData ? null : domData.pracovna_podlaha}
          required={oldData ? null : domData.pracovna_req}
          heat={oldData ? null : domData.pracovna_kuri}
          summer={oldData ? null : domData.pracovna_leto}
          low={oldData ? null : domData.pracovna_low} />
        <Room room='Bed room'
          floorTrend={domTrendData.spalna_podlaha}
          airTrend={domTrendData.spalna_vzduch}
          air={oldData ? null : domData.spalna_vzduch}
          floor={oldData ? null : domData.spalna_podlaha}
          required={oldData ? null : domData.spalna_req}
          heat={oldData ? null : domData.spalna_kuri}
          summer={oldData ? null : domData.spalna_leto}
          low={oldData ? null : domData.spalna_low} />
        <Room room='Boys'
          floorTrend={domTrendData.chalani_podlaha}
          airTrend={domTrendData.chalani_vzduch}
          air={oldData ? null : domData.chalani_vzduch}
          floor={oldData ? null : domData.chalani_podlaha}
          required={oldData ? null : domData.chalani_req}
          heat={oldData ? null : domData.chalani_kuri}
          summer={oldData ? null : domData.chalani_leto}
          low={oldData ? null : domData.chalani_low} />
        <Room room='Petra'
          floorTrend={domTrendData.petra_podlaha}
          airTrend={domTrendData.petra_vzduch}
          air={oldData ? null : domData.petra_vzduch}
          floor={oldData ? null : domData.petra_podlaha}
          required={oldData ? null : domData.petra_req}
          heat={oldData ? null : domData.petra_kuri}
          summer={oldData ? null : domData.petra_leto}
          low={oldData ? null : domData.petra_low} />
      </Container>
    </div >
  );
}

