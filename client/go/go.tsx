/* eslint-disable camelcase */
import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { observer } from "mobx-react";
import moment from "moment";
import { AppContext } from "..";
import Forecast from "../forecast/forecast";
import { MyContainer } from "../misc/mycontainer";

type Props = {
  appContext: AppContext;
};

const Go = observer(({ appContext }: Props) => {
  const [air_temperature_min, set_air_temperature_min] = useState(0);
  const [air_temperature_max, set_air_temperature_max] = useState(0);
  const [cloud_area_fraction_min, set_cloud_area_fraction_min] = useState(0);
  const [cloud_area_fraction_max, set_cloud_area_fraction_max] = useState(0);
  const [fog_area_fraction_min, set_fog_area_fraction_min] = useState(0);
  const [fog_area_fraction_max, set_fog_area_fraction_max] = useState(0);
  const [wind_speed_min, set_wind_speed_min] = useState(0);
  const [wind_speed_max, set_wind_speed_max] = useState(0);
  const [hour_min, set_hour_min] = useState(0);
  const [hour_max, set_hour_max] = useState(0);
  const [precipitation_amount_min, set_precipitation_amount_min] = useState(0);
  const [precipitation_amount_max, set_precipitation_amount_max] = useState(0);
  const [result, setResult] = useState([]);

  async function select() {
    const url = `/api/goSelect?air_temperature_min=${air_temperature_min}&air_temperature_max=${air_temperature_max}&cloud_area_fraction_min=${cloud_area_fraction_min}&cloud_area_fraction_max=${cloud_area_fraction_max}&fog_area_fraction_min=${fog_area_fraction_min}&fog_area_fraction_max=${fog_area_fraction_max}&wind_speed_min=${wind_speed_min}&wind_speed_max=${wind_speed_max}&hour_min=${hour_min}&hour_max=${hour_max}&precipitation_amount_min=${precipitation_amount_min}&precipitation_amount_max=${precipitation_amount_max}`;
    try {
      // this.forecastData.setLoading(true);
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }

      const res = await response.json();
      setResult(res);
      // console.info(newData);
      // this.forecastData.setForecast(newData);
      //  this.forecastData.setLoading(false);
    } catch (e) {
      console.error(e);
    }
  }

  console.info("Go render");

  return (
    <div>
      <Container className="container-max-width text-center text-light mx-auto vh-100">
        <Row>
          <Col sm={2} className="ps-1 pe-1">
            <MyContainer>
              <Form.Group>
                <Form.Label>
                  Air temperature min: {air_temperature_min}
                </Form.Label>
                <Form.Range
                  value={air_temperature_min + 50}
                  onChange={(e) =>
                    set_air_temperature_min(parseFloat(e.target.value) - 50)
                  }
                />
                <Form.Label>
                  Air temperature max: {air_temperature_max}
                </Form.Label>
                <Form.Range
                  value={air_temperature_max + 50}
                  onChange={(e) =>
                    set_air_temperature_max(parseFloat(e.target.value) - 50)
                  }
                />
                <Form.Label>
                  Cloud area fraction min: {cloud_area_fraction_min}
                </Form.Label>
                <Form.Range
                  value={cloud_area_fraction_min}
                  onChange={(e) =>
                    set_cloud_area_fraction_min(parseFloat(e.target.value))
                  }
                />
                <Form.Label>
                  Cloud area fraction max: {cloud_area_fraction_max}
                </Form.Label>
                <Form.Range
                  value={cloud_area_fraction_max}
                  onChange={(e) =>
                    set_cloud_area_fraction_max(parseFloat(e.target.value))
                  }
                />
                <Form.Label>
                  Fog area fraction min: {fog_area_fraction_min}
                </Form.Label>
                <Form.Range
                  value={fog_area_fraction_min}
                  onChange={(e) =>
                    set_fog_area_fraction_min(parseFloat(e.target.value))
                  }
                />
                <Form.Label>
                  Fog area fraction max: {fog_area_fraction_max}
                </Form.Label>
                <Form.Range
                  value={fog_area_fraction_max}
                  onChange={(e) =>
                    set_fog_area_fraction_max(parseFloat(e.target.value))
                  }
                />
                <Form.Label>Wind speed min: {wind_speed_min}</Form.Label>
                <Form.Range
                  value={wind_speed_min}
                  onChange={(e) =>
                    set_wind_speed_min(parseFloat(e.target.value))
                  }
                />
                <Form.Label>Wind speed max: {wind_speed_max}</Form.Label>
                <Form.Range
                  value={wind_speed_max}
                  onChange={(e) =>
                    set_wind_speed_max(parseFloat(e.target.value))
                  }
                />
                <Form.Label>Hour min: {hour_min}</Form.Label>
                <Form.Range
                  value={hour_min}
                  onChange={(e) => set_hour_min(parseFloat(e.target.value))}
                />
                <Form.Label>Hour max: {hour_max}</Form.Label>
                <Form.Range
                  value={hour_max}
                  onChange={(e) => set_hour_max(parseFloat(e.target.value))}
                />
                <Form.Label>
                  Precipitation amount min: {precipitation_amount_min}
                </Form.Label>
                <Form.Range
                  value={precipitation_amount_min}
                  onChange={(e) =>
                    set_precipitation_amount_min(parseFloat(e.target.value))
                  }
                />
                <Form.Label>
                  Precipitation amount max: {precipitation_amount_max}
                </Form.Label>
                <Form.Range
                  value={precipitation_amount_max}
                  onChange={(e) =>
                    set_precipitation_amount_max(parseFloat(e.target.value))
                  }
                />
              </Form.Group>
              <Button variant="primary" type="submit" onClick={() => select()}>
                Submit
              </Button>
            </MyContainer>
          </Col>
          <Col sm={4} className="ps-1 pe-1">
            <Forecast forecastCtrl={appContext.forecastCtrl} />
          </Col>
          <Col sm={4} className="ps-1 pe-1">
            {result.map((row) => (
              <div>
                <span>{moment(row.time).format("DD.MM HH:mm")}</span>{" "}
                <span>{row.air_temperature}</span>{" "}
                <span>{row.cloud_area_fraction}</span>{" "}
                <span>{row.fog_area_fraction}</span>{" "}
                <span>{row.wind_speed}</span>{" "}
                <span>{row.precipitation_amount}</span> <span>{row.id}</span>
              </div>
            ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
});

export default Go;
