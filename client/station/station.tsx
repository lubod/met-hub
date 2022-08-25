/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { observer } from "mobx-react";
import WindRose from "./wind-rose/wind-rose";
import DataAlone from "../data/dataAlone";
import Text from "../text/text";
import DataWithTrend from "../dataWithTrend/dataWithTrend";
import MapModal from "../mapModal";
import { STATION_MEASUREMENTS_DESC } from "../../common/stationModel";
import { AppContext } from "..";

type StationProps = {
  appContext: AppContext;
};

const Station = observer(({ appContext }: StationProps) => {
  const [modalShow, setModalShow] = React.useState(false);

  const handleClose = () => {
    setModalShow(false);
  };

  const handleShow = () => {
    if (appContext.authData.isAuth) {
      setModalShow(true);
    }
  };

  console.info(
    "station render",
    appContext.authData.isAuth,
    appContext.stationData.oldData
  );

  return (
    <div className="main">
      <Container className="text-center text-light border-primary bg-very-dark rounded mb-2 py-2">
        <Row className={appContext.stationData.oldData ? "text-danger" : ""}>
          <Col xs={4} onClick={handleShow}>
            <Text name="Place" value={appContext.stationData.data.place} />
            <div onClick={(e) => e.stopPropagation()}>
              <MapModal modalShow={modalShow} handleClose={handleClose} />
            </div>
          </Col>
          <Col xs={4}>
            <Text name="Date" value={appContext.stationData.data.date} />
          </Col>
          <Col xs={4}>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                appContext.stationCtrl.fetchData();
                appContext.stationCtrl.fetchTrendData();
              }}
            >
              <Text name="Data time" value={appContext.stationData.data.time} />
            </div>
          </Col>
        </Row>
        <hr />
        <WindRose
          gustTrend={appContext.stationData.trendData.windgust}
          speedTrend={appContext.stationData.trendData.windspeed}
          dirTrend={appContext.stationData.trendData.winddir}
          speed={
            appContext.stationData.oldData
              ? null
              : appContext.stationData.data.windspeed
          }
          dir={
            appContext.stationData.oldData
              ? null
              : appContext.stationData.data.winddir
          }
          gust={
            appContext.stationData.oldData
              ? null
              : appContext.stationData.data.windgust
          }
          dailyGust={
            appContext.stationData.oldData
              ? null
              : appContext.stationData.data.maxdailygust
          }
          appContext={appContext}
        />
        <hr />
        <div className="text-left font-weight-bold">OUT</div>
        <Row>
          <Col xs={4}>
            <DataWithTrend
              label={STATION_MEASUREMENTS_DESC.TEMPERATURE.label}
              value={
                appContext.stationData.oldData
                  ? null
                  : appContext.stationData.data.temp
              }
              unit={STATION_MEASUREMENTS_DESC.TEMPERATURE.unit}
              fix={STATION_MEASUREMENTS_DESC.TEMPERATURE.fix}
              data={appContext.stationData.trendData.temp}
              range={STATION_MEASUREMENTS_DESC.TEMPERATURE.range}
              couldBeNegative={
                STATION_MEASUREMENTS_DESC.TEMPERATURE.couldBeNegative
              }
              authData={appContext.authData} // todo
              onClick={() =>
                appContext.setMeasurementAndLoad(
                  STATION_MEASUREMENTS_DESC.TEMPERATURE
                )
              }
            />
          </Col>
          <Col xs={4}>
            <DataWithTrend
              label={STATION_MEASUREMENTS_DESC.HUMIDITY.label}
              value={
                appContext.stationData.oldData
                  ? null
                  : appContext.stationData.data.humidity
              }
              unit={STATION_MEASUREMENTS_DESC.HUMIDITY.unit}
              fix={STATION_MEASUREMENTS_DESC.HUMIDITY.fix}
              data={appContext.stationData.trendData.humidity}
              range={STATION_MEASUREMENTS_DESC.HUMIDITY.range}
              couldBeNegative={
                STATION_MEASUREMENTS_DESC.HUMIDITY.couldBeNegative
              }
              authData={appContext.authData}
              onClick={() =>
                appContext.setMeasurementAndLoad(
                  STATION_MEASUREMENTS_DESC.HUMIDITY
                )
              }
            />
          </Col>
          <Col xs={4}>
            <DataWithTrend
              label={STATION_MEASUREMENTS_DESC.PRESSURE.label}
              value={
                appContext.stationData.oldData
                  ? null
                  : appContext.stationData.data.pressurerel
              }
              unit={STATION_MEASUREMENTS_DESC.PRESSURE.unit}
              fix={STATION_MEASUREMENTS_DESC.PRESSURE.fix}
              data={appContext.stationData.trendData.pressurerel}
              range={STATION_MEASUREMENTS_DESC.PRESSURE.range}
              couldBeNegative={
                STATION_MEASUREMENTS_DESC.PRESSURE.couldBeNegative
              }
              authData={appContext.authData}
              onClick={() =>
                appContext.setMeasurementAndLoad(
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
                appContext.stationData.oldData
                  ? null
                  : appContext.stationData.data.solarradiation
              }
              unit={STATION_MEASUREMENTS_DESC.SOLAR.unit}
              fix={STATION_MEASUREMENTS_DESC.SOLAR.fix}
              data={appContext.stationData.trendData.solarradiation}
              range={STATION_MEASUREMENTS_DESC.SOLAR.range}
              couldBeNegative={STATION_MEASUREMENTS_DESC.SOLAR.couldBeNegative}
              authData={appContext.authData}
              onClick={() =>
                appContext.setMeasurementAndLoad(
                  STATION_MEASUREMENTS_DESC.SOLAR
                )
              }
            />
          </Col>
          <Col xs={4}>
            <DataWithTrend
              label={STATION_MEASUREMENTS_DESC.UV.label}
              value={
                appContext.stationData.oldData
                  ? null
                  : appContext.stationData.data.uv
              }
              unit={STATION_MEASUREMENTS_DESC.UV.unit}
              fix={STATION_MEASUREMENTS_DESC.UV.fix}
              data={appContext.stationData.trendData.uv}
              range={STATION_MEASUREMENTS_DESC.UV.range}
              couldBeNegative={STATION_MEASUREMENTS_DESC.UV.couldBeNegative}
              authData={appContext.authData}
              onClick={() =>
                appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.UV)
              }
            />
          </Col>
          <Col xs={4}>
            <DataWithTrend
              label={STATION_MEASUREMENTS_DESC.RAINRATE.label}
              value={
                appContext.stationData.oldData
                  ? null
                  : appContext.stationData.data.rainrate
              }
              unit={STATION_MEASUREMENTS_DESC.RAINRATE.unit}
              fix={STATION_MEASUREMENTS_DESC.RAINRATE.fix}
              data={appContext.stationData.trendData.rainrate}
              range={STATION_MEASUREMENTS_DESC.RAINRATE.range}
              couldBeNegative={
                STATION_MEASUREMENTS_DESC.RAINRATE.couldBeNegative
              }
              authData={appContext.authData}
              onClick={() =>
                appContext.setMeasurementAndLoad(
                  STATION_MEASUREMENTS_DESC.RAINRATE
                )
              }
            />
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xs={6}>
            <div className="text-left font-weight-bold">RAIN mm</div>
          </Col>
          <Col xs={6}>
            {appContext.authData.isAuth && (
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="Floating data"
                  checked={appContext.stationData.floatingRainData}
                  onChange={(e) => {
                    appContext.stationData.setFloatingRainData(
                      e.target.checked
                    );
                    if (e.target.checked) {
                      appContext.stationCtrl.fetchRainData();
                    }
                  }}
                />
              </Form>
            )}
          </Col>
        </Row>
        {appContext.stationData.floatingRainData === false && (
          <>
            <Row>
              <Col xs={4}>
                <DataAlone
                  label={STATION_MEASUREMENTS_DESC.EVENTRAIN.label}
                  value={
                    appContext.stationData.oldData
                      ? null
                      : appContext.stationData.data.eventrain
                  }
                  unit=""
                  fix={STATION_MEASUREMENTS_DESC.EVENTRAIN.fix}
                />
              </Col>
              <Col xs={4}>
                <DataAlone
                  label={STATION_MEASUREMENTS_DESC.HOURLYRAIN.label}
                  value={
                    appContext.stationData.oldData
                      ? null
                      : appContext.stationData.data.hourlyrain
                  }
                  unit=""
                  fix={STATION_MEASUREMENTS_DESC.HOURLYRAIN.fix}
                />
              </Col>
              <Col xs={4}>
                <DataAlone
                  label={STATION_MEASUREMENTS_DESC.DAILYRAIN.label}
                  value={
                    appContext.stationData.oldData
                      ? null
                      : appContext.stationData.data.dailyrain
                  }
                  unit=""
                  fix={STATION_MEASUREMENTS_DESC.DAILYRAIN.fix}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={4}>
                <DataAlone
                  label={STATION_MEASUREMENTS_DESC.WEEKLYRAIN.label}
                  value={
                    appContext.stationData.oldData
                      ? null
                      : appContext.stationData.data.weeklyrain
                  }
                  unit=""
                  fix={STATION_MEASUREMENTS_DESC.WEEKLYRAIN.fix}
                />
              </Col>
              <Col xs={4}>
                <DataAlone
                  label={STATION_MEASUREMENTS_DESC.MONTHLYRAIN.label}
                  value={
                    appContext.stationData.oldData
                      ? null
                      : appContext.stationData.data.monthlyrain
                  }
                  unit=""
                  fix={STATION_MEASUREMENTS_DESC.MONTHLYRAIN.fix}
                />
              </Col>
              <Col xs={4}>
                <DataAlone
                  label={STATION_MEASUREMENTS_DESC.TOTALRAIN.label}
                  value={
                    appContext.stationData.oldData
                      ? null
                      : appContext.stationData.data.totalrain
                  }
                  unit=""
                  fix={STATION_MEASUREMENTS_DESC.TOTALRAIN.fix}
                />
              </Col>
            </Row>
          </>
        )}
        {appContext.stationData.floatingRainData === true && (
          <>
            <Row>
              <Col xs={3}>
                <DataAlone
                  label="1 hour" // todo
                  value={
                    appContext.stationData.raindata == null
                      ? null
                      : parseFloat(
                          appContext.stationData.raindata[0].rows[0].sum
                        )
                  }
                  unit=""
                  fix={1}
                />
              </Col>
              <Col xs={3}>
                <DataAlone
                  label="3 hour" // todo
                  value={
                    appContext.stationData.raindata == null
                      ? null
                      : parseFloat(
                          appContext.stationData.raindata[1].rows[0].sum
                        )
                  }
                  unit=""
                  fix={1}
                />
              </Col>
              <Col xs={3}>
                <DataAlone
                  label="6 hour" // todo
                  value={
                    appContext.stationData.raindata == null
                      ? null
                      : parseFloat(
                          appContext.stationData.raindata[2].rows[0].sum
                        )
                  }
                  unit=""
                  fix={1}
                />
              </Col>
              <Col xs={3}>
                <DataAlone
                  label="12 hour" // todo
                  value={
                    appContext.stationData.raindata == null
                      ? null
                      : parseFloat(
                          appContext.stationData.raindata[3].rows[0].sum
                        )
                  }
                  unit=""
                  fix={1}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={3}>
                <DataAlone
                  label="1 day" // todo
                  value={
                    appContext.stationData.raindata == null
                      ? null
                      : parseFloat(
                          appContext.stationData.raindata[4].rows[0].sum
                        )
                  }
                  unit=""
                  fix={1}
                />
              </Col>
              <Col xs={3}>
                <DataAlone
                  label="3 days" // todo
                  value={
                    appContext.stationData.raindata == null
                      ? null
                      : parseFloat(
                          appContext.stationData.raindata[5].rows[0].sum
                        )
                  }
                  unit=""
                  fix={1}
                />
              </Col>
              <Col xs={3}>
                <DataAlone
                  label="1 week" // todo
                  value={
                    appContext.stationData.raindata == null
                      ? null
                      : parseFloat(
                          appContext.stationData.raindata[6].rows[0].sum
                        )
                  }
                  unit=""
                  fix={1}
                />
              </Col>
              <Col xs={3}>
                <DataAlone
                  label="4 weeks" // todo
                  value={
                    appContext.stationData.raindata == null
                      ? null
                      : parseFloat(
                          appContext.stationData.raindata[7].rows[0].sum
                        )
                  }
                  unit=""
                  fix={1}
                />
              </Col>
            </Row>
          </>
        )}
        {appContext.authData.isAuth && (
          <>
            <hr />
            <div className="text-left font-weight-bold">IN</div>
            <Row>
              <Col xs={6}>
                <DataWithTrend
                  label={STATION_MEASUREMENTS_DESC.TEMPERATUREIN.label}
                  value={
                    appContext.stationData.oldData
                      ? null
                      : appContext.stationData.data.tempin
                  }
                  unit={STATION_MEASUREMENTS_DESC.TEMPERATUREIN.unit}
                  fix={STATION_MEASUREMENTS_DESC.TEMPERATUREIN.fix}
                  data={appContext.stationData.trendData.tempin}
                  range={STATION_MEASUREMENTS_DESC.TEMPERATUREIN.range}
                  couldBeNegative={
                    STATION_MEASUREMENTS_DESC.TEMPERATUREIN.couldBeNegative
                  }
                  authData={appContext.authData}
                  onClick={() =>
                    appContext.setMeasurementAndLoad(
                      STATION_MEASUREMENTS_DESC.TEMPERATUREIN
                    )
                  }
                />
              </Col>
              <Col xs={6}>
                <DataWithTrend
                  label={STATION_MEASUREMENTS_DESC.HUMIDITYIN.label}
                  value={
                    appContext.stationData.oldData
                      ? null
                      : appContext.stationData.data.humidityin
                  }
                  unit={STATION_MEASUREMENTS_DESC.HUMIDITYIN.unit}
                  fix={STATION_MEASUREMENTS_DESC.HUMIDITYIN.fix}
                  data={appContext.stationData.trendData.humidityin}
                  range={STATION_MEASUREMENTS_DESC.HUMIDITYIN.range}
                  couldBeNegative={
                    STATION_MEASUREMENTS_DESC.HUMIDITYIN.couldBeNegative
                  }
                  authData={appContext.authData}
                  onClick={() =>
                    appContext.setMeasurementAndLoad(
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
});

export default Station;
