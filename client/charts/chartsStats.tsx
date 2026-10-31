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
    <div className="glass rounded-xl p-3 grid grid-cols-2 md:grid-cols-3 gap-2.5">
      <div>
        <NumberData
          label="Min"
          value={appContext.chartsCtrl.chartsData.cdata.min}
          unit=""
          fix={1}
        />
      </div>
      <div>
        <NumberData
          label="Avg"
          value={appContext.chartsCtrl.chartsData.cdata.avg}
          unit=""
          fix={1}
        />
      </div>
      <div>
        <NumberData
          label="Max"
          value={appContext.chartsCtrl.chartsData.cdata.max}
          unit=""
          fix={1}
        />
      </div>
      <div>
        <NumberData
          label="First"
          value={appContext.chartsCtrl.chartsData.cdata.first}
          unit=""
          fix={1}
        />
      </div>
      <div>
        <NumberData
          label="Last"
          value={appContext.chartsCtrl.chartsData.cdata.last}
          unit=""
          fix={1}
        />
      </div>
      <div>
        <NumberData
          label="Page"
          value={appContext.chartsCtrl.chartsData.page}
          unit=""
          fix={0}
        />
      </div>
    </div>
  </>
));



export default ChartsStats;
