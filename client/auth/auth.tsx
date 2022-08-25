import React from "react";
import { Container } from "react-bootstrap";
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
  return (
    <Container className="text-center text-light border-primary bg-very-dark rounded mb-2 py-2">
      {" "}
      Authenticate ...
    </Container>
  );
};

export default Auth;
