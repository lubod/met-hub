import React from 'react';
import WindRose from '../wind-rose/wind-rose';
import Data from '../data/data';
import { StationModel } from '../../models/model';
import { observer } from 'mobx-react';
import { StationController } from '../../controllers/station-controller';
import { Container, Row, Col } from 'react-bootstrap';
import './style.scss';

@observer
export class Station extends React.Component<{}, {}> {
  private model = new StationModel();
  private controller = new StationController(this.model);

  handleClick() {
    window.location.href = "grafana.html?hash=-LNB7_HGk&uuid=stanica";
  }

  public render(): JSX.Element {
    return (
      <div className='main'>
        <Container className='text-center text-light my-2 py-2 mx-auto border-primary bg-very-dark rounded shadow'>
          <Row>
            <Col xs={12}>
              <button onClick={this.handleClick} type='button' id='history' className='btn-block text-left btn btn-primary mb-2 bg-gradient-primary shadow'>{this.model.stationData.place}</button>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <Data name='Date' value={this.model.stationData.date} unit='' ></Data>
            </Col>
            <Col xs={6}>
              <Data name='Time' value={this.model.stationData.time} unit='' ></Data>
            </Col>
          </Row>
        </Container>
        <Container className='text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded'>
          <WindRose speed={this.model.stationData.windspeed} dir={this.model.stationData.winddir} gust={this.model.stationData.windgust} dailyGust={this.model.stationData.maxdailygust}></WindRose>
        </Container>
        <Container className='text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded'>
          <Row>
            <Col xs={4}>
              <Data name='Temperature' value={this.model.stationData.temp} unit='°C' ></Data>
            </Col>
            <Col xs={4}>
              <Data name='Humidity' value={this.model.stationData.humidity} unit='%' ></Data>
            </Col>
            <Col xs={4}>
              <Data name='Pressure' value={this.model.stationData.pressurerel} unit='hPa' ></Data>
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <Data name='Radiation' value={this.model.stationData.solarradiation} unit='W/m2' ></Data>
            </Col>
            <Col xs={4}>
              <Data name='UV' value={this.model.stationData.uv} unit='' ></Data>
            </Col>
            <Col xs={4}>
              <Data name='Rain Rate' value={this.model.stationData.rainrate} unit='mm/h' ></Data>
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <Data name='Event Rain' value={this.model.stationData.eventrain} unit='mm' ></Data>
            </Col>
            <Col xs={4}>
              <Data name='Hourly' value={this.model.stationData.hourlyrain} unit='mm' ></Data>
            </Col>
            <Col xs={4}>
              <Data name='Daily' value={this.model.stationData.dailyrain} unit='mm' ></Data>
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <Data name='Weekly' value={this.model.stationData.weeklyrain} unit='mm' ></Data>
            </Col>
            <Col xs={4}>
              <Data name='Monthly' value={this.model.stationData.monthlyrain} unit='mm' ></Data>
            </Col>
            <Col xs={4}>
              <Data name='Total' value={this.model.stationData.totalrain} unit='mm' ></Data>
            </Col>
          </Row>
        </Container>
        <Container className='text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded'>
          <div className='text-left'>IN</div>
          <Row>
            <Col xs={6}>
              <Data name='Temperature' value={this.model.stationData.tempin} unit='°C' ></Data>
            </Col>
            <Col xs={6}>
              <Data name='Humidity' value={this.model.stationData.humidityin} unit='%' ></Data>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}
