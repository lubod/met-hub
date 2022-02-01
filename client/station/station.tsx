/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { observer } from "mobx-react";
import WindRose from "../wind-rose/wind-rose";
import Data from "../data/data";
import Text from "../text/text";
import { AppContextP, StationDataP } from "..";
import DataWithTrend from "../dataWithTrend/dataWithTrend";
import MapModal from "../mapModal";

const Station = observer(() => {
  const [modalShow, setModalShow] = React.useState(false);
  const appContext = useContext(AppContextP);

  const handleClose = () => {
    setModalShow(false);
  };

  const handleShow = () => {
    if (appContext.auth.isAuthenticated()) {
      setModalShow(true);
    }
  };

  console.info("station render");

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
    <div className="main">
      <Container className="text-center text-light my-2 py-2 mx-auto border-primary bg-very-dark rounded shadow">
        <Row className={station.oldData ? "text-danger" : ""}>
          <Col xs={4} onClick={handleShow}>
            <Text name="Place" value={station.data.place} />
            <div onClick={(e) => e.stopPropagation()}>
              <MapModal modalShow={modalShow} handleClose={handleClose} />
            </div>
          </Col>
          <Col xs={4}>
            <Text name="Date" value={station.data.date} />
          </Col>
          <Col xs={4}>
            <Text name="Data time" value={station.data.time} />
          </Col>
        </Row>
      </Container>
      <Container className="text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded">
        <WindRose
          gustTrend={station.trendData.windgust}
          speedTrend={station.trendData.windspeed}
          dirTrend={station.trendData.winddir}
          speed={station.oldData ? null : station.data.windspeed}
          dir={station.oldData ? null : station.data.winddir}
          gust={station.oldData ? null : station.data.windgust}
          dailyGust={station.oldData ? null : station.data.maxdailygust}
        />
      </Container>
      <Container className="text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded">
        <Row>
          <Col xs={4}>
            <DataWithTrend
              name="Temperature"
              value={station.oldData ? null : station.data.temp}
              unit="°C"
              fix={1}
              data={station.trendData.temp}
              range={1.6}
              couldBeNegative
              measurement="stanica:temp"
            />
          </Col>
          <Col xs={4}>
            <DataWithTrend
              name="Humidity"
              value={station.oldData ? null : station.data.humidity}
              unit="%"
              fix={0}
              data={station.trendData.humidity}
              range={10}
              couldBeNegative={false}
              measurement="stanica:humidity"
            />
          </Col>
          <Col xs={4}>
            <DataWithTrend
              name="Pressure"
              value={station.oldData ? null : station.data.pressurerel}
              unit="hPa"
              fix={1}
              data={station.trendData.pressurerel}
              range={1}
              couldBeNegative={false}
              measurement="stanica:pressurerel"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <DataWithTrend
              name="Radiation"
              value={station.oldData ? null : station.data.solarradiation}
              unit="W/m2"
              fix={0}
              data={station.trendData.solarradiation}
              range={100}
              couldBeNegative={false}
              measurement="stanica:solarradiation"
            />
          </Col>
          <Col xs={4}>
            <DataWithTrend
              name="UV"
              value={station.oldData ? null : station.data.uv}
              unit=""
              fix={0}
              data={station.trendData.uv}
              range={3}
              couldBeNegative={false}
              measurement="stanica:uv"
            />
          </Col>
          <Col xs={4}>
            <DataWithTrend
              name="Rain Rate"
              value={station.oldData ? null : station.data.rainrate}
              unit="mm/h"
              fix={1}
              data={station.trendData.rainrate}
              range={1}
              couldBeNegative={false}
              measurement="stanica:rainrate"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <Data
              name="Event Rain"
              value={station.oldData ? null : station.data.eventrain}
              unit="mm"
              fix={1}
            />
          </Col>
          <Col xs={4}>
            <Data
              name="Hourly"
              value={station.oldData ? null : station.data.hourlyrain}
              unit="mm"
              fix={1}
            />
          </Col>
          <Col xs={4}>
            <Data
              name="Daily"
              value={station.oldData ? null : station.data.dailyrain}
              unit="mm"
              fix={1}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <Data
              name="Weekly"
              value={station.oldData ? null : station.data.weeklyrain}
              unit="mm"
              fix={1}
            />
          </Col>
          <Col xs={4}>
            <Data
              name="Monthly"
              value={station.oldData ? null : station.data.monthlyrain}
              unit="mm"
              fix={1}
            />
          </Col>
          <Col xs={4}>
            <Data
              name="Total"
              value={station.oldData ? null : station.data.totalrain}
              unit="mm"
              fix={1}
            />
          </Col>
        </Row>
      </Container>
      {appContext.auth.isAuthenticated() && (
        <Container className="text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded">
          <div className="text-left font-weight-bold">IN</div>
          <Row>
            <Col xs={6}>
              <DataWithTrend
                name="Temperature"
                value={station.oldData ? null : station.data.tempin}
                unit="°C"
                fix={1}
                data={station.trendData.tempin}
                range={1.6}
                couldBeNegative
                measurement="stanica:tempin"
              />
            </Col>
            <Col xs={6}>
              <DataWithTrend
                name="Humidity"
                value={station.oldData ? null : station.data.humidityin}
                unit="%"
                fix={0}
                data={station.trendData.humidityin}
                range={10}
                couldBeNegative={false}
                measurement="stanica:humidityin"
              />
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
});

export default Station;
