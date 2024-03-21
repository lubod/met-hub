import React from "react";
import { observer } from "mobx-react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { AppContext } from ".";
import Myhr from "./misc/myhr";
import { Container } from "./misc/container";
import AuthCtrl from "./auth/authCtrl";
import Text from "./misc/text";
import Heading from "./misc/heading";

export async function handleGoogleLogin(response: CredentialResponse, authCtrl: AuthCtrl) {
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
    data.createdAt,
    authCtrl.authData.admin,
  );
}

type Props = {
  appContext: AppContext;
};

const About = observer(({ appContext }: Props) => {
  console.info("About render");

  return (
    <Container>
      <div className="pt-7 pb-6">
        <Heading>www.met-hub.com</Heading>
      </div>
      <Myhr />
      <div className="flex flex-col gap-4">
        <Text>
          This is a free site for non-professional meteorological stations based
          on open-source project{" "}
          <a
            className="underline text-blue hover:text-blue2"
            href="https://github.com/lubod/met-hub"
          >
            met-hub
          </a>
        </Text>
        <Text>
          Currently you can see data from:
          <div>GoGEN ME 3900</div>
          <div>GARNI 1025 Arcus</div>
        </Text>
        <Text>Login to add your stations and see also historical data</Text>
        <div className="flex flex-row justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleGoogleLogin(credentialResponse, appContext.authCtrl);
            }}
            onError={() => {
              console.log("Login Failed");
            }}
            theme="filled_blue"
          />
        </div>
      </div>
      <Myhr />
      <Text>- v25 -</Text>
    </Container>
  );
});

export default About;
