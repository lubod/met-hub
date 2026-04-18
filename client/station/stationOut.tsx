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
  <div className="flex flex-row flex-wrap gap-y-4">
    <div className="basis-1/2">
      <NumberDataWithTrend
        sensor={STATION_MEASUREMENTS_DESC.FEELSLIKE}
        value={appContext.cCtrl.stationData.data.feelslike}
        old={appContext.cCtrl.stationData.oldData}
        trend={appContext.cCtrl.stationData.trendData.feelslike}
        onClick={() =>
          appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.FEELSLIKE)
        }
      />
    </div>
    <div className="basis-1/2">
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
    </div>
    <div className="basis-1/2">
      <NumberDataWithTrend
        sensor={STATION_MEASUREMENTS_DESC.DEWPOINT}
        value={appContext.cCtrl.stationData.data.dewpt}
        old={appContext.cCtrl.stationData.oldData}
        trend={appContext.cCtrl.stationData.trendData.dewpt}
        onClick={() =>
          appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.DEWPOINT)
        }
      />
    </div>
    <div className="basis-1/2">
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
    <div className="basis-1/2">
      <NumberDataWithTrend
        sensor={STATION_MEASUREMENTS_DESC.SOLAR}
        value={appContext.cCtrl.stationData.data.solarradiation}
        old={appContext.cCtrl.stationData.oldData}
        trend={appContext.cCtrl.stationData.trendData.solarradiation}
        onClick={() =>
          appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.SOLAR)
        }
      />
    </div>
    <div className="basis-1/2">
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
    <div className="basis-1/2">
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
    </div>
    <div className="basis-1/2">
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
