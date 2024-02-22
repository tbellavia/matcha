import {jwtDecode} from "jwt-decode";

export default class API {
    constructor() {
        this.url = "http://localhost:3000/api/user";
    }

    setToken(token) {
        localStorage.setItem("token", token);
    }

    getToken() {
        return localStorage.getItem("token");
    }

    injectToken(headers = {}) {
        return {
            ...headers,
            "Authorization": `bearer ${this.getToken()}`,
        }
    }

    getDecodedToken() {
        return jwtDecode(this.getToken());
    }
}