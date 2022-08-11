import React, { useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Container,
  Dropdown,
  DropdownButton,
  Row,
  Col,
} from "react-bootstrap";
import AuthData from "../auth/authData";
import Chart from "../trend/chart";
import Text from "../text/text";

type ChartsProps = {
  authData: AuthData;
};

class CData {
  min: number;

  max: number;

  avg: string;

  sum: string;

  domainMin: number;

  domainMax: number;

  name: string;

  unit: string;

  range: string;

  couldBeNegative: boolean;
}

const StationCharts = function ({
  authData,
}: // range
ChartsProps) {
  const [hdata, setHdata] = React.useState(null);
  const [cdata, setCdata] = React.useState(new CData());
  const [page, setPage] = React.useState(0);
  const [offset, setOffset] = React.useState("86400|1 day");
  const [measurement, setMeasurement] = React.useState(
    "stanica:temp|Temperature:[°C]:true"
  );

  async function load(of: string, p: number, m: string) {
    const o = parseInt(of.split("|")[0], 10) * 1000;
    // eslint-disable-next-line no-promise-executor-return
    // return new Promise((resolve) => setTimeout(resolve, 2000));
    const start = new Date(Date.now() - o + p * o);
    const end = new Date(Date.now() + p * o);
    const [m1, m2] = m.split("|");
    const url = `/api/loadData?start=${start.toISOString()}&end=${end.toISOString()}&measurement=${m1}`;
    console.info(url);

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${authData.access_token}`,
        },
      });

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }

      const newData = await response.json();
      let max: number = null;
      let min: number = null;
      let avg: string = null;
      let total: number = null;

      const [name, unit, cbn] = m2.split(":");
      let couldBeNegative = false;
      if (cbn === "true") {
        couldBeNegative = true;
      }
      const range = offset.split("|")[1];

      const y = m1.split(":")[1];
      for (let i = 0; i < newData.length; i += 1) {
        if (i === 0) {
          // console.info(newData[i]);
          const val = parseFloat(newData[i][y]);
          // eslint-disable-next-line no-multi-assign
          max = min = total = val;
        } else {
          const val = parseFloat(newData[i][y]);
          if (val > max) {
            max = val;
          }
          if (val < min) {
            min = val;
          }
          total += val;
        }
      }
      avg = (total / newData.length).toFixed(1);
      const sum = total.toFixed(1);
      const domainMin = Math.floor(min - (max / 100) * 5);
      const domainMax = Math.ceil(max + (max / 100) * 5);

      //      if (domainMin < 0 && couldBeNegative === false) {
      //      domainMin = 0;
      //      }

      setHdata(newData);
      setCdata({
        min,
        max,
        avg,
        sum,
        domainMin,
        domainMax,
        name,
        unit,
        range,
        couldBeNegative,
      });
      // console.info(min, max, avg, sum);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    load(offset, page, measurement);
  }, [page, offset, measurement]);

  return (
    <>
      <Container className="text-center text-light border-primary bg-very-dark rounded mb-2 py-2">
        <Row className="my-3">
          <ButtonGroup>
            <DropdownButton
              id="dropdown-measurement-button"
              title="Sensor"
              onSelect={(e) => setMeasurement(e)}
            >
              <Dropdown.Item eventKey="stanica:winddir|Wind direction:[km/h]:false">
                Wind direction
              </Dropdown.Item>
              <Dropdown.Item eventKey="stanica:windspeed|Wind speed:[km/h]:false">
                Wind speed
              </Dropdown.Item>
              <Dropdown.Item eventKey="stanica:windgust|Wind gust:[km/h]:false">
                Wind gust
              </Dropdown.Item>
              <Dropdown.Item eventKey="stanica:temp|Temperature:[°C]:true">
                Temperature
              </Dropdown.Item>
              <Dropdown.Item eventKey="stanica:humidity|Humidity:[%]:false">
                Humidity
              </Dropdown.Item>
              <Dropdown.Item eventKey="stanica:pressurerel|Relative pressure:[hPa]:false">
                Pressure
              </Dropdown.Item>
              <Dropdown.Item eventKey="stanica:solarradiation|Solar radiation:W/m2:false">
                Solar radiation
              </Dropdown.Item>
              <Dropdown.Item eventKey="stanica:uv|UV:[]:false">
                UV
              </Dropdown.Item>
              <Dropdown.Item eventKey="stanica:rainrate|Rain rate:[mm]:false">
                Rain rate
              </Dropdown.Item>
              <Dropdown.Item eventKey="stanica:tempin|Temperature IN:[°C]:true">
                Temperature IN
              </Dropdown.Item>
              <Dropdown.Item eventKey="stanica:humidityin|Humidity IN:[%]:false">
                Humidity IN
              </Dropdown.Item>
            </DropdownButton>

            <DropdownButton
              id="dropdown-range-button"
              title="Range"
              onSelect={(e) => setOffset(e)}
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
              onClick={() => setPage(page - 1)}
            >
              &lt;
            </Button>
            <Button
              // variant="outline-secondary"
              onClick={() => setPage(page < 0 ? page + 1 : 0)}
            >
              &gt;
            </Button>
            <Button
              // variant="outline-secondary"
              onClick={() => setPage(0)}
            >
              O
            </Button>
          </ButtonGroup>
        </Row>
        <hr />
        <Row>
          <Col xs={12}>
            <Text name="Sensor" value={cdata.name + cdata.unit} />
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <Text name="Range" value={cdata.range} />
          </Col>
          <Col xs={4} />
          <Col xs={4}>
            <Text name="Page" value={page == null ? "" : page.toFixed(0)} />
          </Col>
          <Col xs={4}>
            <Text
              name="Min"
              value={cdata.min == null ? "" : cdata.min.toFixed(1)}
            />
          </Col>
          <Col xs={4}>
            <Text
              name="Max"
              value={cdata.max == null ? "" : cdata.max.toFixed(1)}
            />
          </Col>
          <Col xs={4}>
            <Text name="Avg" value={cdata.avg} />
          </Col>
        </Row>
      </Container>
      <Container className="text-center text-light border-primary bg-very-dark rounded mb-2 py-2">
        <Chart
          chdata={hdata}
          xkey="timestamp"
          ykey={measurement.split("|")[0].split(":")[1]}
          y2key={measurement.split("|")[0].split(":")[2]}
          domainMin={cdata.domainMin}
          domainMax={cdata.domainMax}
        />
      </Container>
    </>
  );
};

export default StationCharts;
