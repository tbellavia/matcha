import API from "./api";
import axios from "axios";

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
}