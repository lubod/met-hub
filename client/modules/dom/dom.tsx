import React from 'react';
import Data from '../data/data';
import Text from '../text/text';
import Room from '../room/room';
import { DomModel } from '../../models/model';
import { observer } from 'mobx-react';
import { Container, Row, Col } from 'react-bootstrap';
import Trend from '../trend/trend';

interface IProps {
  model: DomModel
}

@observer
export class Dom extends React.Component<IProps, {}> {

  constructor(props: IProps) {
    super(props);
    console.info('create dom');
  }

  public render(): JSX.Element {
    const timestamp = new Date(this.props.model.domData.timestamp);
    const now = Date.now();
    const diff = now - timestamp.getTime();
    let oldData = false;
    if (diff > 180000) {
      oldData = true;
    }
    return (
      <div className='main'>
        <Container className='text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded'>
          <Row className={oldData ? 'text-danger' : ''}>
            <Col xs={4}>
              <Text name='Place' value={this.props.model.domData.place} ></Text>
            </Col>
            <Col xs={4}>
              <Text name='Date' value={this.props.model.domData.date} ></Text>
            </Col>
            <Col xs={4}>
              <Text name='Time' value={this.props.model.domData.time} ></Text>
            </Col>
          </Row>
        </Container>
        <Container className='text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded'>
          <div className='text-left font-weight-bold'>GARDEN HOUSE</div>
          <Row>
            <Col xs={4}>
              <Data name='Temperature' value={oldData ? null : this.props.model.domData.temp} unit='°C' fix={1}></Data>
              <Trend data={this.props.model.domTrendData.temp} range={2}></Trend>
            </Col>
            <Col xs={4}>
              <Data name='Humidity' value={oldData ? null : this.props.model.domData.humidity} unit='%' fix={0}></Data>
              <Trend data={this.props.model.domTrendData.humidity} range={10}></Trend>
            </Col>
            <Col xs={4}>
              <Data name='Rain' value={oldData ? null : this.props.model.domData.rain} unit='' fix={0}></Data>
              <Trend data={this.props.model.domTrendData.rain} range={1}></Trend>
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
            floorTrend={this.props.model.domTrendData.obyvacka_podlaha}
            airTrend={this.props.model.domTrendData.obyvacka_vzduch}
            air={oldData ? null : this.props.model.domData.obyvacka_vzduch}
            floor={oldData ? null : this.props.model.domData.obyvacka_podlaha}
            required={oldData ? null : this.props.model.domData.obyvacka_req}
            heat={oldData ? null : this.props.model.domData.obyvacka_kuri}
            summer={oldData ? null : this.props.model.domData.obyvacka_leto}
            low={oldData ? null : this.props.model.domData.obyvacka_low} />
          <Room room='Guest room'
            floorTrend={this.props.model.domTrendData.pracovna_podlaha}
            airTrend={this.props.model.domTrendData.pracovna_vzduch}
            air={oldData ? null : this.props.model.domData.pracovna_vzduch}
            floor={oldData ? null : this.props.model.domData.pracovna_podlaha}
            required={oldData ? null : this.props.model.domData.pracovna_req}
            heat={oldData ? null : this.props.model.domData.pracovna_kuri}
            summer={oldData ? null : this.props.model.domData.pracovna_leto}
            low={oldData ? null : this.props.model.domData.pracovna_low} />
          <Room room='Bed room'
            floorTrend={this.props.model.domTrendData.spalna_podlaha}
            airTrend={this.props.model.domTrendData.spalna_vzduch}
            air={oldData ? null : this.props.model.domData.spalna_vzduch}
            floor={oldData ? null : this.props.model.domData.spalna_podlaha}
            required={oldData ? null : this.props.model.domData.spalna_req}
            heat={oldData ? null : this.props.model.domData.spalna_kuri}
            summer={oldData ? null : this.props.model.domData.spalna_leto}
            low={oldData ? null : this.props.model.domData.spalna_low} />
          <Room room='Boys'
            floorTrend={this.props.model.domTrendData.chalani_podlaha}
            airTrend={this.props.model.domTrendData.chalani_vzduch}
            air={oldData ? null : this.props.model.domData.chalani_vzduch}
            floor={oldData ? null : this.props.model.domData.chalani_podlaha}
            required={oldData ? null : this.props.model.domData.chalani_req}
            heat={oldData ? null : this.props.model.domData.chalani_kuri}
            summer={oldData ? null : this.props.model.domData.chalani_leto}
            low={oldData ? null : this.props.model.domData.chalani_low} />
          <Room room='Petra'
            floorTrend={this.props.model.domTrendData.petra_podlaha}
            airTrend={this.props.model.domTrendData.petra_vzduch}
            air={oldData ? null : this.props.model.domData.petra_vzduch}
            floor={oldData ? null : this.props.model.domData.petra_podlaha}
            required={oldData ? null : this.props.model.domData.petra_req}
            heat={oldData ? null : this.props.model.domData.petra_kuri}
            summer={oldData ? null : this.props.model.domData.petra_leto}
            low={oldData ? null : this.props.model.domData.petra_low} />
        </Container>
      </div >
    );
  }
}
