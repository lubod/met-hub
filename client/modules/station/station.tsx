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

export function Station(props: StationProps) {
  const [stationData, setStationData] = useState<StationData>(new StationData());
  const [stationTrendData, setTrendStationData] = useState<StationTrendData>(new StationTrendData());
  const [ctime, setCtime] = useState<Date>(new Date());
  const [oldData, setOldData] = useState<boolean>(false);

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

  function calculateOldData() {
    const timestamp = new Date(stationData.timestamp);
    const diff = ctime.getTime() - timestamp.getTime();
    if (diff > 180000) {
      setOldData(true);
    }
    else {
      setOldData(false);
    }
    console.info('cal old data', oldData);
  }

  useEffect(() => {
    var timer = setInterval(() => {
      setCtime(new Date());
      calculateOldData();

      if (oldData) {
        if (props.auth.isAuthenticated()) {
          fetchData('/api/getLastData/station', processData);
          fetchData('/api/getTrendData/station', processTrendData);
        }
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

  function processData(json: any) {
    if (json != null) {
      //console.info(json);
      const sdate = new Date(json.timestamp).toLocaleDateString('sk-SK').replace(' ', '');
      const stime = new Date(json.timestamp).toLocaleTimeString('sk-SK');

      setStationData({
        timestamp: json.timestamp,
        time: stime,
        date: sdate.substring(0, sdate.length - 6),
        tempin: json.tempin,
        humidityin: json.humidityin,
        temp: json.temp,
        humidity: json.humidity,
        pressurerel: json.pressurerel,
        pressureabs: json.pressureabs,
        windgust: json.windgust,
        windspeed: json.windspeed,
        winddir: json.winddir,
        maxdailygust: json.maxdailygust,
        solarradiation: json.solarradiation,
        uv: json.uv,
        rainrate: json.rainrate,
        eventrain: json.eventrain,
        hourlyrain: json.hourlyrain,
        dailyrain: json.dailyrain,
        weeklyrain: json.weeklyrain,
        monthlyrain: json.monthlyrain,
        totalrain: json.totalrain,
        place: 'Marianka'
      });

      calculateOldData();
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

