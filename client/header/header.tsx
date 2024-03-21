/* eslint-disable prefer-template */
/* eslint-disable no-param-reassign */
import { observer } from "mobx-react";
import React from "react";
// import { isMobile } from "react-device-detect";
import { AppContext } from "..";
import { Container } from "../misc/container";
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

  <Container>
    <div className="flex flex-row justify-between">
      <Time
        label="Current time"
        time={appContext.headerCtrl.headerData.ctime}
        format="HH:mm:ss"
        old={false}
      />
      {appContext.headerCtrl.headerData.isExternalID === false &&
        appContext.headerCtrl.headerData.allStations != null && (
          <div className="flex flex-col justify-center">
            <HeaderStationsList appContext={appContext} />
          </div>
        )}
      {appContext.headerCtrl.headerData.isExternalID === true && (
        <div className="flex flex-col justify-center">
          <StringData
            label=""
            value={appContext.headerCtrl.headerData.station.place}
          />
        </div>
      )}
      {appContext.headerCtrl.headerData.isExternalID === false && (
        <nav className="flex flex-col justify-center">
          <HeaderModal appContext={appContext} />
          <HeaderDropdown appContext={appContext} />
        </nav>
      )}
      {appContext.headerCtrl.headerData.isExternalID === true && (
        <div>
          <a href="https://www.met-hub.com">
            <StringData label="Powered by" value="www.met-hub.com" />
          </a>
        </div>
      )}
    </div>
  </Container>
));

export default Header;

//       <AddStation appContext={appContext} />
/*
className="bg-blue text-light rounded-md hover:bg-blue2 py-1.5 px-3"
>
</button>
<button
type="button"
onClick={() =>
  appContext.headerCtrl.headerData.setShowModal(true)
}
className="bg-gray2 text-light rounded-md hover:bg-gray3 py-1.5 px-3"
>
Add
</button>
*/
