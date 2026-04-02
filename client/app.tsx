import { observer } from "mobx-react";
import React from "react";
import HomePage from "./homepage";
import { AppContext } from ".";

type AppProps = {
  appContext: AppContext;
};

const App = observer(({ appContext }: AppProps) => {
  console.info(
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
    </div>
  );
});

export default App;
