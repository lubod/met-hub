/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { observer } from "mobx-react";
import React from "react";
import { DOM_SENSORS_DESC } from "../../common/domModel";
import AuthData from "../auth/authData";
import NumberDataAlone from "../misc/numberDataAlone";
import NumberDataWithTrend from "../misc/numberDataWithTrend";
import StringData from "../misc/stringData";

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
  old: boolean;
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
    old,
  }: RoomProps) => (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row justify-center text-light">{room}</div>
      <div className="flex flex-row">
        <div className="flex flex-col basis-1/4">
          <NumberDataWithTrend
            sensor={DOM_SENSORS_DESC.ROOM}
            value={air}
            trend={airTrend}
            onClick={onClickAir}
            old={old}
          />
        </div>
        <div className="flex flex-col basis-1/4">
          <NumberDataWithTrend
            sensor={DOM_SENSORS_DESC.ROOM}
            value={floor}
            trend={floorTrend}
            onClick={onClickFloor}
            old={old}
          />
        </div>
        <div className="flex flex-col basis-1/4">
          <NumberDataAlone
            label={DOM_SENSORS_DESC.ROOM.label}
            value={required}
            unit={DOM_SENSORS_DESC.ROOM.unit}
            fix={DOM_SENSORS_DESC.ROOM.fix}
            old={old}
          />
        </div>
        <div className="flex flex-col basis-1/4">
          <StringData
            label=""
            value={`${heat != null ? Number(heat) : ""}${
              summer != null ? Number(summer) : ""
            }${low != null ? Number(low) : ""}`}
          />
        </div>
      </div>
    </div>
  ),
);

export default Room;
