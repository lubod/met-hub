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
      <div className="flex flex-row flex-wrap items-center justify-between gap-3">
        {/* Left: Brand Identity + Live Badge */}
        <div className="flex items-center gap-3">
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

          <div
            className="live-pulse select-none"
            style={{
              backgroundColor: isFresh ? "rgba(141, 190, 157, 0.12)" : "rgba(212, 168, 67, 0.12)",
              border: `1px solid ${isFresh ? "rgba(141, 190, 157, 0.3)" : "rgba(212, 168, 67, 0.3)"}`,
              color: isFresh ? "#8dbe9d" : "#d4a843",
            }}
          >
            <span
              className="live-pulse-dot"
              style={{ backgroundColor: isFresh ? "#8dbe9d" : "#d4a843" }}
            />
            <span>{isFresh ? "Live" : "Stale"}</span>
          </div>
        </div>

        {/* Center: Station selector */}
        {appContext.headerCtrl.headerData.isExternalID === false &&
          appContext.headerCtrl.headerData.allStations != null && (
            <div className="flex flex-col justify-center min-w-0">
              <HeaderStationsList appContext={appContext} />
            </div>
          )}
        {appContext.headerCtrl.headerData.isExternalID === true && (
          <div className="flex flex-col justify-center min-w-0">
            <StringData
              label=""
              value={appContext.headerCtrl.headerData.station?.place ?? ""}
            />
          </div>
        )}

        {/* Right: Time & User menu */}
        <div className="flex items-center gap-3">
          <HeaderCurrentTime headerData={appContext.headerCtrl.headerData} />
          {appContext.headerCtrl.headerData.isExternalID === false && (
            <nav className="flex flex-row items-center gap-1 shrink-0">
              <HeaderModal appContext={appContext} />
              <HeaderDropdown appContext={appContext} />
            </nav>
          )}
          {appContext.headerCtrl.headerData.isExternalID === true && (
            <div className="shrink-0">
              <a href="https://www.met-hub.com">
                <StringData label="Powered by" value="www.met-hub.com" />
              </a>
            </div>
          )}
        </div>
      </div>
    </HeaderContainer>
  );
});

export default Header;
