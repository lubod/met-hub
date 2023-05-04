/* eslint-disable camelcase */
/* eslint-disable max-classes-per-file */
import { observable, makeObservable, action } from "mobx";

export default class AuthData {
  id: string = null;

  given_name: string = null;

  family_name: string = null;

  expiresAt: number = null;

  createdAt: number = null;

  access_token: string = null;

  refresh_token: string = null;

  isAuth: boolean = false;

  location: string = "/";

  constructor() {
    makeObservable(this, {
      id: observable,
      given_name: observable,
      family_name: observable,
      expiresAt: observable,
      access_token: observable,
      refresh_token: observable,
      createdAt: observable,
      isAuth: observable,
      location: observable,
      setAuth: action,
      cancelAuth: action,
    });
  }

  setLocation(location: string) {
    this.location = location;
  }

  setAuth(
    given_name: string,
    family_name: string,
    expiresAt: number,
    id: string,
    refreshToken: string,
    createdAt: number
  ) {
    this.given_name = given_name;
    this.family_name = family_name;
    this.expiresAt = expiresAt;
    this.id = id;
    this.refresh_token = refreshToken;
    this.createdAt = createdAt;
    this.isAuth = true;
    this.location = "/";
  }

  cancelAuth() {
    this.id = null;
    this.given_name = null;
    this.family_name = null;
    this.expiresAt = null;
    this.access_token = null;
    this.refresh_token = null;
    this.createdAt = null;
    this.isAuth = false;
    this.location = "/";
  }
}
