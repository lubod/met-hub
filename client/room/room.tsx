import { observer } from "mobx-react";
import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import AuthData from "../auth/authData";
import DataAlone from "../data/dataAlone";
import DataWithTrend from "../dataWithTrend/dataWithTrend";
import Text from "../text/text";

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
  authData: AuthData;
};

const Room = observer(
  ({
    air,
    floor,
    required,
    heat,
    summer,
    low,
    room,
    airTrend,
    floorTrend,
    authData,
  }: RoomProps) => (
    <Container className="text-center text-light border-secondary bg-very-dark rounded mb-2 py-2">
      <div className="text-left font-weight-bold">{room}</div>
      <Row className="text-light">
        <Col xs={3}>
          <DataWithTrend
            name=""
            value={air}
            unit="°C"
            fix={1}
            data={airTrend}
            range={1.6}
            couldBeNegative
            authData={authData}
          />
        </Col>
        <Col xs={3}>
          <DataWithTrend
            name=""
            value={floor}
            unit="°C"
            fix={1}
            data={floorTrend}
            range={1.6}
            couldBeNegative
            authData={authData}
          />
        </Col>
        <Col xs={3}>
          <DataAlone name="" value={required} unit="°C" fix={1} />
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
    </Container>
  )
);

export default Room;
