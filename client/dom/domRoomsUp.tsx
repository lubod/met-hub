import React from "react";
import { observer } from "mobx-react";
import { AppContext } from "..";
import { DOM_ROOM_HEATING_DEFAULTS, DOM_SENSORS_DESC } from "../../common/domModel";
import Room from "./room";

type Props = {
  appContext: AppContext;
};

const DomRoomsUp = observer(({ appContext }: Props) => {
  const { domData } = appContext.cCtrl;
  const intervalRooms = domData.heatingStats?.[domData.heatingInterval]?.rooms;

  return (
    <div className="flex flex-col gap-3">
      <Room
        room="BED ROOM"
        areaM2={domData.roomAreas.bed_room}
        heatedAreaM2={domData.roomHeatedAreas.bed_room}
        heatingType={DOM_ROOM_HEATING_DEFAULTS.bed_room.heatingType}
        powerKw={domData.roomPowers.bed_room}
        kwh={intervalRooms?.bed_room?.kwh}
        runtimeMinutes={intervalRooms?.bed_room?.runtimeMinutes}
        floorTrend={domData.trendData.bed_room_floor}
        airTrend={domData.trendData.bed_room_air}
        air={domData.data.bed_room_air}
        old={domData.oldData}
        floor={domData.data.bed_room_floor}
        required={domData.data.bed_room_reqall}
        heat={domData.data.bed_room_heat}
        off={domData.data.bed_room_off}
        low={domData.data.bed_room_low}
        onClickAir={() =>
          appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.BED_ROOM_AIR)
        }
        onClickFloor={() =>
          appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.BED_ROOM_FLOOR)
        }
      />
      <Room
        room="BOYS"
        areaM2={domData.roomAreas.boys_room}
        heatedAreaM2={domData.roomHeatedAreas.boys_room}
        heatingType={DOM_ROOM_HEATING_DEFAULTS.boys_room.heatingType}
        powerKw={domData.roomPowers.boys_room}
        kwh={intervalRooms?.boys_room?.kwh}
        runtimeMinutes={intervalRooms?.boys_room?.runtimeMinutes}
        floorTrend={domData.trendData.boys_room_floor}
        airTrend={domData.trendData.boys_room_air}
        air={domData.data.boys_room_air}
        old={domData.oldData}
        floor={domData.data.boys_room_floor}
        required={domData.data.boys_room_reqall}
        heat={domData.data.boys_room_heat}
        off={domData.data.boys_room_off}
        low={domData.data.boys_room_low}
        onClickAir={() =>
          appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.BOYS_ROOM_AIR)
        }
        onClickFloor={() =>
          appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.BOYS_ROOM_FLOOR)
        }
      />
      <Room
        room="PETRA"
        areaM2={domData.roomAreas.petra_room}
        heatedAreaM2={domData.roomHeatedAreas.petra_room}
        heatingType={DOM_ROOM_HEATING_DEFAULTS.petra_room.heatingType}
        powerKw={domData.roomPowers.petra_room}
        kwh={intervalRooms?.petra_room?.kwh}
        runtimeMinutes={intervalRooms?.petra_room?.runtimeMinutes}
        floorTrend={domData.trendData.petra_room_floor}
        airTrend={domData.trendData.petra_room_air}
        air={domData.data.petra_room_air}
        old={domData.oldData}
        floor={domData.data.petra_room_floor}
        required={domData.data.petra_room_reqall}
        heat={domData.data.petra_room_heat}
        off={domData.data.petra_room_off}
        low={domData.data.petra_room_low}
        onClickAir={() =>
          appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.PETRA_ROOM_AIR)
        }
        onClickFloor={() =>
          appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.PETRA_ROOM_FLOOR)
        }
      />
      <Room
        room="BATHROOM UP"
        areaM2={domData.roomAreas.bath_up}
        heatedAreaM2={domData.roomHeatedAreas.bath_up}
        heatingType={DOM_ROOM_HEATING_DEFAULTS.bath_up.heatingType}
        powerKw={domData.roomPowers.bath_up}
        kwh={intervalRooms?.bath_up?.kwh}
        runtimeMinutes={intervalRooms?.bath_up?.runtimeMinutes}
        floorTrend={domData.trendData.bath_up_floor}
        airTrend={domData.trendData.bath_up_air}
        air={domData.data.bath_up_air}
        old={domData.oldData}
        floor={domData.data.bath_up_floor}
        required={domData.data.bath_up_reqall}
        heat={domData.data.bath_up_heat}
        off={domData.data.bath_up_off}
        low={domData.data.bath_up_low}
        onClickAir={() =>
          appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.BATH_UP_AIR)
        }
        onClickFloor={() =>
          appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.BATH_UP_FLOOR)
        }
      />
      <Room
        room="WARDROBE"
        areaM2={domData.roomAreas.wardrobe}
        heatedAreaM2={domData.roomHeatedAreas.wardrobe}
        heatingType={DOM_ROOM_HEATING_DEFAULTS.wardrobe.heatingType}
        powerKw={domData.roomPowers.wardrobe}
        kwh={intervalRooms?.wardrobe?.kwh}
        runtimeMinutes={intervalRooms?.wardrobe?.runtimeMinutes}
        floorTrend={domData.trendData.wardrobe_floor}
        airTrend={domData.trendData.wardrobe_air}
        air={domData.data.wardrobe_air}
        old={domData.oldData}
        floor={domData.data.wardrobe_floor}
        required={domData.data.wardrobe_reqall}
        heat={domData.data.wardrobe_heat}
        off={domData.data.wardrobe_off}
        low={domData.data.wardrobe_low}
        onClickAir={() =>
          appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.WARDROBE_AIR)
        }
        onClickFloor={() =>
          appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.WARDROBE_FLOOR)
        }
      />
      <Room
        room="HALL UP"
        areaM2={domData.roomAreas.hall_up}
        heatedAreaM2={domData.roomHeatedAreas.hall_up}
        heatingType={DOM_ROOM_HEATING_DEFAULTS.hall_up.heatingType}
        powerKw={domData.roomPowers.hall_up}
        kwh={intervalRooms?.hall_up?.kwh}
        runtimeMinutes={intervalRooms?.hall_up?.runtimeMinutes}
        floorTrend={domData.trendData.hall_up_floor}
        airTrend={domData.trendData.hall_up_air}
        air={domData.data.hall_up_air}
        old={domData.oldData}
        floor={domData.data.hall_up_floor}
        required={domData.data.hall_up_reqall}
        heat={domData.data.hall_up_heat}
        off={domData.data.hall_up_off}
        low={domData.data.hall_up_low}
        onClickAir={() =>
          appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.HALL_UP_AIR)
        }
        onClickFloor={() =>
          appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.HALL_UP_FLOOR)
        }
      />
    </div>
  );
});

export default DomRoomsUp;
