/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { observer } from "mobx-react";
import WindRose from "./wind-rose/wind-rose";
import DataAlone from "../data/dataAlone";
import Text from "../text/text";
import DataWithTrend from "../dataWithTrend/dataWithTrend";
import MapModal from "../mapModal";
import AuthData from "../auth/authData";
import ChartsData from "../charts/chartsData";
import StationData from "./stationData";
import { STATION_MEASUREMENTS_DESC } from "../../common/stationModel";

type StationProps = {
  stationData: StationData;
  authData: AuthData;
  chartsData: ChartsData;
};

const Station = observer(
  ({ stationData, authData, chartsData }: StationProps) => {
    const [modalShow, setModalShow] = React.useState(false);

    const handleClose = () => {
      setModalShow(false);
    };

    const handleShow = () => {
      if (authData.isAuth) {
        setModalShow(true);
      }
    };

    console.info("station render", authData.isAuth, stationData.oldData);

    return (
      <div className="main">
        <Container className="text-center text-light border-primary bg-very-dark rounded mb-2 py-2">
          <Row className={stationData.oldData ? "text-danger" : ""}>
            <Col xs={4} onClick={handleShow}>
              <Text name="Place" value={stationData.data.place} />
              <div onClick={(e) => e.stopPropagation()}>
                <MapModal modalShow={modalShow} handleClose={handleClose} />
              </div>
            </Col>
            <Col xs={4}>
              <Text name="Date" value={stationData.data.date} />
            </Col>
            <Col xs={4}>
              <Text name="Data time" value={stationData.data.time} />
            </Col>
          </Row>
          <hr />
          <WindRose
            gustTrend={stationData.trendData.windgust}
            speedTrend={stationData.trendData.windspeed}
            dirTrend={stationData.trendData.winddir}
            speed={stationData.oldData ? null : stationData.data.windspeed}
            dir={stationData.oldData ? null : stationData.data.winddir}
            gust={stationData.oldData ? null : stationData.data.windgust}
            dailyGust={
              stationData.oldData ? null : stationData.data.maxdailygust
            }
            authData={authData}
            chartsData={chartsData}
          />
          <hr />
          <div className="text-left font-weight-bold">OUT</div>
          <Row>
            <Col xs={4}>
              <DataWithTrend
                label={STATION_MEASUREMENTS_DESC.TEMPERATURE.label}
                value={stationData.oldData ? null : stationData.data.temp}
                unit={STATION_MEASUREMENTS_DESC.TEMPERATURE.unit}
                fix={STATION_MEASUREMENTS_DESC.TEMPERATURE.fix}
                data={stationData.trendData.temp}
                range={STATION_MEASUREMENTS_DESC.TEMPERATURE.range}
                couldBeNegative={
                  STATION_MEASUREMENTS_DESC.TEMPERATURE.couldBeNegative
                }
                authData={authData}
                onClick={() =>
                  chartsData.setMeasurementObject(
                    STATION_MEASUREMENTS_DESC.TEMPERATURE
                  )
                }
              />
            </Col>
            <Col xs={4}>
              <DataWithTrend
                label={STATION_MEASUREMENTS_DESC.HUMIDITY.label}
                value={stationData.oldData ? null : stationData.data.humidity}
                unit={STATION_MEASUREMENTS_DESC.HUMIDITY.unit}
                fix={STATION_MEASUREMENTS_DESC.HUMIDITY.fix}
                data={stationData.trendData.humidity}
                range={STATION_MEASUREMENTS_DESC.HUMIDITY.range}
                couldBeNegative={
                  STATION_MEASUREMENTS_DESC.HUMIDITY.couldBeNegative
                }
                authData={authData}
                onClick={() =>
                  chartsData.setMeasurementObject(
                    STATION_MEASUREMENTS_DESC.HUMIDITY
                  )
                }
              />
            </Col>
            <Col xs={4}>
              <DataWithTrend
                label={STATION_MEASUREMENTS_DESC.PRESSURE.label}
                value={
                  stationData.oldData ? null : stationData.data.pressurerel
                }
                unit={STATION_MEASUREMENTS_DESC.PRESSURE.unit}
                fix={STATION_MEASUREMENTS_DESC.PRESSURE.fix}
                data={stationData.trendData.pressurerel}
                range={STATION_MEASUREMENTS_DESC.PRESSURE.range}
                couldBeNegative={
                  STATION_MEASUREMENTS_DESC.PRESSURE.couldBeNegative
                }
                authData={authData}
                onClick={() =>
                  chartsData.setMeasurementObject(
                    STATION_MEASUREMENTS_DESC.PRESSURE
                  )
                }
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <DataWithTrend
                label={STATION_MEASUREMENTS_DESC.SOLAR.label}
                value={
                  stationData.oldData ? null : stationData.data.solarradiation
                }
                unit={STATION_MEASUREMENTS_DESC.SOLAR.unit}
                fix={STATION_MEASUREMENTS_DESC.SOLAR.fix}
                data={stationData.trendData.solarradiation}
                range={STATION_MEASUREMENTS_DESC.SOLAR.range}
                couldBeNegative={
                  STATION_MEASUREMENTS_DESC.SOLAR.couldBeNegative
                }
                authData={authData}
                onClick={() =>
                  chartsData.setMeasurementObject(
                    STATION_MEASUREMENTS_DESC.SOLAR
                  )
                }
              />
            </Col>
            <Col xs={4}>
              <DataWithTrend
                label={STATION_MEASUREMENTS_DESC.UV.label}
                value={stationData.oldData ? null : stationData.data.uv}
                unit={STATION_MEASUREMENTS_DESC.UV.unit}
                fix={STATION_MEASUREMENTS_DESC.UV.fix}
                data={stationData.trendData.uv}
                range={STATION_MEASUREMENTS_DESC.UV.range}
                couldBeNegative={STATION_MEASUREMENTS_DESC.UV.couldBeNegative}
                authData={authData}
                onClick={() =>
                  chartsData.setMeasurementObject(STATION_MEASUREMENTS_DESC.UV)
                }
              />
            </Col>
            <Col xs={4}>
              <DataWithTrend
                label={STATION_MEASUREMENTS_DESC.RAINRATE.label}
                value={stationData.oldData ? null : stationData.data.rainrate}
                unit={STATION_MEASUREMENTS_DESC.RAINRATE.unit}
                fix={STATION_MEASUREMENTS_DESC.RAINRATE.fix}
                data={stationData.trendData.rainrate}
                range={STATION_MEASUREMENTS_DESC.RAINRATE.range}
                couldBeNegative={
                  STATION_MEASUREMENTS_DESC.RAINRATE.couldBeNegative
                }
                authData={authData}
                onClick={() =>
                  chartsData.setMeasurementObject(
                    STATION_MEASUREMENTS_DESC.RAINRATE
                  )
                }
              />
            </Col>
          </Row>
          <hr />
          <div className="text-left font-weight-bold">RAIN</div>
          <Row>
            <Col xs={4}>
              <DataAlone
                label={STATION_MEASUREMENTS_DESC.EVENTRAIN.label}
                value={stationData.oldData ? null : stationData.data.eventrain}
                unit={STATION_MEASUREMENTS_DESC.EVENTRAIN.unit}
                fix={STATION_MEASUREMENTS_DESC.EVENTRAIN.fix}
              />
            </Col>
            <Col xs={4}>
              <DataAlone
                label={STATION_MEASUREMENTS_DESC.HOURLYRAIN.label}
                value={stationData.oldData ? null : stationData.data.hourlyrain}
                unit={STATION_MEASUREMENTS_DESC.HOURLYRAIN.unit}
                fix={STATION_MEASUREMENTS_DESC.HOURLYRAIN.fix}
              />
            </Col>
            <Col xs={4}>
              <DataAlone
                label={STATION_MEASUREMENTS_DESC.DAILYRAIN.label}
                value={stationData.oldData ? null : stationData.data.dailyrain}
                unit={STATION_MEASUREMENTS_DESC.DAILYRAIN.unit}
                fix={STATION_MEASUREMENTS_DESC.DAILYRAIN.fix}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <DataAlone
                label={STATION_MEASUREMENTS_DESC.WEEKLYRAIN.label}
                value={stationData.oldData ? null : stationData.data.weeklyrain}
                unit={STATION_MEASUREMENTS_DESC.WEEKLYRAIN.unit}
                fix={STATION_MEASUREMENTS_DESC.WEEKLYRAIN.fix}
              />
            </Col>
            <Col xs={4}>
              <DataAlone
                label={STATION_MEASUREMENTS_DESC.MONTHLYRAIN.label}
                value={
                  stationData.oldData ? null : stationData.data.monthlyrain
                }
                unit={STATION_MEASUREMENTS_DESC.MONTHLYRAIN.unit}
                fix={STATION_MEASUREMENTS_DESC.MONTHLYRAIN.fix}
              />
            </Col>
            <Col xs={4}>
              <DataAlone
                label={STATION_MEASUREMENTS_DESC.TOTALRAIN.label}
                value={stationData.oldData ? null : stationData.data.totalrain}
                unit={STATION_MEASUREMENTS_DESC.TOTALRAIN.unit}
                fix={STATION_MEASUREMENTS_DESC.TOTALRAIN.fix}
              />
            </Col>
          </Row>
          {authData.isAuth && (
            <>
              <hr />
              <div className="text-left font-weight-bold">IN</div>
              <Row>
                <Col xs={6}>
                  <DataWithTrend
                    label={STATION_MEASUREMENTS_DESC.TEMPERATUREIN.label}
                    value={stationData.oldData ? null : stationData.data.tempin}
                    unit={STATION_MEASUREMENTS_DESC.TEMPERATUREIN.unit}
                    fix={STATION_MEASUREMENTS_DESC.TEMPERATUREIN.fix}
                    data={stationData.trendData.tempin}
                    range={STATION_MEASUREMENTS_DESC.TEMPERATUREIN.range}
                    couldBeNegative={
                      STATION_MEASUREMENTS_DESC.TEMPERATUREIN.couldBeNegative
                    }
                    authData={authData}
                    onClick={() =>
                      chartsData.setMeasurementObject(
                        STATION_MEASUREMENTS_DESC.TEMPERATUREIN
                      )
                    }
                  />
                </Col>
                <Col xs={6}>
                  <DataWithTrend
                    label={STATION_MEASUREMENTS_DESC.HUMIDITYIN.label}
                    value={
                      stationData.oldData ? null : stationData.data.humidityin
                    }
                    unit={STATION_MEASUREMENTS_DESC.HUMIDITYIN.unit}
                    fix={STATION_MEASUREMENTS_DESC.HUMIDITYIN.fix}
                    data={stationData.trendData.humidityin}
                    range={STATION_MEASUREMENTS_DESC.HUMIDITYIN.range}
                    couldBeNegative={
                      STATION_MEASUREMENTS_DESC.HUMIDITYIN.couldBeNegative
                    }
                    authData={authData}
                    onClick={() =>
                      chartsData.setMeasurementObject(
                        STATION_MEASUREMENTS_DESC.HUMIDITYIN
                      )
                    }
                  />
                </Col>
              </Row>
            </>
          )}
        </Container>
      </div>
    );
  }
);

export default Station;
