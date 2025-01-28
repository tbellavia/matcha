import API from "./api";
import axios from "axios";

export default class APIUser extends API {
    function

    constructor() {
        super();
        this.url += "/profile"
    }

    async getProfile() {
        return await axios.get(
            `${this.url}/me`,
            {headers: this.injectToken()},
        );
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
        // console.log({
        //     first_name: firstname,
        //     last_name: lastname,
        //     birth: birthdate.format("YYYY-MM-DD"),
        //     latitude: location.lat,
        //     longitude: location.lng,
        //     genre: gender,
        //     preference: preferences,
        //     tags: tags,
        //     biograpy: description,
        // })
        await axios.post(
            `${this.url}/me`,
            {
                first_name: firstname,
                last_name: lastname,
                birth: birthdate.format("YYYY-MM-DD"),
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

    async updateProfile(
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
        await axios.put(`${this.url}/me`,
            {
                first_name: firstname,
                last_name: lastname,
                birth: birthdate.format("YYYY-MM-DD"),
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
            );
        await this._uploadPhotos(photos);
    }

    async _uploadPhotos(photos) {
        const formData = new FormData();

        console.log("UPDATE PHOTOS");
        console.log(photos);
        photos.forEach(photo => formData.append("photos", photo));
        await axios.post(
            `${this.url}/image/upload/me`,
            formData,
            {headers: this.injectToken()}
        );
    }

    getUserId() {
        const infos = this.getDecodedToken();

        return infos.id_user;
    }

    hasCreatedProfile() {
        const infos = this.getDecodedToken();

        return infos.profile_created;
    }
}