/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { observer } from "mobx-react";
import React from "react";
import { Row, Col } from "react-bootstrap";
import { DOM_SENSORS_DESC } from "../../../common/domModel";
import AuthData from "../../auth/authData";
import DataAlone from "../../misc/dataAlone";
import DataWithTrend from "../../misc/dataWithTrend";
import Text from "../../misc/text";

type RoomProps = {
  air: number;
  floor: number;
  required: number;
  heat: boolean;
  off: boolean;
  low: boolean;
  room: string;
  airTrend: Array<number>;
  floorTrend: Array<number>;
  authData: AuthData;
  onClickAir: any;
  onClickFloor: any;
};

const Room = observer(
  ({
    air,
    floor,
    required,
    heat,
    off: summer,
    low,
    room,
    airTrend,
    floorTrend,
    onClickAir,
    onClickFloor,
  }: RoomProps) => (
    <>
      <div className="text-left font-weight-bold">{room}</div>
      <Row className="text-light">
        <Col xs={3}>
          <DataWithTrend
            label={DOM_SENSORS_DESC.ROOM.label}
            value={air}
            unit={DOM_SENSORS_DESC.ROOM.unit}
            fix={DOM_SENSORS_DESC.ROOM.fix}
            data={airTrend}
            range={DOM_SENSORS_DESC.ROOM.range}
            couldBeNegative={DOM_SENSORS_DESC.ROOM.couldBeNegative}
            onClick={onClickAir}
            color={DOM_SENSORS_DESC.ROOM.color}
          />
        </Col>
        <Col xs={3}>
          <DataWithTrend
            label={DOM_SENSORS_DESC.ROOM.label}
            value={floor}
            unit={DOM_SENSORS_DESC.ROOM.unit}
            fix={DOM_SENSORS_DESC.ROOM.fix}
            data={floorTrend}
            range={DOM_SENSORS_DESC.ROOM.range}
            couldBeNegative={DOM_SENSORS_DESC.ROOM.couldBeNegative}
            onClick={onClickFloor}
            color={DOM_SENSORS_DESC.ROOM.color}
          />
        </Col>
        <Col xs={3}>
          <DataAlone
            label={DOM_SENSORS_DESC.ROOM.label}
            value={required}
            unit={DOM_SENSORS_DESC.ROOM.unit}
            fix={DOM_SENSORS_DESC.ROOM.fix}
          />
        </Col>
        <Col xs={2}>
          <Text
            name=""
            value={`${heat != null ? Number(heat) : ""}${
              summer != null ? Number(summer) : ""
            }${low != null ? Number(low) : ""}`}
          />
        </Col>
      </Row>
    </>
  )
);

export default Room;
