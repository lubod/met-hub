import React from "react";
import { MyContainer } from "../data/mycontainer";
import AuthCtrl from "./authCtrl";

type AuthProps = {
  authCtrl: AuthCtrl;
};

const Auth = function ({ authCtrl }: AuthProps) {
  console.info("Callback render");
  authCtrl.handleAuthentication().then(() => {
    console.info(authCtrl.authData.isAuth);
    authCtrl.handleProfile().then(() => {
      console.info(authCtrl.authData.profile);
    });
  });

  //    console.log('Callback');
  return <MyContainer> Authenticate ...</MyContainer>;
};

export default Auth;
