import React, { useState } from 'react';
import { Station } from './modules/station/station';
import { Container, Row, Col, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { Dom } from './modules/dom/dom';
import Iframe from 'react-iframe';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import './style.scss';
import Auth from './auth';
import Socket from './socket';

type ProtectedProps = {
  auth: Auth,
  socket: Socket
}

function Protected(props: ProtectedProps) {
  const [valueStation, setValueStation] = useState('current');
  const handleChangeStation = (val: any) => setValueStation(val);

  const [valueDom, setValueDom] = useState('current');
  const handleChangeDom = (val: any) => setValueDom(val);

  console.info('Protected render');

  return (
    <Container className='container-max-width text-center py-2'>
      <Row>
        <Col sm={6} className='px-2'>
          <ToggleButtonGroup className='btn-block' type='radio' name='options' defaultValue={'current'} onChange={handleChangeStation}>
            <ToggleButton value={'current'}>Current</ToggleButton>
            <ToggleButton value={'history'}>History</ToggleButton>
            <ToggleButton value={'map'}>Map</ToggleButton>
          </ToggleButtonGroup>
          {
            valueStation === 'current' && <Station socket={props.socket} />
          }
          {
            valueStation === 'history' &&
            <Container className='bg-very-dark mx-auto my-2 py-2'>
              <Iframe url={'/charts/d/-LNB7_HGk/stanica?orgId=1&from=now-24h&to=now&token=' + props.auth.getToken()} width='100%' height='700px' />
            </Container>
          }
          {
            valueStation === 'map' &&
            <Container className='bg-very-dark mx-auto my-2 py-2'>
              <MapContainer center={[48.2482, 17.0589]} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[48.2482, 17.0589]}>
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
                </Marker>
              </MapContainer>
            </Container>
          }
        </Col>
        <Col sm={6} className='px-2'>
          <ToggleButtonGroup className='btn-block' type='radio' name='options' defaultValue={'current'} onChange={handleChangeDom}>
            <ToggleButton value={'current'}>Current</ToggleButton>
            <ToggleButton value={'history'}>History</ToggleButton>
            <ToggleButton value={'map'}>Map</ToggleButton>
          </ToggleButtonGroup>
          {
            valueDom === 'current' && <Dom socket={props.socket} />
          }
          {
            valueDom === 'history' &&
            <Container className='bg-very-dark mx-auto my-2 py-2'>
              <Iframe url={'/charts/d/80t3t_HGk/dom?orgId=1&from=now-24h&to=now&token=' + props.auth.getToken()} width='100%' height='700px' />
            </Container>
          }
          {
            valueDom === 'map' && <div />
          }
        </Col>
      </Row>
    </Container>
  );
}

export default Protected;
