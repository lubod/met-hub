/* eslint-disable camelcase */
import { AppContext } from "..";
import AuthData from "./authData";

export default class AuthCtrl {
  authData: AuthData;

  timer: ReturnType<typeof setInterval> | null = null;

  appContext: AppContext = null;

  constructor(appContext: AppContext) {
    this.appContext = appContext;
    this.authData = new AuthData();
  }

  getAccessToken() {
    return this.authData.access_token;
  }

  checkAuth() {
    if (Date.now() > this.authData.expiresAt) {
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
    try {
      const res = await fetch("/api/getUserProfile", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();
      if (json?.user != null) {
        const { admin, user } = json;
        this.setAuth(
          user.given_name,
          user.family_name,
          user.expiresAt,
          user.id,
          null,
          user.createdAt,
          admin,
        );
      } else {
        this.authData.cancelAuth();
        this.appContext.fetchCfg();
      }
    } catch (e) {
      console.error("fetchProfile failed:", e);
      this.authData.cancelAuth();
      this.appContext.fetchCfg();
    }
  }

  setAuth(
    given_name: string,
    family_name: string,
    expiresAt: number,
    id: string,
    refreshToken: string,
    createdAt: number,
    admin: string,
  ) {
    this.authData.setAuth(
      given_name,
      family_name,
      expiresAt,
      id,
      refreshToken,
      createdAt,
      admin,
    );
    this.appContext.fetchCfg();
  }

  async logout() {
    this.authData.cancelAuth();
    await fetch("/api/logout", {});
    this.appContext.fetchCfg();
  }
}
