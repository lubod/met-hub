/* eslint-disable max-classes-per-file */
import axios from "axios";
import AuthData from "./authData";

export default class AuthCtrl {
  authData: AuthData;

  timer: any;

  constructor() {
    this.authData = new AuthData();
  }

  getProfile() {
    return this.authData.profile;
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
    this.authData.refresh_token = localStorage.getItem("refresh");
    // this.handleRefresh(); // todo
    this.timer = setInterval(() => {
      this.checkAuth();
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
            this.authData.callWhenAuthetificated();
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
          localStorage.setItem("refresh", res.data.refresh_token);
          this.authData.callWhenAuthetificated();
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

  login() {
    //        console.log('login');
    window.location.replace(
      "https://met-hub.auth.eu-central-1.amazoncognito.com/login?client_id=vn2mg0efils48lijdpc6arvl9&response_type=code&scope=aws.cognito.signin.user.admin&redirect_uri=https://www.met-hub.com/callback"
    );
  }

  logout() {
    // clear id token and expiration
    this.authData.cancelAuth();
    localStorage.setItem("refresh", null);
    window.location.reload();
  }
}
