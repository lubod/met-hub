import React, { useEffect, useState } from 'react';
import WindRose from '../wind-rose/wind-rose';
import Data from '../data/data';
import Text from '../text/text';
import Trend from '../trend/trend';
import { StationData, StationTrendData } from '../../models/model';
import { Container, Row, Col } from 'react-bootstrap';
import Socket from '../../socket';
import Auth from '../../auth';

type StationProps = {
  auth: Auth,
  socket: Socket
}

let maxDiff = 1000;

export function Station(props: StationProps) {
  const [stationData, setStationData] = useState<StationData>({} as StationData);
  const [stationTrendData, setTrendStationData] = useState<StationTrendData>(new StationTrendData());
  const [ctime, setCtime] = useState<Date>(new Date());
  const [lastCall, setLastCall] = useState(0);

  function fetchData(url: string, processFnc: any) {
    console.info(url);
    fetch(url, {
      headers: {
        Authorization: `Bearer ${props.auth.getToken()}`,
      }
    }).then(data => {
      if (data.status === 401) {
        console.info('auth 401');
        props.auth.login();
      }
      return data.json();
    }).then(json => {
      processFnc(json);
    }).catch(err => {
      console.error(err);
    });

  }

  function isOldData() {
    //console.info('timestamp', stationData.timestamp, 'ctime', ctime);
    if (stationData.timestamp) {
      const timestamp = new Date(stationData.timestamp);
      const diff = ctime.getTime() - timestamp.getTime();
      if (diff > 180000) {
      //  console.info('oldData = true');
        return true;
      }
      else {
        //console.info('oldData = false');
        return false;
      }
    }
    else {
      //console.info('oldData = true');
      return true;
    }
  }

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

  function processData(stationData: StationData) {
    if (stationData != null) {
      //console.info(stationData);
      const sdate = new Date(stationData.timestamp).toLocaleDateString('sk-SK').replace(' ', '');
      const stime = new Date(stationData.timestamp).toLocaleTimeString('sk-SK');

      console.info('process data', sdate, stime, stationData.timestamp);
      stationData.time = stime;
      stationData.date = sdate.substring(0, sdate.length - 6);
      stationData.place = 'Marianka';
      setStationData(stationData);
    }
  }

  function processTrendData(json: any) {
    //        console.info(json);
    if (json != null) {
      setTrendStationData({
        timestamp: json.timestamp,
        tempin: json.tempin,
        humidityin: json.humidityin,
        temp: json.temp,
        humidity: json.humidity,
        pressurerel: json.pressurerel,
        windgust: json.windgust,
        windspeed: json.windspeed,
        winddir: json.winddir,
        solarradiation: json.solarradiation,
        uv: json.uv,
        rainrate: json.rainrate
      });
    }
  }

  const oldData = isOldData();

  return (
    <div className='main'>
      <Container className='text-center text-light my-2 py-2 mx-auto border-primary bg-very-dark rounded shadow'>
        <Row className={oldData ? 'text-danger' : ''}>
          <Col xs={4}>
            <Text name='Place' value={stationData.place} ></Text>
          </Col>
          <Col xs={4}>
            <Text name='Date' value={stationData.date} ></Text>
          </Col>
          <Col xs={4}>
            <Text name={'Time ' + ctime.toLocaleTimeString('sk-SK')} value={stationData.time} ></Text>
          </Col>
        </Row>
      </Container>
      <Container className='text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded'>
        <WindRose
          gustTrend={stationTrendData.windgust}
          speedTrend={stationTrendData.windspeed}
          dirTrend={stationTrendData.winddir}
          speed={oldData ? null : stationData.windspeed}
          dir={oldData ? null : stationData.winddir}
          gust={oldData ? null : stationData.windgust}
          dailyGust={oldData ? null : stationData.maxdailygust}></WindRose>
      </Container>
      <Container className='text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded'>
        <Row>
          <Col xs={4}>
            <Data name='Temperature' value={oldData ? null : stationData.temp} unit='°C' fix={1}></Data>
            <Trend data={stationTrendData.temp} range={1.5}></Trend>
          </Col>
          <Col xs={4}>
            <Data name='Humidity' value={oldData ? null : stationData.humidity} unit='%' fix={0}></Data>
            <Trend data={stationTrendData.humidity} range={10}></Trend>
          </Col>
          <Col xs={4}>
            <Data name='Pressure' value={oldData ? null : stationData.pressurerel} unit='hPa' fix={1}></Data>
            <Trend data={stationTrendData.pressurerel} range={1}></Trend>
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <Data name='Radiation' value={oldData ? null : stationData.solarradiation} unit='W/m2' fix={0}></Data>
            <Trend data={stationTrendData.solarradiation} range={100}></Trend>
          </Col>
          <Col xs={4}>
            <Data name='UV' value={oldData ? null : stationData.uv} unit='' fix={0}></Data>
            <Trend data={stationTrendData.uv} range={3}></Trend>
          </Col>
          <Col xs={4}>
            <Data name='Rain Rate' value={oldData ? null : stationData.rainrate} unit='mm/h' fix={1}></Data>
            <Trend data={stationTrendData.rainrate} range={1}></Trend>
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <Data name='Event Rain' value={oldData ? null : stationData.eventrain} unit='mm' fix={1}></Data>
          </Col>
          <Col xs={4}>
            <Data name='Hourly' value={oldData ? null : stationData.hourlyrain} unit='mm' fix={1}></Data>
          </Col>
          <Col xs={4}>
            <Data name='Daily' value={oldData ? null : stationData.dailyrain} unit='mm' fix={1}></Data>
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <Data name='Weekly' value={oldData ? null : stationData.weeklyrain} unit='mm' fix={1}></Data>
          </Col>
          <Col xs={4}>
            <Data name='Monthly' value={oldData ? null : stationData.monthlyrain} unit='mm' fix={1}></Data>
          </Col>
          <Col xs={4}>
            <Data name='Total' value={oldData ? null : stationData.totalrain} unit='mm' fix={1}></Data>
          </Col>
        </Row>
      </Container>
      <Container className='text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded'>
        <div className='text-left font-weight-bold'>IN</div>
        <Row>
          <Col xs={6}>
            <Data name='Temperature' value={oldData ? null : stationData.tempin} unit='°C' fix={1}></Data>
            <Trend data={stationTrendData.tempin} range={1.5}></Trend>
          </Col>
          <Col xs={6}>
            <Data name='Humidity' value={oldData ? null : stationData.humidityin} unit='%' fix={0}></Data>
            <Trend data={stationTrendData.humidityin} range={10}></Trend>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

