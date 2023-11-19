import API from "./api";
import axios from "axios";

export default class APIAuth extends API {
    constructor() {
        super();
    }

    async signup(mail, password) {
        const response = await axios.post(
            `${this.url}/signup`,
            {
                usermail: mail,
                passWord: password
            }
        );

        console.log(response);
    }
}