import React from "react";
import { observer } from "mobx-react";
import { AppContext } from "..";
import Myhr from "../misc/myhr";
import { Container } from "../misc/container";
import DomHeader from "./domHeader";
import DomGardenHouse from "./domGardenHouse";
import DomRoomsUpDown from "./domRoomsUpDown";

type DomProps = {
  appContext: AppContext;
};

const Dom = observer(({ appContext }: DomProps) => (
  // console.info(
  //   "dom render",
  //   appContext.authCtrl.authData.isAuth,
  //   appContext.cCtrl.domData.oldData,
  // );

  <Container>
    <DomHeader appContext={appContext} />
    <Myhr />
    <DomGardenHouse appContext={appContext} />
    <Myhr />
    <DomRoomsUpDown appContext={appContext} />
  </Container>
));

export default Dom;
