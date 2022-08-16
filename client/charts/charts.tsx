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
import Chart from "./chart";
import Text from "../text/text";
import ChartsData from "./chartsData";
import { IMeasurementDesc } from "../../common/measurementDesc";

type ChartsProps = {
  chartsData: ChartsData;
  measurements: IMeasurementDesc[];
};

const Charts = observer(
  ({
    chartsData,
    measurements,
  }: // range
  ChartsProps) => (
    <Container className="text-center text-light border-primary bg-very-dark rounded mb-2 py-2">
      <Row className="mt-3 mb-3">
        <ButtonGroup>
          <DropdownButton
            id="dropdown-measurement-button"
            title="Sensor"
            onSelect={(e) => chartsData.setMeasurement(e)}
          >
            {measurements.map((m) => (
              <Dropdown.Item key={m.db} eventKey={JSON.stringify(m)}>
                {m.label}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          <DropdownButton
            id="dropdown-range-button"
            title="Range"
            onSelect={(e) => chartsData.setOffset(e)}
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
            onClick={() => chartsData.setPage(chartsData.page - 1)}
          >
            &lt;
          </Button>
          <Button
            // variant="outline-secondary"
            onClick={() =>
              chartsData.setPage(chartsData.page < 0 ? chartsData.page + 1 : 0)
            }
          >
            &gt;
          </Button>
          <Button
            // variant="outline-secondary"
            onClick={() => chartsData.setPage(0)}
          >
            O
          </Button>
        </ButtonGroup>
      </Row>
      <Row>
        <Col xs={12}>
          <Text
            name="Sensor"
            value={`${chartsData.cdata.label} ${chartsData.cdata.unit}`}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <Text name="Range" value={chartsData.cdata.range} />
        </Col>
        <Col xs={4}>
          <Text
            name="Last"
            value={chartsData.cdata.last == null ? "" : chartsData.cdata.last}
          />
        </Col>
        <Col xs={4}>
          <Text
            name="Page"
            value={chartsData.page == null ? "" : chartsData.page.toFixed(0)}
          />
        </Col>
        <Col xs={4}>
          <Text
            name="Min"
            value={
              chartsData.cdata.min == null
                ? ""
                : chartsData.cdata.min.toFixed(1)
            }
          />
        </Col>
        <Col xs={4}>
          <Text
            name="Max"
            value={
              chartsData.cdata.max == null
                ? ""
                : chartsData.cdata.max.toFixed(1)
            }
          />
        </Col>
        <Col xs={4}>
          <Text name="Avg" value={chartsData.cdata.avg} />
        </Col>
      </Row>
      <hr />
      <Row>
        <Chart
          chdata={chartsData.hdata}
          xkey="timestamp"
          ykey={chartsData.measurement.yname.split(":")[0]}
          y2key={chartsData.measurement.yname.split(":")[1]} // todo
          domainMin={chartsData.cdata.domainMin}
          domainMax={chartsData.cdata.domainMax}
        />
      </Row>
    </Container>
  )
);

export default Charts;
