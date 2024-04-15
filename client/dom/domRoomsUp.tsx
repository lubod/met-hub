import React from "react";
import { observer } from "mobx-react";
import { AppContext } from "..";
import { DOM_SENSORS_DESC } from "../../common/domModel";
import Myhr from "../misc/myhr";
import Room from "./room";

type Props = {
  appContext: AppContext;
};

const DomRoomsUp = observer(({ appContext }: Props) => (
  <>
    <Room
      room="BED ROOM"
      floorTrend={appContext.cCtrl.domData.trendData.bed_room_floor}
      airTrend={appContext.cCtrl.domData.trendData.bed_room_air}
      air={appContext.cCtrl.domData.data.bed_room_air}
      old={appContext.cCtrl.domData.oldData}
      floor={appContext.cCtrl.domData.data.bed_room_floor}
      required={appContext.cCtrl.domData.data.bed_room_reqall}
      heat={appContext.cCtrl.domData.data.bed_room_heat}
      off={appContext.cCtrl.domData.data.bed_room_off}
      low={appContext.cCtrl.domData.data.bed_room_low}
      authData={appContext.authCtrl.authData}
      onClickAir={() =>
        appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.BED_ROOM_AIR)
      }
      onClickFloor={() =>
        appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.BED_ROOM_FLOOR)
      }
    />
    <Myhr />
    <Room
      room="BOYS"
      floorTrend={appContext.cCtrl.domData.trendData.boys_room_floor}
      airTrend={appContext.cCtrl.domData.trendData.boys_room_air}
      air={appContext.cCtrl.domData.data.boys_room_air}
      old={appContext.cCtrl.domData.oldData}
      floor={appContext.cCtrl.domData.data.boys_room_floor}
      required={appContext.cCtrl.domData.data.boys_room_reqall}
      heat={appContext.cCtrl.domData.data.boys_room_heat}
      off={appContext.cCtrl.domData.data.boys_room_off}
      low={appContext.cCtrl.domData.data.boys_room_low}
      authData={appContext.authCtrl.authData}
      onClickAir={() =>
        appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.BOYS_ROOM_AIR)
      }
      onClickFloor={() =>
        appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.BOYS_ROOM_FLOOR)
      }
    />
    <Myhr />
    <Room
      room="PETRA"
      floorTrend={appContext.cCtrl.domData.trendData.petra_room_floor}
      airTrend={appContext.cCtrl.domData.trendData.petra_room_air}
      air={appContext.cCtrl.domData.data.petra_room_air}
      old={appContext.cCtrl.domData.oldData}
      floor={appContext.cCtrl.domData.data.petra_room_floor}
      required={appContext.cCtrl.domData.data.petra_room_reqall}
      heat={appContext.cCtrl.domData.data.petra_room_heat}
      off={appContext.cCtrl.domData.data.petra_room_off}
      low={appContext.cCtrl.domData.data.petra_room_low}
      authData={appContext.authCtrl.authData}
      onClickAir={() =>
        appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.PETRA_ROOM_AIR)
      }
      onClickFloor={() =>
        appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.PETRA_ROOM_FLOOR)
      }
    />
  </>
));

export default DomRoomsUp;
