import React from "react";
import { observer } from "mobx-react";
import { LoadImg } from "../misc/loadImg";
import Text from "../misc/text";
import { AppContext } from "..";
import ChartsRangeList from "./chartsRangeList";

type Props = {
  appContext: AppContext;
};

const ChartsHeader = observer(({ appContext }: Props) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-row justify-between">
      <Text>HISTORICAL DATA</Text>
      <button
        type="button"
        aria-label="Reload"
        onClick={() => {
          appContext.chartsCtrl.chartsData.setPage(0);
          appContext.chartsCtrl.reload();
        }}
      >
        <LoadImg
          rotate={appContext.chartsCtrl.chartsData.loading}
          src="icons8-refresh-25.svg"
          alt=""
        />
      </button>
    </div>
    <div className="flex flex-row justify-between py-2">
      <button
        className="bg-gray2 text-light py-1.5 px-3 rounded-md hover:bg-gray3"
        type="button"
        onClick={() => {
          appContext.chartsCtrl.chartsData.setPage(
            appContext.chartsCtrl.chartsData.page - 1,
          );
          appContext.chartsCtrl.reload();
        }}
      >
        Prev
      </button>
      <ChartsRangeList chartsCtrl={appContext.chartsCtrl} />
      <button
        className="bg-gray2 text-light rounded-md hover:bg-gray3 py-1.5 px-3"
        type="button"
        onClick={() => {
          appContext.chartsCtrl.chartsData.setPage(
            appContext.chartsCtrl.chartsData.page < 0
              ? appContext.chartsCtrl.chartsData.page + 1
              : 0,
          );
          appContext.chartsCtrl.reload();
        }}
      >
        Next
      </button>
    </div>
  </div>
));

export default ChartsHeader;
