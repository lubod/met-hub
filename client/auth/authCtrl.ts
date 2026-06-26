/* eslint-disable camelcase */
import { AppContext } from "..";
import AuthData from "./authData";

export default class AuthCtrl {
  authData: AuthData;

  timer: ReturnType<typeof setInterval> | null = null;

  appContext!: AppContext;

  constructor(appContext: AppContext) {
    this.appContext = appContext;
    this.authData = new AuthData();
  }

  getAccessToken() {
    return this.authData.access_token;
  }

  checkAuth() {
    if (this.authData.expiresAt !== null && Date.now() > this.authData.expiresAt) {
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
          user.email,
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
    refreshToken: string | null,
    createdAt: number,
    admin: string | null,
    email: string | null = null,
  ) {
    this.authData.setAuth(
      given_name,
      family_name,
      expiresAt,
      id,
      refreshToken,
      createdAt,
      admin,
      email,
    );
    this.appContext.fetchCfg();
  }

  async logout() {
    this.authData.cancelAuth();
    await fetch("/api/logout", {});
    this.appContext.fetchCfg();
  }
}
