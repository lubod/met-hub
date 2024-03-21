import React from "react";
import { observer } from "mobx-react";
import { AppContext } from "..";
import NumberData from "../misc/numberData";
import ChartsSensorsList from "./chartsSensorsList";

type Props = {
  appContext: AppContext;
};

const ChartsStats = observer(({ appContext }: Props) => (
  <>
    <div className="mb-4 flex flex-row justify-center">
      <ChartsSensorsList chartsCtrl={appContext.chartsCtrl} />
    </div>
    <div className="flex flex-row">
      <div className="flex flex-col gap-4 basis-1/3">
        <NumberData
          label="First"
          value={appContext.chartsCtrl.chartsData.cdata.first}
          unit=""
          fix={1}
        />
        <NumberData
          label="Min"
          value={appContext.chartsCtrl.chartsData.cdata.min}
          unit=""
          fix={1}
        />
      </div>
      <div className="flex flex-col gap-4 basis-1/3">
        <NumberData
          label="Page"
          value={appContext.chartsCtrl.chartsData.page}
          unit=""
          fix={0}
        />
        <NumberData
          label="Avg"
          value={appContext.chartsCtrl.chartsData.cdata.avg}
          unit=""
          fix={1}
        />
      </div>
      <div className="flex flex-col gap-4 basis-1/3">
        <NumberData
          label="Max"
          value={appContext.chartsCtrl.chartsData.cdata.max}
          unit=""
          fix={1}
        />
        <NumberData
          label="Last"
          value={appContext.chartsCtrl.chartsData.cdata.last}
          unit=""
          fix={1}
        />
      </div>
    </div>
  </>
));

export default ChartsStats;
