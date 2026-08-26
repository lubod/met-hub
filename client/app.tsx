import { observer } from "mobx-react";
import React from "react";
import HomePage from "./homepage";
import SettingsView from "./settings/settings";
import { AppContext } from ".";

type AppProps = {
  appContext: AppContext;
};

const App = observer(({ appContext }: AppProps) => {
  console.debug(
    "App render",
    appContext.authCtrl.authData.isAuth,
    window.location.pathname,
    appContext.authCtrl.authData.location
  );

  return (
    <div className="App">
      {appContext.authCtrl.authData.location === "/" && (
        <HomePage appContext={appContext} />
      )}
      {appContext.authCtrl.authData.location === "/settings" && (
        <SettingsView appContext={appContext} />
      )}
    </div>
  );
});

export default App;
