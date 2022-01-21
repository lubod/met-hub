import React from "react";
import { Row, Col } from "react-bootstrap";
import Data from "../data/data";
import Text from "../text/text";
import Trend from "../trend/trend";

type RoomProps = {
  air: number;
  floor: number;
  required: number;
  heat: number;
  summer: number;
  low: number;
  room: string;
  airTrend: Array<number>;
  floorTrend: Array<number>;
};

const Room = function ({
  air,
  floor,
  required,
  heat,
  summer,
  low,
  room,
  airTrend,
  floorTrend,
}: RoomProps) {
  return (
    <div className="text-left small text-info font-weight-bold">
      {room}
      <Row className="text-light">
        <Col xs={3}>
          <Data name="" value={air} unit="°C" fix={1} />
          <Trend name="Air" data={airTrend} />
        </Col>
        <Col xs={3}>
          <Data name="" value={floor} unit="°C" fix={1} />
          <Trend name="Floor" data={floorTrend} />
        </Col>
        <Col xs={3}>
          <Data name="" value={required} unit="°C" fix={1} />
        </Col>
        <Col xs={2}>
          <Text
            name=""
            value={`${heat != null ? heat.toFixed(0) : ""}${
              summer != null ? summer.toFixed(0) : ""
            }${low != null ? low.toFixed(0) : ""}`}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Room;
