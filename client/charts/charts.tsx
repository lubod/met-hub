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
import ChartsCtrl from "./chartsCtrl";

type ChartsProps = {
  chartsCtrl: ChartsCtrl;
};

const Charts = observer(
  ({
    chartsCtrl,
  }: // range
  ChartsProps) => (
    // console.info("render charts", chartsData);
    // const map = useMap();
    // map.invalidateSize();
    <MyContainer>
      <Row className="mt-3">
        <Col xs={6} className="text-left font-weight-bold">
          <div>HISTORICAL DATA</div>
        </Col>
        <Col xs={4} />
        <Col xs={2}>
          <Button
            variant="link btn-sm"
            onClick={() => {
              chartsCtrl.chartsData.setPage(0);
              chartsCtrl.reload();
            }}
          >
            <LoadImg
              rotate={chartsCtrl.chartsData.loading}
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
                chartsCtrl.chartsData.setPage(chartsCtrl.chartsData.page - 1);
                chartsCtrl.reload();
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
              title={chartsCtrl.chartsData.range.split("|")[1]}
              onSelect={(e) => {
                chartsCtrl.chartsData.setRange(e);
                chartsCtrl.reload();
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
          </div>
        </Col>
        <Col xs={4}>
          <div className="d-grid gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                chartsCtrl.chartsData.setPage(
                  chartsCtrl.chartsData.page < 0
                    ? chartsCtrl.chartsData.page + 1
                    : 0
                );
                chartsCtrl.reload();
              }}
            >
              Next
            </Button>
          </div>
        </Col>
      </Row>
      <Myhr />
      <Row>
        <Col xs={12}>
          <div className="d-grid gap-2">
            <DropdownButton
              id="dropdown-measurement-button"
              title={`${chartsCtrl.chartsData.measurement.label} ${chartsCtrl.chartsData.measurement.unit}`}
              onSelect={(e) => {
                chartsCtrl.chartsData.setMeasurement(e);
                chartsCtrl.reload();
              }}
            >
              {chartsCtrl.chartsData.measurements.map((m) => (
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
            name="Last"
            value={
              chartsCtrl.chartsData.cdata.last == null
                ? ""
                : chartsCtrl.chartsData.cdata.last
            }
          />
        </Col>
        <Col xs={4}>
          <Text
            name="Page"
            value={
              chartsCtrl.chartsData.page == null
                ? ""
                : chartsCtrl.chartsData.page.toFixed(0)
            }
          />
        </Col>
        <Col xs={4}>
          <Text
            name="Sum"
            value={
              chartsCtrl.chartsData.cdata.sum == null
                ? ""
                : chartsCtrl.chartsData.cdata.sum
            }
          />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <Text
            name="Min"
            value={
              chartsCtrl.chartsData.cdata.min == null
                ? ""
                : chartsCtrl.chartsData.cdata.min.toFixed(1)
            }
          />
        </Col>
        <Col xs={4}>
          <Text
            name="Max"
            value={
              chartsCtrl.chartsData.cdata.max == null
                ? ""
                : chartsCtrl.chartsData.cdata.max.toFixed(1)
            }
          />
        </Col>
        <Col xs={4}>
          <Text name="Avg" value={chartsCtrl.chartsData.cdata.avg} />
        </Col>
      </Row>
      <Myhr />
      <Row>
        {chartsCtrl.chartsData.measurement.chartType === "" && (
          <Chart
            chdata={chartsCtrl.chartsData.hdata}
            xkey="timestamp"
            ykey={chartsCtrl.chartsData.measurement.col}
            y2key={chartsCtrl.chartsData.measurement.col2}
            yDomainMin={chartsCtrl.chartsData.cdata.yDomainMin}
            yDomainMax={chartsCtrl.chartsData.cdata.yDomainMax}
            color={chartsCtrl.chartsData.measurement.color}
            range={chartsCtrl.chartsData.cdata.range}
            xDomainMin={chartsCtrl.chartsData.cdata.xDomainMin}
            xDomainMax={chartsCtrl.chartsData.cdata.xDomainMax}
          />
        )}
        {chartsCtrl.chartsData.measurement.chartType === "winddir" && (
          <WindDirChart
            chdata={chartsCtrl.chartsData.hdata}
            xkey="timestamp"
            ykey={chartsCtrl.chartsData.measurement.col}
            color={chartsCtrl.chartsData.measurement.color}
            range={chartsCtrl.chartsData.cdata.range}
          />
        )}
        {chartsCtrl.chartsData.measurement.chartType === "rain" && (
          <RainChart
            chdata={chartsCtrl.chartsData.hdata}
            xkey="timestamp"
            ykey={chartsCtrl.chartsData.measurement.col}
            yDomainMin={chartsCtrl.chartsData.cdata.yDomainMin}
            yDomainMax={chartsCtrl.chartsData.cdata.yDomainMax}
            color={chartsCtrl.chartsData.measurement.color}
            range={chartsCtrl.chartsData.cdata.range}
          />
        )}
      </Row>
      <Myhr />
      <Row>
        <div>
          <MapContainer center={[48.6776, 19.699]} zoom={6} scrollWheelZoom>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[chartsCtrl.chartsData.lat, chartsCtrl.chartsData.lon]}
            >
              <Popup>
                {chartsCtrl.chartsData.lat}, {chartsCtrl.chartsData.lon}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </Row>
    </MyContainer>
  )
);

export default Charts;
