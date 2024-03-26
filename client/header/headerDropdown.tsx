import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Menu } from "@headlessui/react";
import { observer } from "mobx-react";
import { AppContext } from "..";
import { handleGoogleLogin } from "../about";

type Props = {
  appContext: AppContext;
};

const HeaderDropdown = observer(({ appContext }: Props) => (
  <Menu as="div" className="relative flex flex-row justify-end">
    <Menu.Button className="bg-blue text-light rounded-md hover:bg-blue2 pt-1 pb-2.5 px-3 justify-self-end">
      ...
    </Menu.Button>
    {appContext.authCtrl.authData.isAuth && (
      <Menu.Items className="absolute z-10 right-0 w-52 bg-blue rounded-md mt-1 text-light shadow-lg">
        <Menu.Item as="div" className="flex w-full items-center rounded-md p-1">
          <div className="p-1 text-gray">
            {appContext.authCtrl.authData.given_name}{" "}
            {appContext.authCtrl.authData.family_name}
          </div>
        </Menu.Item>
        <Menu.Item as="div" className="flex w-full items-center rounded-md p-1">
          <button
            type="button"
            className="bg-blue flex w-full items-center rounded-md p-1 hover:bg-blue2"
            onClick={() => appContext.headerCtrl.headerData.setShowModal(true)}
          >
            Add new station
          </button>
        </Menu.Item>
        <Menu.Item as="div" className="flex w-full items-center rounded-md p-1">
          <button
            type="button"
            className="bg-blue flex w-full items-center rounded-md p-1 hover:bg-blue2"
            onClick={() => appContext.authCtrl.logout()}
          >
            Logout
          </button>
        </Menu.Item>
      </Menu.Items>
    )}
    {!appContext.authCtrl.authData.isAuth && (
      <Menu.Items className="absolute z-10 right-0 w-52 bg-blue rounded-md mt-1 text-light shadow-lg">
        <Menu.Item as="div" className="flex w-full items-center rounded-md p-1">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleGoogleLogin(credentialResponse, appContext.authCtrl);
            }}
            onError={() => {
              console.log("Login Failed");
            }}
            theme="filled_blue"
          />
        </Menu.Item>
      </Menu.Items>
    )}
  </Menu>
));

export default HeaderDropdown;

//       <AddStation appContext={appContext} />
