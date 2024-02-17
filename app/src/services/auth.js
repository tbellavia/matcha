import API from "./api";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

export default class APIAuth extends API {
    constructor() {
        super();
    }

    async signup(mail, password) {
        await axios.post(
            `${this.url}/signup`,
            {
                usermail: mail,
                passWord: password
            }
        );
    }

    async login(mail, password) {
        const { data } = await axios.post(
            `${this.url}/login`,
            {
                usermail: mail,
                passWord: password,
            }
        );
        const token = data["access_token"];

        this.setToken(token);
    }

    hasCreatedProfile() {
        const decoded = jwtDecode(this.getToken());

        return decoded["profile_created"];
    }
}