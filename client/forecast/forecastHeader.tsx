import React from "react";
import { observer } from "mobx-react";
import { LoadImg } from "../misc/loadImg";
import Text from "../misc/text";
import Time from "../misc/time";
import { AppContext } from "..";

type Props = {
  appContext: AppContext;
};

const ForecastHeader = observer(({ appContext }: Props) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-row justify-between">
      <Text>FORECAST DATA</Text>
      <button
        type="button"
        aria-label="Reload"
        onClick={() => {
          appContext.forecastCtrl.fetchData();
          appContext.forecastCtrl.fetchAstronomicalData(new Date());
        }}
      >
        <LoadImg
          rotate={appContext.forecastCtrl.forecastData.loading}
          src="icons8-refresh-25.svg"
          alt=""
        />
      </button>
    </div>
    <div className="flex flex-row">
      <div className="flex flex-col basis-1/2">
        <Time
          label="Sunrise"
          time={appContext.forecastCtrl.forecastData.sunrise}
          format="HH:mm"
          old={false}
        />
      </div>
      <div className="flex flex-col basis-1/2">
        <Time
          label="Sunset"
          time={appContext.forecastCtrl.forecastData.sunset}
          format="HH:mm"
          old={false}
        />
      </div>
    </div>
  </div>
));

export default ForecastHeader;
