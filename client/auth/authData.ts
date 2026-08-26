/* eslint-disable camelcase */
/* eslint-disable max-classes-per-file */
import { observable, makeObservable, action } from "mobx";

export default class AuthData {
  id: string | null = null;

  given_name: string | null = null;

  family_name: string | null = null;

  expiresAt: number | null = null;

  createdAt: number | null = null;

  isAuth: boolean = false;

  location: string = "/";

  // Boolean flag from /api/getUserProfile — the raw admin account id never
  // reaches the client.
  isAdmin: boolean | null = null;

  email: string | null = null;

  constructor() {
    makeObservable(this, {
      id: observable,
      given_name: observable,
      family_name: observable,
      expiresAt: observable,
      createdAt: observable,
      isAuth: observable,
      location: observable,
      isAdmin: observable,
      email: observable,
      setAuth: action,
      cancelAuth: action,
    });
  }

  setLocation(location: string) {
    this.location = location;
  }

  // Session lives in the httpOnly JWT cookie; no tokens are stored client-side.
  setAuth(
    given_name: string,
    family_name: string,
    expiresAt: number,
    id: string,
    createdAt: number,
    isAdmin: boolean | null,
    email: string | null = null
  ) {
    this.given_name = given_name;
    this.family_name = family_name;
    this.expiresAt = expiresAt;
    this.id = id;
    this.createdAt = createdAt;
    this.isAuth = true;
    this.location = "/";
    this.isAdmin = isAdmin;
    this.email = email;
  }

  cancelAuth() {
    this.id = null;
    this.given_name = null;
    this.family_name = null;
    this.expiresAt = null;
    this.createdAt = null;
    this.isAuth = false;
    this.location = "/";
    this.isAdmin = null;
    this.email = null;
  }
}
