import axios from "axios";

export default class Auth {
  profile: string;

  expiresAt: number;

  access_token: string;

  refresh_token: string;

  duration: number;

  constructor() {
    this.profile = null;
    this.expiresAt = null;
    this.access_token = null;
    this.refresh_token = null;
    this.duration = null;
  }

  getProfile() {
    return this.profile;
  }

  getAccessToken() {
    return this.access_token;
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
    params.append("refresh_token", this.refresh_token);

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
        Authorization: `Bearer ${this.access_token}`,
      },
    });
  }

  handleRefresh() {
    if (this.refresh_token != null) {
      console.log("handle refresh");
      return new Promise<void>((resolve, reject) => {
        this.refreshToken()
          .then((res) => {
            // console.info(res.data);
            this.access_token = res.data.access_token;
            this.expiresAt = res.data.expires_in * 1000 + Date.now();
            this.duration = res.data.expires_in * 1000;
            this.profile = "user";
            resolve();
          })
          .catch((err) => {
            this.access_token = null;
            this.refresh_token = null;
            this.expiresAt = null;
            this.profile = null;
            this.duration = null;
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
          this.access_token = res.data.access_token;
          this.refresh_token = res.data.refresh_token;
          this.expiresAt = res.data.expires_in * 1000 + Date.now();
          this.duration = res.data.expires_in * 1000;
          this.profile = "user";
          resolve();
        })
        .catch((err) => {
          this.access_token = null;
          this.refresh_token = null;
          this.expiresAt = null;
          this.duration = null;
          this.profile = null;
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
            this.profile = json;
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

  isAuthenticated() {
    // console.log("a: dev env");
    // return true;
    const time = Date.now();
    // console.info(time, this.expiresAt);
    if (time > this.expiresAt - this.duration / 2) {
      this.handleRefresh();
    }
    return time < this.expiresAt;
  }

  login() {
    //        console.log('login');
    window.location.replace(
      "https://met-hub.auth.eu-central-1.amazoncognito.com/login?client_id=vn2mg0efils48lijdpc6arvl9&response_type=code&scope=aws.cognito.signin.user.admin&redirect_uri=https://www.met-hub.com/callback"
    );
  }

  logout() {
    // clear id token and expiration
    this.access_token = null;
    this.refresh_token = null;
    this.expiresAt = null;
    this.profile = null;
    this.duration = null;
    window.location.reload();
  }
}
