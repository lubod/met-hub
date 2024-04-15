import React from "react";
import { observer } from "mobx-react";
import { AppContext } from "..";
import { DOM_SENSORS_DESC } from "../../common/domModel";
import Myhr from "../misc/myhr";
import Room from "./room";

type Props = {
  appContext: AppContext;
};

const DomRoomsDown = observer(({ appContext }: Props) => (
  <>
    <Room
      room="LIVING ROOM"
      floorTrend={appContext.cCtrl.domData.trendData.living_room_floor}
      airTrend={appContext.cCtrl.domData.trendData.living_room_air}
      air={appContext.cCtrl.domData.data.living_room_air}
      old={appContext.cCtrl.domData.oldData}
      floor={appContext.cCtrl.domData.data.living_room_floor}
      required={appContext.cCtrl.domData.data.living_room_reqall}
      heat={appContext.cCtrl.domData.data.living_room_heat}
      off={appContext.cCtrl.domData.data.living_room_off}
      low={appContext.cCtrl.domData.data.living_room_low}
      authData={appContext.authCtrl.authData}
      onClickAir={() =>
        appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.LIVING_ROOM_AIR)
      }
      onClickFloor={() =>
        appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.LIVING_ROOM_FLOOR)
      }
    />
    <Myhr />
    <Room
      room="GUEST ROOM"
      floorTrend={appContext.cCtrl.domData.trendData.guest_room_floor}
      airTrend={appContext.cCtrl.domData.trendData.guest_room_air}
      air={appContext.cCtrl.domData.data.guest_room_air}
      old={appContext.cCtrl.domData.oldData}
      floor={appContext.cCtrl.domData.data.guest_room_floor}
      required={appContext.cCtrl.domData.data.guest_room_reqall}
      heat={appContext.cCtrl.domData.data.guest_room_heat}
      off={appContext.cCtrl.domData.data.guest_room_off}
      low={appContext.cCtrl.domData.data.guest_room_low}
      authData={appContext.authCtrl.authData}
      onClickAir={() =>
        appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.GUEST_ROOM_AIR)
      }
      onClickFloor={() =>
        appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.GUEST_ROOM_FLOOR)
      }
    />
  </>
));

export default DomRoomsDown;
