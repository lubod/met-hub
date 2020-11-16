import React, { useState } from 'react';
import { Station } from './modules/station/station';
import { Container, Row, Col } from 'react-bootstrap';
import { Dom } from './modules/dom/dom';

import './style.scss';
import Iframe from 'react-iframe';

function Protected(props: any) {
  const [toggleStation, setToggleStation] = useState(true);
  const toggleCheckedStation = () => setToggleStation(toggleStation => !toggleStation);

  const [toggleDom, setToggleDom] = useState(true);
  const toggleCheckedDom = () => setToggleDom(toggleDom => !toggleDom);

  console.log('protected');

  return (
    <Container className='container-max-width text-center py-2'>
      <Row>
        <Col sm={6} className='px-2'>
          <button type='button' onClick={toggleCheckedStation} id='toggleStation' className='btn-block text-left btn btn-primary mb-2'>
            Toggle History/Current
          </button>
          {
            toggleStation &&
            <Station auth={props.auth} />
          }
          {
            !toggleStation &&
            <Container className='bg-very-dark px-0 py-0'>
              <Iframe url={'/charts/d/-LNB7_HGk/stanica?orgId=1&from=now-24h&to=now&token=' + props.auth.getToken()} width='100%' height='700px' />
            </Container>
          }
        </Col>
        <Col sm={6} className='px-2'>
          <button type='button' onClick={toggleCheckedDom} id='toggleDom' className='btn-block text-left btn btn-primary mb-2'>
            Toggle History/Current
          </button>
          {
            toggleDom &&
            <Dom auth={props.auth} />
          }
          {
            !toggleDom &&
            <Container className='bg-very-dark px-0 py-0'>
              <Iframe url={'/charts/d/80t3t_HGk/dom?orgId=1&from=now-24h&to=now&token=' + props.auth.getToken()} width='100%' height='700px' />
            </Container>
          }
        </Col>
      </Row>
    </Container>
  );
}

export default Protected;
