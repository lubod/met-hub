import React from "react";
import { observer } from "mobx-react";
import NumberDataWithTrend from "../misc/numberDataWithTrend";
import { STATION_MEASUREMENTS_DESC } from "../../common/stationModel";
import { AppContext } from "..";

type Props = {
  appContext: AppContext;
};

const StationIn = observer(({ appContext }: Props) => (
  <div className="flex flex-row justify-center">
    <div className="flex flex-col gap-4">
      <NumberDataWithTrend
        sensor={STATION_MEASUREMENTS_DESC.TEMPERATUREIN}
        value={appContext.cCtrl.stationData.data.tempin}
        old={appContext.cCtrl.stationData.oldData}
        trend={appContext.cCtrl.stationData.trendData.tempin}
        onClick={() =>
          appContext.setMeasurementAndLoad(
            STATION_MEASUREMENTS_DESC.TEMPERATUREIN,
          )
        }
      />
      <NumberDataWithTrend
        sensor={STATION_MEASUREMENTS_DESC.HUMIDITYIN}
        value={appContext.cCtrl.stationData.data.humidityin}
        old={appContext.cCtrl.stationData.oldData}
        trend={appContext.cCtrl.stationData.trendData.humidityin}
        onClick={() =>
          appContext.setMeasurementAndLoad(STATION_MEASUREMENTS_DESC.HUMIDITYIN)
        }
      />
    </div>
  </div>
));

export default StationIn;
