import React from 'react';
import { Station } from './modules/station/station';
import { Container, Row, Col } from 'react-bootstrap';
import { Dom } from './modules/dom/dom';

import './style.scss';

function Protected(props: any) {
  console.log('protected', props.auth.getToken());

  return (
    <Container>
      <Row>
        <Col sm={6} className='px-2'>
          <Station auth={props.auth} />
        </Col>
          <Col sm={6} className='px-2'>
            <Dom auth={props.auth} />
          </Col>
      </Row>
    </Container>
  );
}

export default Protected;
