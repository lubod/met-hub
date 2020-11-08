import React from 'react';
import { Station } from './modules/station/station';
import { Container, Row, Col } from 'react-bootstrap';
import { Dom } from './modules/dom/dom';

import './style.scss';

export class Protected extends React.Component<{}, {}> {

  public render(): JSX.Element {
    console.log('protected');

    return (
      <Container>
        <Row>
          <Col sm={6} className='px-2'>
            <Station />
          </Col>
          <Col sm={6} className='px-2'>
            <Dom />
          </Col>
        </Row>
      </Container>
    );
  }
}

