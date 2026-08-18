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
    <div className="flex flex-row items-center justify-between">
      <div className="flex items-center gap-3">
        <Text>METEO FORECAST</Text>
        <span className="live-pulse-badge">
          <span className="live-pulse-dot" />
          <span>NORWEGIAN METEO</span>
        </span>
      </div>
      <button
        type="button"
        aria-label="Reload"
        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-light/70 hover:text-light transition-all border border-white/10 cursor-pointer shadow-sm"
        onClick={() => {
          appContext.forecastCtrl.fetchData();
          appContext.forecastCtrl.fetchAstronomicalData(new Date());
        }}
      >
        <LoadImg
          rotate={appContext.forecastCtrl.forecastData.loading}
          src="icons8-refresh-25.svg"
          alt="Refresh"
        />
      </button>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="glass-card !p-4 rounded-xl border border-white/10 flex flex-col justify-center shadow-sm">
        <Time
          label="Sunrise"
          time={appContext.forecastCtrl.forecastData.sunrise}
          format="HH:mm"
          old={false}
        />
      </div>
      <div className="glass-card !p-4 rounded-xl border border-white/10 flex flex-col justify-center shadow-sm">
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
