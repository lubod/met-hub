/* eslint-disable max-classes-per-file */
import { observable, makeObservable, action } from "mobx";

export default class AuthData {
  profile: string = null;

  expiresAt: number = null;

  access_token: string = null;

  refresh_token: string = null;

  duration: number = null;

  isAuth: boolean = false;

  location: string = "/";

  callWhenAuthetificated: Function = null;

  constructor() {
    makeObservable(this, {
      profile: observable,
      expiresAt: observable,
      access_token: observable,
      refresh_token: observable,
      duration: observable,
      isAuth: observable,
      location: observable,
      setAuth: action,
      setProfile: action,
      cancelAuth: action,
    });
  }

  setCallWhenAuthetificated(callWhenAuthetificated: Function) {
    this.callWhenAuthetificated = callWhenAuthetificated;
  }

  setProfile(profile: string) {
    this.profile = profile;
  }

  setLocation(location: string) {
    this.location = location;
  }

  setAuth(
    profile: string,
    expiresAt: number,
    accessToken: string,
    refreshToken: string,
    duration: number
  ) {
    this.profile = profile;
    this.expiresAt = expiresAt;
    this.access_token = accessToken;
    this.refresh_token = refreshToken;
    this.duration = duration;
    this.isAuth = true;
    this.location = "/";
  }

  cancelAuth() {
    this.profile = null;
    this.expiresAt = null;
    this.access_token = null;
    this.refresh_token = null;
    this.duration = null;
    this.isAuth = false;
    this.location = "/";
  }
}
