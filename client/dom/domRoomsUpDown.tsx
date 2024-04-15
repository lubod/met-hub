/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import { observer } from "mobx-react";
import { Switch } from "@headlessui/react";
import { AppContext } from "..";
import Text from "../misc/text";
import DomRoomsUp from "./domRoomsUp";
import DomRoomsDown from "./domRoomsDown";

type Props = {
  appContext: AppContext;
};

const DomRoomsUpDown = observer(({ appContext }: Props) => (
  <>
    <div className="flex flex-row gap-2 justify-center">
      <Text>DATA</Text>
      <div className="flex flex-col place-content-center">
        <Switch
          checked={appContext.cCtrl.domData.upDown}
          onChange={(e) => {
            appContext.cCtrl.domData.setUpDown(e);
          }}
          className="bg-gray relative inline-flex h-[16px] w-[32px] shrink-0 cursor-pointer rounded-full ease-in-out"
        >
          {!appContext.cCtrl.domData.upDown && (
            <span className="translate-x-0 pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full bg-blue shadow-lg ring-0 transition duration-200 ease-in-out" />
          )}
          {appContext.cCtrl.domData.upDown && (
            <span className="translate-x-4 pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full bg-blue shadow-lg ring-0 transition duration-200 ease-in-out" />
          )}
        </Switch>
      </div>
      <div className="text-md text-light font-normal font-sans text-center">
        DOWN / UP
      </div>
    </div>
    <div className="flex flex-row text-gray p-3">
      <div className="basis-1/4 text-center">Air</div>
      <div className="basis-1/4 text-center">Floor</div>
      <div className="basis-1/4 text-center">Req</div>
      <div className="basis-1/4 text-center">HSL</div>
    </div>
    {appContext.cCtrl.domData.upDown === true && (
      <DomRoomsUp appContext={appContext} />
    )}
    {appContext.cCtrl.domData.upDown === false && (
      <DomRoomsDown appContext={appContext} />
    )}
  </>
));

export default DomRoomsUpDown;
