import React from "react";
import { Button, Dropdown, DropdownButton, Row, Col } from "react-bootstrap";
import { observer } from "mobx-react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Chart from "./chart";
import Text from "../misc/text";
import WindDirChart from "./windDirChart";
import RainChart from "./rainChart";
import { LoadImg } from "../misc/loadImg";
import { Myhr } from "../misc/myhr";
import { MyContainer } from "../misc/mycontainer";
import { AppContext } from "..";

type ChartsProps = {
  appContext: AppContext;
};

const Charts = observer(
  ({
    appContext,
  }: // range
  ChartsProps) => (
    // console.info("render charts", chartsData);
    // const map = useMap();
    // map.invalidateSize();
    <MyContainer>
      {(appContext.authCtrl.authData.id ===
        appContext.chartsCtrl.chartsData.station.owner ||
        appContext.authCtrl.authData.id ===
          appContext.authCtrl.authData.admin) && (
        <>
          <Row className="mt-3">
            <Col xs={6} className="text-left font-weight-bold">
              <div>HISTORICAL DATA</div>
            </Col>
            <Col xs={4} />
            <Col xs={2}>
              <Button
                variant="link btn-sm"
                onClick={() => {
                  appContext.chartsCtrl.chartsData.setPage(0);
                  appContext.chartsCtrl.reload();
                }}
              >
                <LoadImg
                  rotate={appContext.chartsCtrl.chartsData.loading}
                  src="icons8-refresh-25.svg"
                  alt=""
                />
              </Button>
            </Col>
          </Row>
          <Row className="mt-3 mb-3">
            <Col xs={4} className="text-left">
              <div className="d-grid gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    appContext.chartsCtrl.chartsData.setPage(
                      appContext.chartsCtrl.chartsData.page - 1,
                    );
                    appContext.chartsCtrl.reload();
                  }}
                >
                  Prev
                </Button>
              </div>
            </Col>
            <Col xs={4}>
              <div className="d-grid gap-2">
                <DropdownButton
                  id="dropdown-range-button"
                  title={appContext.chartsCtrl.chartsData.range.split("|")[1]}
                  onSelect={(e) => {
                    appContext.chartsCtrl.chartsData.setRange(e);
                    appContext.chartsCtrl.reload();
                  }}
                >
                  <Dropdown.Item eventKey="3600|1 hour">1 hour</Dropdown.Item>
                  <Dropdown.Item eventKey="10800|3 hours">
                    3 hours
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="21600|6 hours">
                    6 hours
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="43200|12 hours">
                    12 hours
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="86400|1 day">1 day</Dropdown.Item>
                  <Dropdown.Item eventKey="259200|3 days">3 days</Dropdown.Item>
                  <Dropdown.Item eventKey="604800|1 week">1 week</Dropdown.Item>
                  <Dropdown.Item eventKey="2419200|4 weeks">
                    4 weeks
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="31536000|1 year">
                    1 year
                  </Dropdown.Item>
                </DropdownButton>
              </div>
            </Col>
            <Col xs={4}>
              <div className="d-grid gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    appContext.chartsCtrl.chartsData.setPage(
                      appContext.chartsCtrl.chartsData.page < 0
                        ? appContext.chartsCtrl.chartsData.page + 1
                        : 0,
                    );
                    appContext.chartsCtrl.reload();
                  }}
                >
                  Next
                </Button>
              </div>
            </Col>
          </Row>
          <Myhr />
          <Row className="mb-2">
            <Col xs={12}>
              <div className="d-grid gap-2">
                <DropdownButton
                  id="dropdown-measurement-button"
                  title={`${appContext.chartsCtrl.chartsData.measurement.label} ${appContext.chartsCtrl.chartsData.measurement.unit}`}
                  onSelect={(e) => {
                    appContext.chartsCtrl.chartsData.setMeasurement(e);
                    appContext.chartsCtrl.reload();
                  }}
                >
                  {appContext.chartsCtrl.chartsData.measurements.map((m) => (
                    <Dropdown.Item
                      key={`${m.table}${m.label}`}
                      eventKey={JSON.stringify(m)}
                    >
                      {`${m.label} ${m.unit}`}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <Text
                name="First"
                value={
                  appContext.chartsCtrl.chartsData.cdata.first == null
                    ? ""
                    : appContext.chartsCtrl.chartsData.cdata.first.toFixed(1)
                }
              />
            </Col>
            <Col xs={4}>
              <Text
                name="Page"
                value={
                  appContext.chartsCtrl.chartsData.page == null
                    ? ""
                    : appContext.chartsCtrl.chartsData.page.toFixed(0)
                }
              />
            </Col>
            <Col xs={4}>
              <Text
                name="Last"
                value={
                  appContext.chartsCtrl.chartsData.cdata.last == null
                    ? ""
                    : appContext.chartsCtrl.chartsData.cdata.last.toFixed(1)
                }
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <Text
                name="Min"
                value={
                  appContext.chartsCtrl.chartsData.cdata.min == null
                    ? ""
                    : appContext.chartsCtrl.chartsData.cdata.min.toFixed(1)
                }
              />
            </Col>
            <Col xs={4}>
              <Text
                name="Max"
                value={
                  appContext.chartsCtrl.chartsData.cdata.max == null
                    ? ""
                    : appContext.chartsCtrl.chartsData.cdata.max.toFixed(1)
                }
              />
            </Col>
            <Col xs={4}>
              <Text
                name="Avg"
                value={
                  appContext.chartsCtrl.chartsData.cdata.avg == null
                    ? ""
                    : appContext.chartsCtrl.chartsData.cdata.avg.toFixed(1)
                }
              />
            </Col>
          </Row>
          <Myhr />
          <Row>
            {appContext.chartsCtrl.chartsData.measurement.chartType === "" && (
              <Chart
                chdata={appContext.chartsCtrl.chartsData.hdata}
                xkey="timestamp"
                ykey={appContext.chartsCtrl.chartsData.measurement.col}
                y2key={appContext.chartsCtrl.chartsData.measurement.col2}
                yDomainMin={appContext.chartsCtrl.chartsData.cdata.yDomainMin}
                yDomainMax={appContext.chartsCtrl.chartsData.cdata.yDomainMax}
                color={appContext.chartsCtrl.chartsData.measurement.color}
                range={appContext.chartsCtrl.chartsData.cdata.range}
                xDomainMin={appContext.chartsCtrl.chartsData.cdata.xDomainMin}
                xDomainMax={appContext.chartsCtrl.chartsData.cdata.xDomainMax}
              />
            )}
            {appContext.chartsCtrl.chartsData.measurement.chartType ===
              "winddir" && (
              <WindDirChart
                chdata={appContext.chartsCtrl.chartsData.hdata}
                xkey="timestamp"
                ykey={appContext.chartsCtrl.chartsData.measurement.col}
                color={appContext.chartsCtrl.chartsData.measurement.color}
                range={appContext.chartsCtrl.chartsData.cdata.range}
              />
            )}
            {appContext.chartsCtrl.chartsData.measurement.chartType ===
              "rain" && (
              <RainChart
                chdata={appContext.chartsCtrl.chartsData.hdata}
                xkey="timestamp"
                ykey={appContext.chartsCtrl.chartsData.measurement.col}
                yDomainMin={appContext.chartsCtrl.chartsData.cdata.yDomainMin}
                yDomainMax={appContext.chartsCtrl.chartsData.cdata.yDomainMax}
                color={appContext.chartsCtrl.chartsData.measurement.color}
                range={appContext.chartsCtrl.chartsData.cdata.range}
              />
            )}
          </Row>
          <Myhr />
        </>
      )}
      <Row>
        {appContext.chartsCtrl.chartsData.station != null && (
          <div>
            <MapContainer center={[48.6776, 19.699]} zoom={6} scrollWheelZoom>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[
                  appContext.chartsCtrl.chartsData.station.lat,
                  appContext.chartsCtrl.chartsData.station.lon,
                ]}
              >
                <Popup>
                  {appContext.chartsCtrl.chartsData.station.lat},{" "}
                  {appContext.chartsCtrl.chartsData.station.lon}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </Row>
    </MyContainer>
  ),
);

export default Charts;
