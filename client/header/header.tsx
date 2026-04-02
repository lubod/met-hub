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

type Props = {
  appContext: AppContext;
};

const Header = observer(({ appContext }: Props) => (
  // console.info("Header render");

  <HeaderContainer>
    <div className="flex flex-row flex-wrap justify-between gap-2">
      <Time
        label="Current time"
        time={appContext.headerCtrl.headerData.ctime}
        format="HH:mm:ss"
        old={false}
      />
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
            value={appContext.headerCtrl.headerData.station.place}
          />
        </div>
      )}
      {appContext.headerCtrl.headerData.isExternalID === false && (
        <nav className="flex flex-col justify-center shrink-0">
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
  </HeaderContainer>
));

export default Header;
