import axios from 'axios';

export default class Auth {
    profile: string;
    expiresAt: number;
    token: string;

    constructor() {
        this.profile = null;
        this.expiresAt = null;
        this.token = null;
    }

    getProfile() {
        return this.profile;
    }

    getToken() {
        return this.token;
    }

    fetchToken() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const code = urlParams.get('code')
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('client_id', 'vn2mg0efils48lijdpc6arvl9');
        params.append('code', code);
        params.append('redirect_uri', 'https://www.met-hub.com/callback');

        //        console.log('get token');
        return axios.post('https://met-hub.auth.eu-central-1.amazoncognito.com/oauth2/token', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }

    fetchProfile() {
        return fetch('/api/getUserProfile', {
            headers: {
                Authorization: `Bearer ${this.token}`,
            }
        });
    }

    handleAuthentication() {
        console.log('handle auth');
        return new Promise<void>((resolve, reject) => {
            this.fetchToken()
                .then(res => {
                    console.info(res.data);
                    this.token = res.data.access_token;
                    this.expiresAt = res.data.expires_in * 1000 + new Date().getTime();
                    this.profile = 'user';
                    resolve();
                }).catch(err => {
                    this.token = null;
                    this.expiresAt = null;
                    this.profile = null;
                    console.error(err);
                    return reject(err);
                });
        });
    }

    handleProfile() {
        console.log('handle profile');
        return new Promise<void>((resolve, reject) => {
            this.fetchProfile()
                .then(res => {
                    console.info(res);
                    resolve();
                }).catch(err => {
                    console.error(err);
                    return reject(err);
                });
        });
    }

    isAuthenticated() {
        //        console.info(this.expiresAt, new Date().getTime() < this.expiresAt);
        return new Date().getTime() < this.expiresAt;
    }

    login() {
        //        console.log('login');
        window.location.replace('https://met-hub.auth.eu-central-1.amazoncognito.com/login?client_id=vn2mg0efils48lijdpc6arvl9&response_type=code&scope=aws.cognito.signin.user.admin&redirect_uri=https://www.met-hub.com/callback');
    }

    logout() {
        // clear id token and expiration
        this.token = null;
        this.expiresAt = null;
        this.profile = null;
    }
}