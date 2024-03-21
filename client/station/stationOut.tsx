/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { observer } from "mobx-react";
import NumberDataWithTrend from "../misc/numberDataWithTrend";
import { STATION_MEASUREMENTS_DESC } from "../../common/stationModel";
import { AppContext } from "..";

type Props = {
  appContext: AppContext;
};

const StationOut = observer(({ appContext }: Props) => (
  <div className="flex flex-row">
    <div className="flex flex-col gap-4 basis-1/3">
      <NumberDataWithTrend
        sensor={STATION_MEASUREMENTS_DESC.TEMPERATURE}
        value={appContext.cCtrl.stationData.data.temp}
        old={appContext.cCtrl.stationData.oldData}
        trend={appContext.cCtrl.stationData.trendData.temp}
        onClick={() =>
          appContext.setMeasurementAndLoad(
            STATION_MEASUREMENTS_DESC.TEMPERATURE,
          )
        }
      />
      <NumberDataWithTrend
        sensor={STATION_MEASUREMENTS_DESC.HUMIDITY}
        value={appContext.cCtrl.stationData.data.humidity}
        old={appContext.cCtrl.stationData.oldData}
        trend={appContext.cCtrl.stationData.trendData.humidity}
        onClick={() =>
          appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.HUMIDITY)
        }
      />
    </div>
    <div className="flex flex-col gap-4 basis-1/3">
      <NumberDataWithTrend
        sensor={STATION_MEASUREMENTS_DESC.SOLAR}
        value={appContext.cCtrl.stationData.data.solarradiation}
        old={appContext.cCtrl.stationData.oldData}
        trend={appContext.cCtrl.stationData.trendData.solarradiation}
        onClick={() =>
          appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.SOLAR)
        }
      />
      <NumberDataWithTrend
        sensor={STATION_MEASUREMENTS_DESC.UV}
        value={appContext.cCtrl.stationData.data.uv}
        old={appContext.cCtrl.stationData.oldData}
        trend={appContext.cCtrl.stationData.trendData.uv}
        onClick={() =>
          appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.UV)
        }
      />
    </div>
    <div className="flex flex-col gap-4 basis-1/3">
      <NumberDataWithTrend
        sensor={STATION_MEASUREMENTS_DESC.PRESSUREABS}
        value={appContext.cCtrl.stationData.data.pressureabs}
        old={appContext.cCtrl.stationData.oldData}
        trend={appContext.cCtrl.stationData.trendData.pressureabs}
        onClick={() =>
          appContext.setMeasurementAndLoad(
            STATION_MEASUREMENTS_DESC.PRESSUREABS,
          )
        }
      />
      <NumberDataWithTrend
        sensor={STATION_MEASUREMENTS_DESC.RAINRATE}
        value={appContext.cCtrl.stationData.data.rainrate}
        old={appContext.cCtrl.stationData.oldData}
        trend={appContext.cCtrl.stationData.trendData.rainrate}
        onClick={() =>
          appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.RAINRATE)
        }
      />
    </div>
  </div>
));

export default StationOut;
