/* eslint-disable camelcase */
/* eslint-disable max-classes-per-file */
import axios from "axios";
import { observable, makeObservable, action } from "mobx";

const ENV = process.env.ENV || "";

export class AuthData {
  profile: string = null;

  expiresAt: number = null;

  access_token: string = null;

  refresh_token: string = null;

  duration: number = null;

  isAuth: boolean = false;

  location: string = "/";

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
      checkAuth: action,
    });
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
    access_token: string,
    refresh_token: string,
    duration: number
  ) {
    this.profile = profile;
    this.expiresAt = expiresAt;
    this.access_token = access_token;
    this.refresh_token = refresh_token;
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

  checkAuth() {
    const time = Date.now();
    if (ENV === "dev") {
      this.isAuth = true;
      console.log("auth: dev env");
      return;
    }
    // console.info(time, this.expiresAt);
    /* if (time > this.expiresAt - this.duration / 2) {
      this.handleRefresh();
    } */
    if (time < this.expiresAt) {
      this.isAuth = true;
    } else {
      this.cancelAuth();
    }
  }

  login() {
    //        console.log('login');
    window.location.replace(
      "https://met-hub.auth.eu-central-1.amazoncognito.com/login?client_id=vn2mg0efils48lijdpc6arvl9&response_type=code&scope=aws.cognito.signin.user.admin&redirect_uri=https://www.met-hub.com/callback"
    );
  }

  logout() {
    // clear id token and expiration
    this.cancelAuth();
    window.location.reload();
  }
}

export class AuthCtrl {
  authData: AuthData;

  timer: any;

  constructor(authData: AuthData) {
    this.authData = authData;
  }

  getProfile() {
    return this.authData.profile;
  }

  getAccessToken() {
    return this.authData.access_token;
  }

  start() {
    this.timer = setInterval(() => {
      this.authData.checkAuth();
    }, 1000);
  }

  fetchToken() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get("code");
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", "vn2mg0efils48lijdpc6arvl9");
    params.append("code", code);
    params.append("redirect_uri", "https://www.met-hub.com/callback");

    //        console.log('get token');
    return axios.post(
      "https://met-hub.auth.eu-central-1.amazoncognito.com/oauth2/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
  }

  refreshToken() {
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("client_id", "vn2mg0efils48lijdpc6arvl9");
    params.append("refresh_token", this.authData.refresh_token);

    //        console.log('get token');
    return axios.post(
      "https://met-hub.auth.eu-central-1.amazoncognito.com/oauth2/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
  }

  fetchProfile() {
    return fetch("/api/getUserProfile", {
      headers: {
        Authorization: `Bearer ${this.authData.access_token}`,
      },
    });
  }

  handleRefresh() {
    if (this.authData.refresh_token != null) {
      console.log("handle refresh");
      return new Promise<void>((resolve, reject) => {
        this.refreshToken()
          .then((res) => {
            // console.info(res.data);
            this.authData.setAuth(
              "user",
              res.data.expires_in * 1000 + Date.now(),
              res.data.access_token,
              res.data.refresh_token,
              res.data.expires_in * 1000
            );
            resolve();
          })
          .catch((err) => {
            this.authData.cancelAuth();
            console.error(err);
            return reject(err);
          });
      });
    }
    return null;
  }

  handleAuthentication() {
    console.log("handle auth");
    return new Promise<void>((resolve, reject) => {
      this.fetchToken()
        .then((res) => {
          // console.info(res.data);
          window.history.pushState({}, null, "/");
          this.authData.setAuth(
            "user",
            res.data.expires_in * 1000 + Date.now(),
            res.data.access_token,
            res.data.refresh_token,
            res.data.expires_in * 1000
          );
          resolve();
        })
        .catch((err) => {
          this.authData.cancelAuth();
          console.error(err);
          return reject(err);
        });
    });
  }

  handleProfile() {
    console.log("handle profile");
    return new Promise<void>((resolve, reject) => {
      this.fetchProfile().then((res) => {
        res
          .json()
          .then((json) => {
            this.authData.setProfile(json);
            // console.info(res);
            resolve();
          })
          .catch((err) => {
            console.error(err);
            return reject(err);
          });
      });
    });
  }
}
