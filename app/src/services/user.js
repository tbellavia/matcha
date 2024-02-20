import API from "./api";
import axios from "axios";

export default class APIUser extends API {
    constructor() {
        super();
        this.url += "/profile"
    }

    async createProfile(
        photos,
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
            },
            {
                headers: this.injectToken(),
            }
        )
        await this._uploadPhotos(photos);
    }

    async _uploadPhotos(photos){
        const formData = new FormData();

        photos.forEach(photo => formData.append("photos", photo));
        await axios.post(
            `${this.url}/image/upload/me`,
            formData,
            { headers: this.injectToken() }
        );
    }
}