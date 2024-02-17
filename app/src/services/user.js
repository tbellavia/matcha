import API from "./api";
import axios from "axios";

export default class APIUser extends API {
    constructor() {
        super();
        this.url += "/profile"
    }

    async createProfile(
        images,
        firstname,
        lastname,
        birthdate,
        location,
        gender,
        preferences,
        tags,
        description
    ) {
        await axios.post(
            `${this.url}/me`,
            {
                first_name: firstname,
                last_name: lastname,
                birthdate: birthdate,
                latitude: location.lat,
                longitude: location.lng,
                genre: gender,
                preference: preferences,
                tags: tags,
                biograpy: description,
                photos: images,
            },
            {
                headers: this.injectToken(),
            }
        )
    }
}