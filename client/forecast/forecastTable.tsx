import React from "react";
import { Row, Col } from "react-bootstrap";
import { observer } from "mobx-react";
import Text from "../misc/text";
import Data4Forecast from "./data4Forecast";
import { IForecastDay } from "./forecastData";

type Props = {
  days: Array<IForecastDay>;
  daysStyle: string;
  days10r: boolean;
};

const ForecastTable = observer(({ days, daysStyle, days10r }: Props) => (
  <>
    <Row>
      <Col xs={3}>
        <Text name="Day" value="" />
      </Col>
      <Col xs={3}>
        <Text name="Temperature °C" value="" />
      </Col>
      <Col xs={3}>
        <Text name="Rain mm" value="" />
      </Col>
      <Col xs={3}>
        <Text name="WindSpeed km/h" value="" />
      </Col>
    </Row>
    {days.map((forecastDay) => (
      <div key={forecastDay.timestamp.getTime()} className={daysStyle}>
        <Data4Forecast forecastDay={forecastDay} days10r={days10r} />
      </div>
    ))}
    {days10r && <div className="mb-4" />}
  </>
));

export default ForecastTable;
