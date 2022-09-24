import React from "react";
import {
  Button,
  ButtonGroup,
  Container,
  Dropdown,
  DropdownButton,
  Row,
  Col,
} from "react-bootstrap";
import { observer } from "mobx-react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Chart from "./chart";
import Text from "../text/text";
import WindDirChart from "./windDirChart";
import RainChart from "./rainChart";
import { AppContext } from "..";

type ChartsProps = {
  appContext: AppContext;
};

const Charts = observer(
  ({
    appContext,
  }: // range
  ChartsProps) => (
    <Container className="text-center text-light border-primary bg-very-dark rounded mb-2 py-2">
      <Row className="mt-3">
        <Col xs={6} className="text-left font-weight-bold">
          <div>HISTORICAL DATA</div>
        </Col>
        <Col xs={4} />
        <Col xs={2}>
          <Button
            variant="link btn-sm"
            onClick={() => {
              appContext.chartsData.setPage(0);
              appContext.chartsCtrl.load(
                appContext.chartsData.offset,
                appContext.chartsData.page,
                appContext.chartsData.measurement
              );
            }}
          >
            <img src="icons8-refresh-25.svg" alt="" />
          </Button>
        </Col>
      </Row>
      <Row className="mt-3 mb-3">
        <ButtonGroup>
          <DropdownButton
            id="dropdown-measurement-button"
            title="Sensor"
            onSelect={(e) => {
              appContext.chartsData.setMeasurement(e);
              appContext.chartsCtrl.load(
                appContext.chartsData.offset,
                appContext.chartsData.page,
                appContext.chartsData.measurement
              );
            }}
          >
            {appContext.chartsData.measurements.map((m) => (
              <Dropdown.Item key={m.table} eventKey={JSON.stringify(m)}>
                {m.label}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          <DropdownButton
            id="dropdown-range-button"
            title="Range"
            onSelect={(e) => {
              appContext.chartsData.setOffset(e);
              appContext.chartsCtrl.load(
                appContext.chartsData.offset,
                appContext.chartsData.page,
                appContext.chartsData.measurement
              );
            }}
          >
            <Dropdown.Item eventKey="3600|1 hour">1 hour</Dropdown.Item>
            <Dropdown.Item eventKey="10800|3 hours">3 hours</Dropdown.Item>
            <Dropdown.Item eventKey="21600|6 hours">6 hours</Dropdown.Item>
            <Dropdown.Item eventKey="43200|12 hours">12 hours</Dropdown.Item>
            <Dropdown.Item eventKey="86400|1 day">1 day</Dropdown.Item>
            <Dropdown.Item eventKey="259200|3 days">3 days</Dropdown.Item>
            <Dropdown.Item eventKey="604800|1 week">1 week</Dropdown.Item>
            <Dropdown.Item eventKey="2419200|4 weeks">4 weeks</Dropdown.Item>
            <Dropdown.Item eventKey="31536000|1 year">1 year</Dropdown.Item>
          </DropdownButton>
          <Button
            // variant="outline-secondary"
            onClick={() => {
              appContext.chartsData.setPage(appContext.chartsData.page - 1);
              appContext.chartsCtrl.load(
                appContext.chartsData.offset,
                appContext.chartsData.page,
                appContext.chartsData.measurement
              );
            }}
          >
            &lt;
          </Button>
          <Button
            // variant="outline-secondary"
            onClick={() => {
              appContext.chartsData.setPage(
                appContext.chartsData.page < 0
                  ? appContext.chartsData.page + 1
                  : 0
              );
              appContext.chartsCtrl.load(
                appContext.chartsData.offset,
                appContext.chartsData.page,
                appContext.chartsData.measurement
              );
            }}
          >
            &gt;
          </Button>
        </ButtonGroup>
      </Row>
      <hr />
      <Row>
        <Col xs={6}>
          <Text
            name="Sensor"
            value={`${appContext.chartsData.cdata.label} ${appContext.chartsData.cdata.unit}`}
          />
        </Col>
        <Col xs={6}>
          <Text name="Range" value={appContext.chartsData.cdata.range} />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <Text
            name="Last"
            value={
              appContext.chartsData.cdata.last == null
                ? ""
                : appContext.chartsData.cdata.last
            }
          />
        </Col>
        <Col xs={4}>
          <Text
            name="Page"
            value={
              appContext.chartsData.page == null
                ? ""
                : appContext.chartsData.page.toFixed(0)
            }
          />
        </Col>
        <Col xs={4}>
          <Text
            name="Sum"
            value={
              appContext.chartsData.cdata.sum == null
                ? ""
                : appContext.chartsData.cdata.sum
            }
          />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <Text
            name="Min"
            value={
              appContext.chartsData.cdata.min == null
                ? ""
                : appContext.chartsData.cdata.min.toFixed(1)
            }
          />
        </Col>
        <Col xs={4}>
          <Text
            name="Max"
            value={
              appContext.chartsData.cdata.max == null
                ? ""
                : appContext.chartsData.cdata.max.toFixed(1)
            }
          />
        </Col>
        <Col xs={4}>
          <Text name="Avg" value={appContext.chartsData.cdata.avg} />
        </Col>
      </Row>
      <hr />
      <Row>
        {appContext.chartsData.measurement.chartType === "" && (
          <Chart
            chdata={appContext.chartsData.hdata}
            xkey="timestamp"
            ykey={appContext.chartsData.measurement.col}
            y2key={appContext.chartsData.measurement.col2}
            domainMin={appContext.chartsData.cdata.domainMin}
            domainMax={appContext.chartsData.cdata.domainMax}
            color={appContext.chartsData.measurement.color}
            range={appContext.chartsData.cdata.range}
          />
        )}
        {appContext.chartsData.measurement.chartType === "winddir" && (
          <WindDirChart
            chdata={appContext.chartsData.hdata}
            xkey="timestamp"
            ykey={appContext.chartsData.measurement.col}
            color={appContext.chartsData.measurement.color}
            range={appContext.chartsData.cdata.range}
          />
        )}
        {appContext.chartsData.measurement.chartType === "rain" && (
          <RainChart
            chdata={appContext.chartsData.hdata}
            xkey="timestamp"
            ykey={appContext.chartsData.measurement.col}
            domainMin={appContext.chartsData.cdata.domainMin}
            domainMax={appContext.chartsData.cdata.domainMax}
            color={appContext.chartsData.measurement.color}
            range={appContext.chartsData.cdata.range}
          />
        )}
      </Row>
      <hr />
      <Row>
        <MapContainer center={[48.2482, 17.0589]} zoom={13} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[48.2482, 17.0589]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </Row>
    </Container>
  )
);

export default Charts;
