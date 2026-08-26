/* eslint-disable prefer-template */
/* eslint-disable no-param-reassign */
import { observer } from "mobx-react";
import React from "react";
import { AppContext } from "..";
import { HeaderContainer } from "../misc/container";
import StringData from "../misc/stringData";
import Time from "../misc/time";
import HeaderDropdown from "./headerDropdown";
import HeaderStationsList from "./headerStationsList";
import HeaderModal from "./headerModal";
import HeaderData from "./headerData";

type Props = {
  appContext: AppContext;
};

const HeaderCurrentTime = observer(({ headerData }: { headerData: HeaderData }) => (
  <Time
    label="Current time"
    time={headerData.ctime}
    format="HH:mm:ss"
    old={false}
  />
));

const Header = observer(({ appContext }: Props) => {
  const isFresh = !appContext.cCtrl.stationData.oldData;

  return (
    <HeaderContainer>
      <div className="flex flex-wrap items-center gap-3 md:grid md:grid-cols-[1fr_auto_1fr]">
        {/* Left: Brand Identity + Live Badge */}
        <div className="flex w-full items-center gap-3 max-md:w-full md:w-auto">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#e07856] via-[#6ba3a8] to-[#8dbe9d] p-[1px] flex items-center justify-center shadow-md shadow-[#e07856]/10">
              <div className="w-full h-full bg-[#0e121c] rounded-[7px] flex items-center justify-center text-xs font-black text-white select-none">
                ⚡
              </div>
            </div>
            <span className="font-extrabold tracking-wider text-sm bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/70 select-none">
              MET-HUB
            </span>
          </div>


          <div className="max-md:ml-auto">
            <HeaderCurrentTime headerData={appContext.headerCtrl.headerData} />
          </div>
        </div>

        {/* Center: Add station & Login / user menu */}
        {appContext.headerCtrl.headerData.isExternalID === false && (
          <nav className="order-last flex flex-row items-center gap-1 shrink-0 md:order-none md:justify-center">
            <HeaderModal appContext={appContext} />
            <HeaderDropdown appContext={appContext} />
          </nav>
        )}
        {appContext.headerCtrl.headerData.isExternalID === true && (
          <div className="flex flex-col justify-center min-w-0">
            <StringData
              label=""
              value={appContext.headerCtrl.headerData.station?.place ?? ""}
            />
          </div>
        )}

        {/* Right: Station selector (or powered-by on external views) */}
        {appContext.headerCtrl.headerData.isExternalID === false &&
          appContext.headerCtrl.headerData.allStations != null && (
            <div className="order-last ml-auto flex min-w-0 md:order-none md:ml-0 md:w-auto md:justify-self-end">
              <HeaderStationsList appContext={appContext} />
            </div>
          )}
        {appContext.headerCtrl.headerData.isExternalID === true && (
          <div className="ml-auto shrink-0 md:ml-0 md:justify-self-end">
            <a href="https://www.met-hub.com">
              <StringData label="Powered by" value="www.met-hub.com" />
            </a>
          </div>
        )}
      </div>
    </HeaderContainer>
  );
});

export default Header;
