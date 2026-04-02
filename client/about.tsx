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
  className?: string;
};

const About = observer(({ appContext, className }: Props) => {
  console.info("About render");

  return (
    <Container className={className ?? "max-w-sm mx-auto"}>
      <div className="pt-7 pb-6">
        <Heading>www.met-hub.com</Heading>
      </div>
      <Myhr />
      <div className="flex flex-col gap-4">
        <p className="text-white/70 text-sm leading-relaxed">
          This is a free site for non-professional meteorological stations based
          on open-source project{" "}
          <a
            className="underline text-cyan/80 hover:text-cyan"
            href="https://github.com/lubod/met-hub"
          >
            met-hub
          </a>
        </p>
        <p className="text-white/70 text-sm leading-relaxed">
          Currently you can see data from:
          <span className="block mt-1 text-white/50">GoGEN ME 3900 · GARNI 1025 Arcus</span>
        </p>
        <p className="text-white/70 text-sm leading-relaxed">Login to add your stations and see also historical data</p>
        <div className="flex flex-row justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleGoogleLogin(credentialResponse, appContext.authCtrl);
            }}
            onError={() => {
              console.log("Login Failed");
            }}
            theme="filled_black"
            shape="pill"
          />
        </div>
      </div>
      <Myhr />
      <div className="metric-label text-center">v25</div>
    </Container>
  );
});

export default About;
