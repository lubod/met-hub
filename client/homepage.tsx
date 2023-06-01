import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { observer } from "mobx-react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import Protected from "./protected";
import Station from "./station/station";
import Header from "./header/header";
import { AppContext } from ".";
import Forecast from "./forecast/forecast";
import { Myhr } from "./misc/myhr";
import { MyContainer } from "./misc/mycontainer";
import AuthCtrl from "./auth/authCtrl";

async function handleLogin(response: CredentialResponse, authCtrl: AuthCtrl) {
  console.info("google login", response);
  const res = await fetch("/api/googleLogin", {
    method: "POST",
    body: JSON.stringify({
      token: response.credential,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  // console.info(data); // todo
  authCtrl.setAuth(
    data.given_name,
    data.family_name,
    data.expiresAt,
    data.id,
    null,
    data.createdAt
  );
}

type HomePageProps = {
  appContext: AppContext;
};

const HomePage = observer(({ appContext }: HomePageProps) => {
  console.info("Homepage render", appContext.authCtrl.authData.isAuth);
  let colSize = 4;
  if (appContext.headerCtrl.headerData.isExternalID) {
    colSize = 6;
  }

  return (
    <div>
      {!appContext.authCtrl.authData.isAuth && (
        <Container className="container-max-width text-center mx-auto vh-100">
          <Row className="">
            <Header appContext={appContext} />
          </Row>
          <Row>
            <Col sm={colSize} className="ps-1 pe-1">
              {appContext.headerCtrl.headerData.station != null && (
                <Station appContext={appContext} />
              )}
            </Col>
            <Col sm={colSize} className="ps-1 pe-1">
              {appContext.headerCtrl.headerData.station != null && (
                <Forecast forecastCtrl={appContext.forecastCtrl} />
              )}
            </Col>
            {appContext.headerCtrl.headerData.isExternalID === false && (
              <Col sm={colSize} className="ps-1 pe-1">
                <MyContainer>
                  <h1 className="text-primary">met-hub.com</h1>
                  <p>
                    This is a free site for non-professional meteorological
                    stations based on open-source project{" "}
                    <a href="https://github.com/lubod/met-hub">met-hub</a>
                  </p>
                  <Myhr />
                  <ul>
                    Currently you can see data from:
                    <li>GoGEN ME 3900</li>
                    <li>GARNI 1025 Arcus</li>
                  </ul>
                  <p>Login to see more stations and historical data</p>
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      handleLogin(credentialResponse, appContext.authCtrl);
                    }}
                    onError={() => {
                      console.log("Login Failed");
                    }}
                    theme="filled_blue"
                  />
                  <Myhr />
                  <p>- v24 -</p>
                </MyContainer>
              </Col>
            )}
          </Row>
        </Container>
      )}
      {appContext.authCtrl.authData.isAuth && (
        <Protected appContext={appContext} />
      )}
    </div>
  );
});

export default HomePage;
