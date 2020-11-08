import React from 'react';
import Data from '../data/data';
import Text from '../text/text';
import Room from '../room/room';
import { DomModel } from '../../models/model';
import { observer } from 'mobx-react';
import { DomController } from '../../controllers/dom-controller';
import { Container, Row, Col } from 'react-bootstrap';
import Trend from '../trend/trend';

@observer
export class Dom extends React.Component<{}, {}> {
  private model = new DomModel();
  private controller = new DomController(this.model);

  handleClick() {
    window.location.href = "grafana.html?hash=80t3t_HGk&uuid=dom";
  }

  public render(): JSX.Element {
    const timestamp = new Date(this.model.domData.timestamp);
    const now = Date.now();
    const diff = now - timestamp.getTime();
    let oldData = false;
    if (diff > 120000) {
      oldData = true;
    }
    return (
      <div className='main'>
        <Container className='text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded'>
          <Row>
            <Col xs={12}>
              <button onClick={this.handleClick} type='button' id='history' className='btn-block text-left btn btn-primary mb-2'>{this.model.domData.place}</button>
            </Col>
          </Row>
          <Row className={oldData ? 'text-danger' : ''}>
            <Col xs={6}>
              <Text name='Date' value={this.model.domData.date} ></Text>
            </Col>
            <Col xs={6}>
              <Text name='Time' value={this.model.domData.time} ></Text>
            </Col>
          </Row>
        </Container>
        <Container className='text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded'>
          <div className='text-left'>GARDEN HOUSE</div>
          <Row>
            <Col xs={4}>
              <Data name='Temperature' value={oldData ? null : this.model.domData.temp} unit='°C' fix={1}></Data>
              <Trend data={this.model.domTrendData.temp} range={2}></Trend>
            </Col>
            <Col xs={4}>
              <Data name='Humidity' value={oldData ? null : this.model.domData.humidity} unit='%' fix={0}></Data>
              <Trend data={this.model.domTrendData.humidity} range={10}></Trend>
            </Col>
            <Col xs={4}>
              <Data name='Rain' value={oldData ? null : this.model.domData.rain} unit='' fix={0}></Data>
              <Trend data={this.model.domTrendData.rain} range={1}></Trend>
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
          <Room room='Living room'
            floorTrend={this.model.domTrendData.obyvacka_podlaha}
            airTrend={this.model.domTrendData.obyvacka_vzduch}
            air={oldData ? null : this.model.domData.obyvacka_vzduch}
            floor={oldData ? null : this.model.domData.obyvacka_podlaha}
            required={oldData ? null : this.model.domData.obyvacka_req}
            heat={oldData ? null : this.model.domData.obyvacka_kuri}
            summer={oldData ? null : this.model.domData.obyvacka_leto}
            low={oldData ? null : this.model.domData.obyvacka_low} />
          <Room room='Guest room'
            floorTrend={this.model.domTrendData.pracovna_podlaha}
            airTrend={this.model.domTrendData.pracovna_vzduch}
            air={oldData ? null : this.model.domData.pracovna_vzduch}
            floor={oldData ? null : this.model.domData.pracovna_podlaha}
            required={oldData ? null : this.model.domData.pracovna_req}
            heat={oldData ? null : this.model.domData.pracovna_kuri}
            summer={oldData ? null : this.model.domData.pracovna_leto}
            low={oldData ? null : this.model.domData.pracovna_low} />
          <Room room='Bed room'
            floorTrend={this.model.domTrendData.spalna_podlaha}
            airTrend={this.model.domTrendData.spalna_vzduch}
            air={oldData ? null : this.model.domData.spalna_vzduch}
            floor={oldData ? null : this.model.domData.spalna_podlaha}
            required={oldData ? null : this.model.domData.spalna_req}
            heat={oldData ? null : this.model.domData.spalna_kuri}
            summer={oldData ? null : this.model.domData.spalna_leto}
            low={oldData ? null : this.model.domData.spalna_low} />
          <Room room='Boys'
            floorTrend={this.model.domTrendData.chalani_podlaha}
            airTrend={this.model.domTrendData.chalani_vzduch}
            air={oldData ? null : this.model.domData.chalani_vzduch}
            floor={oldData ? null : this.model.domData.chalani_podlaha}
            required={oldData ? null : this.model.domData.chalani_req}
            heat={oldData ? null : this.model.domData.chalani_kuri}
            summer={oldData ? null : this.model.domData.chalani_leto}
            low={oldData ? null : this.model.domData.chalani_low} />
          <Room room='Petra'
            floorTrend={this.model.domTrendData.petra_podlaha}
            airTrend={this.model.domTrendData.petra_vzduch}
            air={oldData ? null : this.model.domData.petra_vzduch}
            floor={oldData ? null : this.model.domData.petra_podlaha}
            required={oldData ? null : this.model.domData.petra_req}
            heat={oldData ? null : this.model.domData.petra_kuri}
            summer={oldData ? null : this.model.domData.petra_leto}
            low={oldData ? null : this.model.domData.petra_low} />
        </Container>
      </div >
    );
  }
}
