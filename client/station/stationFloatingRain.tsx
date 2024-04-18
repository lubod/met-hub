import React from "react";
import { observer } from "mobx-react";
import { AppContext } from "..";
import NumberDataAlone from "../misc/numberDataAlone";

type Props = {
  appContext: AppContext;
};

const StationFloatingRain = observer(({ appContext }: Props) => (
  <div className="flex flex-row">
    <div className="flex flex-col gap-4 basis-1/4">
      <NumberDataAlone
        label="1 hour" // todo
        value={
          appContext.cCtrl.stationData.raindata == null
            ? null
            : parseFloat(appContext.cCtrl.stationData.raindata[0].sum)
        }
        unit=""
        fix={1}
        old={false}
      />
      <NumberDataAlone
        label="1 day" // todo
        value={
          appContext.cCtrl.stationData.raindata == null
            ? null
            : parseFloat(appContext.cCtrl.stationData.raindata[4].sum)
        }
        unit=""
        fix={1}
        old={false}
      />
    </div>
    <div className="flex flex-col gap-4 basis-1/4">
      <NumberDataAlone
        label="3 hour" // todo
        value={
          appContext.cCtrl.stationData.raindata == null
            ? null
            : parseFloat(appContext.cCtrl.stationData.raindata[1].sum)
        }
        unit=""
        fix={1}
        old={false}
      />
      <NumberDataAlone
        label="3 days" // todo
        value={
          appContext.cCtrl.stationData.raindata == null
            ? null
            : parseFloat(appContext.cCtrl.stationData.raindata[5].sum)
        }
        unit=""
        fix={1}
        old={false}
      />
    </div>
    <div className="flex flex-col gap-4 basis-1/4">
      <NumberDataAlone
        label="6 hour" // todo
        value={
          appContext.cCtrl.stationData.raindata == null
            ? null
            : parseFloat(appContext.cCtrl.stationData.raindata[2].sum)
        }
        unit=""
        fix={1}
        old={false}
      />
      <NumberDataAlone
        label="1 week" // todo
        value={
          appContext.cCtrl.stationData.raindata == null
            ? null
            : parseFloat(appContext.cCtrl.stationData.raindata[6].sum)
        }
        unit=""
        fix={1}
        old={false}
      />
    </div>
    <div className="flex flex-col gap-4 basis-1/4">
      <NumberDataAlone
        label="12 hour" // todo
        value={
          appContext.cCtrl.stationData.raindata == null
            ? null
            : parseFloat(appContext.cCtrl.stationData.raindata[3].sum)
        }
        unit=""
        fix={1}
        old={false}
      />
      <NumberDataAlone
        label="4 weeks" // todo
        value={
          appContext.cCtrl.stationData.raindata == null
            ? null
            : parseFloat(appContext.cCtrl.stationData.raindata[7].sum)
        }
        unit=""
        fix={1}
        old={false}
      />
    </div>
  </div>
));

export default StationFloatingRain;
