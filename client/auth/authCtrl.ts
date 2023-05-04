/* eslint-disable camelcase */
import { AppContext } from "..";
import AuthData from "./authData";

export default class AuthCtrl {
  authData: AuthData;

  timer: any;

  appContext: AppContext = null;

  constructor(appContext: AppContext) {
    this.appContext = appContext;
    this.authData = new AuthData();
  }

  getAccessToken() {
    return this.authData.access_token;
  }

  checkAuth() {
    const time = Date.now();
    //    if (time > this.authData.expiresAt - this.authData.duration / 2) {
    //      this.handleRefresh();
    //    }
    if (time < this.authData.expiresAt) {
      this.authData.isAuth = true;
    } else {
      this.authData.cancelAuth();
    }
  }

  start() {
    this.fetchProfile();
    this.timer = setInterval(() => {
      this.checkAuth();
    }, 1000);
  }

  async fetchProfile() {
    const res = await fetch("/api/getUserProfile", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const user = await res.json();
    if (user != null) {
      this.setAuth(
        user.given_name,
        user.family_name,
        user.expiresAt * 1000 + Date.now(),
        user.id,
        null,
        user.createdAt
      );
    }
    else {
      this.authData.cancelAuth();
      this.appContext.fetchCfg();
    }
  }

  setAuth( // todo
    given_name: string,
    family_name: string,
    expiresAt: number,
    id: string,
    refreshToken: string,
    createdAt: number
  ) {
    this.authData.setAuth(
      given_name,
      family_name,
      expiresAt,
      id,
      refreshToken,
      createdAt
    );
    this.appContext.fetchCfg();
  }

  login() {}

  async logout() {
    this.authData.cancelAuth();
    await fetch("/api/logout", {});
    this.appContext.fetchCfg();
  }
}
