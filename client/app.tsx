import { observer } from "mobx-react";
import React from "react";
import Auth from "./auth/auth";
import HomePage from "./homepage";
import { AppContext } from ".";

type AppProps = {
  appContext: AppContext;
};

const App = observer(({ appContext }: AppProps) => {
  console.info(
    "App render",
    appContext.authData.isAuth,
    window.location.pathname,
    appContext.authData.location
  );

  return (
    <div className="App">
      {appContext.authData.location === "/" && (
        <HomePage appContext={appContext} />
      )}
      {appContext.authData.location === "/callback/" && (
        <Auth authCtrl={appContext.authCtrl} />
      )}
    </div>
  );
});

export default App;
