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
  <div className="flex items-center justify-end md:min-w-28">
    {!appContext.authCtrl.authData.isAuth && (
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          handleGoogleLogin(credentialResponse, appContext.authCtrl);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
        theme="filled_black"
        size="small"
        shape="pill"
      />
    )}
    {appContext.authCtrl.authData.isAuth && (
      <Menu as="div" className="relative flex justify-end">
        <Menu.Button className="btn-glass px-3 py-1.5">
          {appContext.authCtrl.authData.given_name || "..."}
        </Menu.Button>
        <Menu.Items className="glass-dropdown absolute z-[60] right-0 w-52 mt-10 p-1 text-light">
          <Menu.Item as="div" className="flex w-full items-center rounded-lg p-1">
            <div className="px-2 py-1 text-sm opacity-50">
              {appContext.authCtrl.authData.given_name}{" "}
              {appContext.authCtrl.authData.family_name}
            </div>
          </Menu.Item>
          <Menu.Item as="div" className="flex w-full items-center rounded-lg p-1">
            <button
              type="button"
              className="flex w-full items-center rounded-lg px-2 py-1.5 text-sm hover:bg-white/10"
              onClick={() => appContext.headerCtrl.headerData.setShowModal(true)}
            >
              Add new station
            </button>
          </Menu.Item>
          <Menu.Item as="div" className="flex w-full items-center rounded-lg p-1">
            <button
              type="button"
              className="flex w-full items-center rounded-lg px-2 py-1.5 text-sm hover:bg-white/10"
              onClick={() => appContext.authCtrl.logout()}
            >
              Logout
            </button>
          </Menu.Item>
        </Menu.Items>
      </Menu>
    )}
  </div>
));

export default HeaderDropdown;

//       <AddStation appContext={appContext} />
