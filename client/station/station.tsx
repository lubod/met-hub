import React, { createContext, useContext, useEffect, useState } from 'react';
import WindRose from '../wind-rose/wind-rose';
import Data from '../data/data';
import Text from '../text/text';
import Trend from '../trend/trend';
import { Container, Row, Col } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { AppContextP, StationDataP } from '..';

let maxDiff = 1000;

export const Station = observer(() => {
  console.info('station render');
  /*
    useEffect(() => {
      var timer = setInterval(() => {
        setCtime(new Date());
        //console.info('ctime', ctime);
  
        if (isOldData()) {
          const now = new Date();
          if (now.getTime() - lastCall >= maxDiff) {
            //        if (props.auth.isAuthenticated()) {
            console.info('call', lastCall, maxDiff, now.getTime() - lastCall);
            fetchData('/api/getLastData/station', processData);
            fetchData('/api/getTrendData/station', processTrendData);
            setLastCall(now.getTime());
            maxDiff *= 2;
            //        }
          }
        }
        else {
          maxDiff = 1000;
        }
      }, 1000);
  
      return () => {
        clearInterval(timer);
      };
    }, [ctime]);
  
    useEffect(() => {
      console.info('mount station');
      if (props.socket) {
        console.info('socket on station');
        props.socket.getSocket().on('station', processData);
        props.socket.getSocket().on('stationTrend', processTrendData);
        props.socket.getSocket().emit('station', 'getLastData');
      }
  
      return () => {
        props.socket.getSocket().off('station', processData);
        props.socket.getSocket().off('stationTrend', processTrendData);
        console.info('unmount station');
      };
    }, [props.socket]);
  
  */

  const station = useContext(StationDataP);

  return (
    <div className='main'>
      <Container className='text-center text-light my-2 py-2 mx-auto border-primary bg-very-dark rounded shadow'>
        <Row className={station.oldData ? 'text-danger' : ''}>
          <Col xs={4}>
            <Text name='Place' value={station.data.place} ></Text>
          </Col>
          <Col xs={4}>
            <Text name='Date' value={station.data.date} ></Text>
          </Col>
          <Col xs={4}>
            <Text name={'Time ' + station.ctime.toLocaleTimeString('sk-SK')} value={station.data.time} ></Text>
          </Col>
        </Row>
      </Container>
      <Container className='text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded'>
        <WindRose
          gustTrend={station.trendData.windgust}
          speedTrend={station.trendData.windspeed}
          dirTrend={station.trendData.winddir}
          speed={station.oldData ? null : station.data.windspeed}
          dir={station.oldData ? null : station.data.winddir}
          gust={station.oldData ? null : station.data.windgust}
          dailyGust={station.oldData ? null : station.data.maxdailygust}></WindRose>
      </Container>
      <Container className='text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded'>
        <Row>
          <Col xs={4}>
            <Data name='Temperature' value={station.oldData ? null : station.data.temp} unit='°C' fix={1}></Data>
            <Trend data={station.trendData.temp} range={1.5}></Trend>
          </Col>
          <Col xs={4}>
            <Data name='Humidity' value={station.oldData ? null : station.data.humidity} unit='%' fix={0}></Data>
            <Trend data={station.trendData.humidity} range={10}></Trend>
          </Col>
          <Col xs={4}>
            <Data name='Pressure' value={station.oldData ? null : station.data.pressurerel} unit='hPa' fix={1}></Data>
            <Trend data={station.trendData.pressurerel} range={1}></Trend>
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <Data name='Radiation' value={station.oldData ? null : station.data.solarradiation} unit='W/m2' fix={0}></Data>
            <Trend data={station.trendData.solarradiation} range={100}></Trend>
          </Col>
          <Col xs={4}>
            <Data name='UV' value={station.oldData ? null : station.data.uv} unit='' fix={0}></Data>
            <Trend data={station.trendData.uv} range={3}></Trend>
          </Col>
          <Col xs={4}>
            <Data name='Rain Rate' value={station.oldData ? null : station.data.rainrate} unit='mm/h' fix={1}></Data>
            <Trend data={station.trendData.rainrate} range={1}></Trend>
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <Data name='Event Rain' value={station.oldData ? null : station.data.eventrain} unit='mm' fix={1}></Data>
          </Col>
          <Col xs={4}>
            <Data name='Hourly' value={station.oldData ? null : station.data.hourlyrain} unit='mm' fix={1}></Data>
          </Col>
          <Col xs={4}>
            <Data name='Daily' value={station.oldData ? null : station.data.dailyrain} unit='mm' fix={1}></Data>
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <Data name='Weekly' value={station.oldData ? null : station.data.weeklyrain} unit='mm' fix={1}></Data>
          </Col>
          <Col xs={4}>
            <Data name='Monthly' value={station.oldData ? null : station.data.monthlyrain} unit='mm' fix={1}></Data>
          </Col>
          <Col xs={4}>
            <Data name='Total' value={station.oldData ? null : station.data.totalrain} unit='mm' fix={1}></Data>
          </Col>
        </Row>
      </Container>
      <Container className='text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded'>
        <div className='text-left font-weight-bold'>IN</div>
        <Row>
          <Col xs={6}>
            <Data name='Temperature' value={station.oldData ? null : station.data.tempin} unit='°C' fix={1}></Data>
            <Trend data={station.trendData.tempin} range={1.5}></Trend>
          </Col>
          <Col xs={6}>
            <Data name='Humidity' value={station.oldData ? null : station.data.humidityin} unit='%' fix={0}></Data>
            <Trend data={station.trendData.humidityin} range={10}></Trend>
          </Col>
        </Row>
      </Container>
    </div>
  )
})

