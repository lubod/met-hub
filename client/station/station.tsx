/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { observer } from "mobx-react";
import moment from "moment";
import WindRose from "./wind-rose/wind-rose";
import DataAlone from "../data/dataAlone";
import Text from "../text/text";
import DataWithTrend from "../dataWithTrend/dataWithTrend";
import { STATION_MEASUREMENTS_DESC } from "../../common/stationModel";
import { AppContext } from "..";
import { LoadImg } from "../data/loadImg";
import { Myhr } from "../data/myhr";
import { MyContainer } from "../data/mycontainer";

type StationProps = {
  appContext: AppContext;
};

const Station = observer(({ appContext }: StationProps) => {
  console.info(
    "station render",
    appContext.authData.isAuth,
    appContext.stationData.oldData,
    appContext.headerData.id
  );

  return (
    <div className="main">
      <MyContainer>
        <Row className="mt-3">
          <Col xs={6} className="text-left font-weight-bold">
            <div>CURRENT DATA</div>
          </Col>
          <Col xs={4} />
          <Col xs={2}>
            <Button
              variant="link btn-sm"
              onClick={() => {
                appContext.stationCtrl.fetchData();
                appContext.stationCtrl.fetchTrendData();
              }}
            >
              <LoadImg
                rotate={
                  appContext.stationData.loading ||
                  appContext.stationData.oldData
                }
                src="icons8-refresh-25.svg"
                alt=""
              />
            </Button>
          </Col>
        </Row>
        <Row className={appContext.stationData.oldData ? "text-danger" : ""}>
          <Col xs={4}>
            <Text name="Place" value={appContext.stationData.data.place} />
          </Col>
          <Col xs={4}>
            <Text
              name="Date"
              value={moment(appContext.stationData.data.timestamp).format(
                "DD MMM"
              )}
            />
          </Col>
          <Col xs={4}>
            <Text
              name="Data time"
              value={moment(appContext.stationData.data.timestamp).format(
                "HH:mm:ss"
              )}
            />
          </Col>
        </Row>
        <Myhr />
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
          color={STATION_MEASUREMENTS_DESC.WINDDIR.color}
        />
        <Myhr />
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
              onClick={() =>
                appContext.setMeasurementAndLoad(
                  STATION_MEASUREMENTS_DESC.TEMPERATURE
                )
              }
              color={STATION_MEASUREMENTS_DESC.TEMPERATURE.color}
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
              onClick={() =>
                appContext.setMeasurementAndLoad(
                  STATION_MEASUREMENTS_DESC.HUMIDITY
                )
              }
              color={STATION_MEASUREMENTS_DESC.HUMIDITY.color}
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
              onClick={() =>
                appContext.setMeasurementAndLoad(
                  STATION_MEASUREMENTS_DESC.PRESSURE
                )
              }
              color={STATION_MEASUREMENTS_DESC.PRESSURE.color}
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
              onClick={() =>
                appContext.setMeasurementAndLoad(
                  STATION_MEASUREMENTS_DESC.SOLAR
                )
              }
              color={STATION_MEASUREMENTS_DESC.SOLAR.color}
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
              onClick={() =>
                appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.UV)
              }
              color={STATION_MEASUREMENTS_DESC.UV.color}
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
              onClick={() =>
                appContext.setMeasurementAndLoad(
                  STATION_MEASUREMENTS_DESC.RAINRATE
                )
              }
              color={STATION_MEASUREMENTS_DESC.RAINRATE.color}
            />
          </Col>
        </Row>
        <Myhr />
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
                  className="small text-light"
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
                      : parseFloat(appContext.stationData.raindata[0].sum)
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
                      : parseFloat(appContext.stationData.raindata[1].sum)
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
                      : parseFloat(appContext.stationData.raindata[2].sum)
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
                      : parseFloat(appContext.stationData.raindata[3].sum)
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
                      : parseFloat(appContext.stationData.raindata[4].sum)
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
                      : parseFloat(appContext.stationData.raindata[5].sum)
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
                      : parseFloat(appContext.stationData.raindata[6].sum)
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
                      : parseFloat(appContext.stationData.raindata[7].sum)
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
            <Myhr />
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
                  onClick={() =>
                    appContext.setMeasurementAndLoad(
                      STATION_MEASUREMENTS_DESC.TEMPERATUREIN
                    )
                  }
                  color={STATION_MEASUREMENTS_DESC.TEMPERATUREIN.color}
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
                  onClick={() =>
                    appContext.setMeasurementAndLoad(
                      STATION_MEASUREMENTS_DESC.HUMIDITYIN
                    )
                  }
                  color={STATION_MEASUREMENTS_DESC.HUMIDITYIN.color}
                />
              </Col>
            </Row>
          </>
        )}
      </MyContainer>
    </div>
  );
});

export default Station;
