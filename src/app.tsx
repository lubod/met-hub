import React from 'react';
import { Station } from './modules/station/station';
import { Container, Row, Col } from 'react-bootstrap';
import { Dom } from './modules/dom/dom';
import './style.scss';

export class App extends React.Component<{}, {}> {
  public render(): JSX.Element {
    return (
      <Container>
        <Row>
          <Col sm={6} className='px-0'>
            <Station />
          </Col>
          <Col sm={6} className='px-0'>
            <Dom />
          </Col>
        </Row>
      </Container>
    );
  }
}
