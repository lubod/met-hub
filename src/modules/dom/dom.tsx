import React from 'react';
import Data from '../data/data';
import Room from '../room/room';
import { DomModel } from '../../models/model';
import { observer } from 'mobx-react';
import { DomController } from '../../controllers/dom-controller';
import { Container, Row, Col } from 'react-bootstrap';
import './style.scss';

@observer
export class Dom extends React.Component<{}, {}> {
  private model = new DomModel();
  private controller = new DomController(this.model);

  handleClick() {
    window.location.href = "grafana.html?hash=80t3t_HGk&uuid=dom";
  }

  public render(): JSX.Element {
    return (
      <div className='main'>
        <Container className='text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded'>
          <Row>
            <Col xs={12}>
              <button onClick={this.handleClick} type='button' id='history' className='btn-block text-left btn btn-primary mb-2'>{this.model.domData.place}</button>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <Data name='Date' value={this.model.domData.date} unit='' ></Data>
            </Col>
            <Col xs={6}>
              <Data name='Time' value={this.model.domData.time} unit='' ></Data>
            </Col>
          </Row>
        </Container>
        <Container className='text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded'>
          <div className='text-left'>OUT</div>
          <Row>
            <Col xs={4}>
              <Data name='Temperature' value={this.model.domData.temp} unit='°C' ></Data>
            </Col>
            <Col xs={4}>
              <Data name='Humidity' value={this.model.domData.humidity} unit='%' ></Data>
            </Col>
            <Col xs={4}>
              <Data name='Rain' value={this.model.domData.rain} unit='' ></Data>
            </Col>
          </Row>
        </Container>
        <Container className='text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded'>
          <Row className='text-left text-info'>
            <Col xs={3}>Air
            </Col>
            <Col xs={3}>Floor
            </Col>
            <Col xs={3}>Req
            </Col>
            <Col xs={2}>HSL
            </Col>
          </Row>
          <Room room='Living room' air={this.model.domData.obyvacka_vzduch} floor={this.model.domData.obyvacka_podlaha} required={this.model.domData.obyvacka_req} heat={this.model.domData.obyvacka_kuri} summer={this.model.domData.obyvacka_leto} low={this.model.domData.obyvacka_low} />
          <Room room='Guest room' air={this.model.domData.pracovna_vzduch} floor={this.model.domData.pracovna_podlaha} required={this.model.domData.pracovna_req} heat={this.model.domData.pracovna_kuri} summer={this.model.domData.pracovna_leto} low={this.model.domData.pracovna_low} />
          <Room room='Bed room' air={this.model.domData.spalna_vzduch} floor={this.model.domData.spalna_podlaha} required={this.model.domData.spalna_req} heat={this.model.domData.spalna_kuri} summer={this.model.domData.spalna_leto} low={this.model.domData.spalna_low} />
          <Room room='Boys' air={this.model.domData.chalani_vzduch} floor={this.model.domData.chalani_podlaha} required={this.model.domData.chalani_req} heat={this.model.domData.chalani_kuri} summer={this.model.domData.chalani_leto} low={this.model.domData.chalani_low} />
          <Room room='Petra' air={this.model.domData.petra_vzduch} floor={this.model.domData.petra_podlaha} required={this.model.domData.petra_req} heat={this.model.domData.petra_kuri} summer={this.model.domData.petra_leto} low={this.model.domData.petra_low} />
        </Container>
      </div >
    );
  }
}
