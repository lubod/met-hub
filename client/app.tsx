import { observer } from "mobx-react";
import React from "react";
import HomePage from "./homepage";
import { AppContext } from ".";
import Go from "./go/go";

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
      {appContext.authCtrl.authData.location === "/go/" && (
        <Go appContext={appContext} />
      )}
    </div>
  );
});

export default App;
