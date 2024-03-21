import React from "react";
import { observer } from "mobx-react";
import { STATION_MEASUREMENTS_DESC } from "../../common/stationModel";
import { AppContext } from "..";
import NumberDataAlone from "../misc/numberDataAlone";

type Props = {
  appContext: AppContext;
};

const StationFixedRain = observer(({ appContext }: Props) => (
  <div className="flex flex-row">
    <div className="flex flex-col gap-4 basis-1/3">
      <NumberDataAlone
        label={STATION_MEASUREMENTS_DESC.EVENTRAIN.label}
        value={appContext.cCtrl.stationData.data.eventrain}
        old={appContext.cCtrl.stationData.oldData}
        unit=""
        fix={STATION_MEASUREMENTS_DESC.EVENTRAIN.fix}
      />
      <NumberDataAlone
        label={STATION_MEASUREMENTS_DESC.WEEKLYRAIN.label}
        value={appContext.cCtrl.stationData.data.weeklyrain}
        old={appContext.cCtrl.stationData.oldData}
        unit=""
        fix={STATION_MEASUREMENTS_DESC.WEEKLYRAIN.fix}
      />
    </div>
    <div className="flex flex-col gap-4 basis-1/3">
      <NumberDataAlone
        label={STATION_MEASUREMENTS_DESC.HOURLYRAIN.label}
        value={appContext.cCtrl.stationData.data.hourlyrain}
        old={appContext.cCtrl.stationData.oldData}
        unit=""
        fix={STATION_MEASUREMENTS_DESC.HOURLYRAIN.fix}
      />
      <NumberDataAlone
        label={STATION_MEASUREMENTS_DESC.MONTHLYRAIN.label}
        value={appContext.cCtrl.stationData.data.monthlyrain}
        old={appContext.cCtrl.stationData.oldData}
        unit=""
        fix={STATION_MEASUREMENTS_DESC.MONTHLYRAIN.fix}
      />
    </div>
    <div className="flex flex-col gap-4 basis-1/3">
      <NumberDataAlone
        label={STATION_MEASUREMENTS_DESC.DAILYRAIN.label}
        value={appContext.cCtrl.stationData.data.dailyrain}
        old={appContext.cCtrl.stationData.oldData}
        unit=""
        fix={STATION_MEASUREMENTS_DESC.DAILYRAIN.fix}
      />
      <NumberDataAlone
        label={STATION_MEASUREMENTS_DESC.TOTALRAIN.label}
        value={appContext.cCtrl.stationData.data.totalrain}
        old={appContext.cCtrl.stationData.oldData}
        unit=""
        fix={STATION_MEASUREMENTS_DESC.TOTALRAIN.fix}
      />
    </div>
  </div>
));

export default StationFixedRain;
