import React from "react";
import { observer } from "mobx-react";
import Text from "../misc/text";
import { AppContext } from "..";
import { DOM_SENSORS_DESC } from "../../common/domModel";
import NumberDataWithTrend from "../misc/numberDataWithTrend";

type Props = {
  appContext: AppContext;
};

const DomGardenHouse = observer(({ appContext }: Props) => (
  <div className="flex flex-col gap-4">
    <Text>GARDEN HOUSE</Text>
    <div className="flex flex-row gap-4">
      <div className="flex flex-col basis-1/4">
        <NumberDataWithTrend
          sensor={DOM_SENSORS_DESC.TEMPERATURE}
          value={appContext.cCtrl.domData.data.temp}
          old={appContext.cCtrl.domData.oldData}
          trend={appContext.cCtrl.domData.trendData.temp}
          onClick={() =>
            appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.TEMPERATURE)
          }
        />
      </div>
      <div className="flex flex-col basis-1/4">
        <NumberDataWithTrend
          sensor={DOM_SENSORS_DESC.HUMIDITY}
          value={appContext.cCtrl.domData.data.humidity}
          old={appContext.cCtrl.domData.oldData}
          trend={appContext.cCtrl.domData.trendData.humidity}
          onClick={() =>
            appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.HUMIDITY)
          }
        />
      </div>
      <div className="flex flex-col basis-1/4">
        <NumberDataWithTrend
          sensor={DOM_SENSORS_DESC.RAIN}
          value={Number(appContext.cCtrl.domData.data.rain)}
          old={appContext.cCtrl.domData.oldData}
          trend={appContext.cCtrl.domData.trendData.rain.map((x) => Number(x))}
          onClick={() =>
            appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.RAIN)
          }
        />
      </div>
      <div className="flex flex-col basis-1/4">
        <NumberDataWithTrend
          sensor={DOM_SENSORS_DESC.TARIF}
          value={appContext.cCtrl.domData.data.tarif}
          old={appContext.cCtrl.domData.oldData}
          trend={appContext.cCtrl.domData.trendData.tarif}
          onClick={() =>
            appContext.setMeasurementAndLoad(DOM_SENSORS_DESC.TARIF)
          }
        />
      </div>
    </div>
  </div>
));

export default DomGardenHouse;
