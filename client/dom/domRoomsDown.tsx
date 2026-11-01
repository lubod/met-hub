import React from "react";
import { observer } from "mobx-react";
import { AppContext } from "..";
import { DOM_SENSORS_DESC } from "../../common/domModel";
import Room from "./room";

type Props = {
  appContext: AppContext;
};

const DomRoomsDown = observer(({ appContext }: Props) => {
  const { domData } = appContext.cCtrl;
  const intervalRooms = domData.heatingStats?.[domData.heatingInterval]?.rooms;

  return (
    <div className="flex flex-col gap-3">
      <Room
        room="LIVING ROOM"
        areaM2={domData.roomAreas.living_room}
        heatedAreaM2={domData.roomHeatedAreas.living_room}
        powerKw={domData.roomPowers.living_room}
        kwh={intervalRooms?.living_room?.kwh}
        runtimeMinutes={intervalRooms?.living_room?.runtimeMinutes}
        floorTrend={domData.trendData.living_room_floor}
        airTrend={domData.trendData.living_room_air}
        air={domData.data.living_room_air}
        old={domData.oldData}
        floor={domData.data.living_room_floor}
        required={domData.data.living_room_reqall}
        heat={domData.data.living_room_heat}
        off={domData.data.living_room_off}
        low={domData.data.living_room_low}
        onClickAir={() =>
          appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.LIVING_ROOM_AIR)
        }
        onClickFloor={() =>
          appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.LIVING_ROOM_FLOOR)
        }
      />
      <Room
        room="GUEST ROOM"
        areaM2={domData.roomAreas.guest_room}
        heatedAreaM2={domData.roomHeatedAreas.guest_room}
        powerKw={domData.roomPowers.guest_room}
        kwh={intervalRooms?.guest_room?.kwh}
        runtimeMinutes={intervalRooms?.guest_room?.runtimeMinutes}
        floorTrend={domData.trendData.guest_room_floor}
        airTrend={domData.trendData.guest_room_air}
        air={domData.data.guest_room_air}
        old={domData.oldData}
        floor={domData.data.guest_room_floor}
        required={domData.data.guest_room_reqall}
        heat={domData.data.guest_room_heat}
        off={domData.data.guest_room_off}
        low={domData.data.guest_room_low}
        onClickAir={() =>
          appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.GUEST_ROOM_AIR)
        }
        onClickFloor={() =>
          appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.GUEST_ROOM_FLOOR)
        }
      />
      <Room
        room="ENTRY HALL"
        areaM2={domData.roomAreas.entry_hall}
        heatedAreaM2={domData.roomHeatedAreas.entry_hall}
        powerKw={domData.roomPowers.entry_hall}
        kwh={intervalRooms?.entry_hall?.kwh}
        runtimeMinutes={intervalRooms?.entry_hall?.runtimeMinutes}
        floorTrend={domData.trendData.entry_hall_floor}
        airTrend={domData.trendData.entry_hall_air}
        air={domData.data.entry_hall_air}
        old={domData.oldData}
        floor={domData.data.entry_hall_floor}
        required={domData.data.entry_hall_reqall}
        heat={domData.data.entry_hall_heat}
        off={domData.data.entry_hall_off}
        low={domData.data.entry_hall_low}
        onClickAir={() =>
          appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.ENTRY_HALL_AIR)
        }
        onClickFloor={() =>
          appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.ENTRY_HALL_FLOOR)
        }
      />
      <Room
        room="BATHROOM DOWN"
        areaM2={domData.roomAreas.bath_down}
        heatedAreaM2={domData.roomHeatedAreas.bath_down}
        powerKw={domData.roomPowers.bath_down}
        kwh={intervalRooms?.bath_down?.kwh}
        runtimeMinutes={intervalRooms?.bath_down?.runtimeMinutes}
        floorTrend={domData.trendData.bath_down_floor}
        airTrend={domData.trendData.bath_down_air}
        air={domData.data.bath_down_air}
        old={domData.oldData}
        floor={domData.data.bath_down_floor}
        required={domData.data.bath_down_reqall}
        heat={domData.data.bath_down_heat}
        off={domData.data.bath_down_off}
        low={domData.data.bath_down_low}
        onClickAir={() =>
          appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.BATH_DOWN_AIR)
        }
        onClickFloor={() =>
          appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.BATH_DOWN_FLOOR)
        }
      />
    </div>
  );
});

export default DomRoomsDown;
