import React from 'react';
import WindRose from '../wind-rose/wind-rose';
import Data from '../data/data';
import Text from '../text/text';
import Trend from '../trend/trend';
import { StationModel } from '../../models/model';
import { observer } from 'mobx-react';
import { StationController } from '../../controllers/station-controller';
import { Container, Row, Col } from 'react-bootstrap';
import Auth from '../../auth';
import Iframe from 'react-iframe';

interface IProps {
  auth: Auth;
}

@observer
export class Station extends React.Component<IProps, {}> {
  private model: StationModel;
  private controller: StationController;

  constructor(props: IProps) {
    super(props);
    this.model = new StationModel();
    this.controller = new StationController(this.model, props.auth);
  }

  public render(): JSX.Element {
    //    console.log(this.model.stationTrendData);
    const timestamp = new Date(this.model.stationData.timestamp);
    const now = Date.now();
    const diff = now - timestamp.getTime();
    let oldData = false;
    if (diff > 180000) {
      oldData = true;
    }

    return (
      <div className='main'>
        <Container className='text-center text-light my-2 py-2 mx-auto border-primary bg-very-dark rounded shadow'>
          <Row className={oldData ? 'text-danger' : ''}>
            <Col xs={4}>
              <Text name='Place' value={this.model.stationData.place} ></Text>
            </Col>
            <Col xs={4}>
              <Text name='Date' value={this.model.stationData.date} ></Text>
            </Col>
            <Col xs={4}>
              <Text name='Time' value={this.model.stationData.time} ></Text>
            </Col>
          </Row>
        </Container>
        <Container className='text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded'>
          <WindRose
            gustTrend={this.model.stationTrendData.windgust}
            speedTrend={this.model.stationTrendData.windspeed}
            dirTrend={this.model.stationTrendData.winddir}
            speed={oldData ? null : this.model.stationData.windspeed}
            dir={oldData ? null : this.model.stationData.winddir}
            gust={oldData ? null : this.model.stationData.windgust}
            dailyGust={oldData ? null : this.model.stationData.maxdailygust}></WindRose>
        </Container>
        <Container className='text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded'>
          <Row>
            <Col xs={4}>
              <Data name='Temperature' value={oldData ? null : this.model.stationData.temp} unit='°C' fix={1}></Data>
              <Trend data={this.model.stationTrendData.temp} range={1.5}></Trend>
            </Col>
            <Col xs={4}>
              <Data name='Humidity' value={oldData ? null : this.model.stationData.humidity} unit='%' fix={0}></Data>
              <Trend data={this.model.stationTrendData.humidity} range={10}></Trend>
            </Col>
            <Col xs={4}>
              <Data name='Pressure' value={oldData ? null : this.model.stationData.pressurerel} unit='hPa' fix={1}></Data>
              <Trend data={this.model.stationTrendData.pressurerel} range={1}></Trend>
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <Data name='Radiation' value={oldData ? null : this.model.stationData.solarradiation} unit='W/m2' fix={0}></Data>
              <Trend data={this.model.stationTrendData.solarradiation} range={100}></Trend>
            </Col>
            <Col xs={4}>
              <Data name='UV' value={oldData ? null : this.model.stationData.uv} unit='' fix={0}></Data>
              <Trend data={this.model.stationTrendData.uv} range={3}></Trend>
            </Col>
            <Col xs={4}>
              <Data name='Rain Rate' value={oldData ? null : this.model.stationData.rainrate} unit='mm/h' fix={1}></Data>
              <Trend data={this.model.stationTrendData.rainrate} range={1}></Trend>
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <Data name='Event Rain' value={oldData ? null : this.model.stationData.eventrain} unit='mm' fix={1}></Data>
            </Col>
            <Col xs={4}>
              <Data name='Hourly' value={oldData ? null : this.model.stationData.hourlyrain} unit='mm' fix={1}></Data>
            </Col>
            <Col xs={4}>
              <Data name='Daily' value={oldData ? null : this.model.stationData.dailyrain} unit='mm' fix={1}></Data>
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <Data name='Weekly' value={oldData ? null : this.model.stationData.weeklyrain} unit='mm' fix={1}></Data>
            </Col>
            <Col xs={4}>
              <Data name='Monthly' value={oldData ? null : this.model.stationData.monthlyrain} unit='mm' fix={1}></Data>
            </Col>
            <Col xs={4}>
              <Data name='Total' value={oldData ? null : this.model.stationData.totalrain} unit='mm' fix={1}></Data>
            </Col>
          </Row>
        </Container>
        <Container className='text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded'>
          <div className='text-left'>IN</div>
          <Row>
            <Col xs={6}>
              <Data name='Temperature' value={oldData ? null : this.model.stationData.tempin} unit='°C' fix={1}></Data>
              <Trend data={this.model.stationTrendData.tempin} range={1.5}></Trend>
            </Col>
            <Col xs={6}>
              <Data name='Humidity' value={oldData ? null : this.model.stationData.humidityin} unit='%' fix={0}></Data>
              <Trend data={this.model.stationTrendData.humidityin} range={10}></Trend>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}
