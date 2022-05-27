import { observer } from "mobx-react";
import React from "react";
import AuthCtrl from "./auth/authCtrl";
import AuthData from "./auth/authData";
import Auth from "./auth/auth";
import DomData from "./dom/domData";
import HeaderData from "./header/headerData";
import HomePage from "./homepage";
import StationData from "./station/stationData";

type AppProps = {
  headerData: HeaderData;
  stationData: StationData;
  domData: DomData;
  authData: AuthData;
  authCtrl: AuthCtrl;
};

const App = observer(
  ({ headerData, stationData, domData, authData, authCtrl }: AppProps) => {
    console.info(
      "App render",
      authData.isAuth,
      window.location.pathname,
      authData.location
    );

    return (
      <div className="App">
        {authData.location === "/" && (
          <HomePage
            headerData={headerData}
            stationData={stationData}
            domData={domData}
            authData={authData}
          />
        )}
        {authData.location === "/callback/" && <Auth authCtrl={authCtrl} />}
      </div>
    );
  }
);

export default App;
