import { useReducer, useState } from "react";
import React, { useContext , useEffect } from "react";
import AppContext from "../../store/AppContext";
import PageHeader from "../../components/ui/page/PageHeader";
import styles from "./EditProfile.module.css";
import AddPhoto from "../../components/ui/photo/AddPhoto";
import Input from "../../components/ui/input/Input";
import DateInput from "../../components/ui/input/DateInput";
import CheckboxGroup from "../../components/ui/checkbox/CheckboxGroup";
import RadioButtonGroup from "../../components/ui/radio-button/RadioButtonGroup";
import InputTagList from "../../components/ui/tags/InputTagList";
import Button from "../../components/ui/button/Button";
import LocationInput from "../../components/ui/location/LocationInput";
import BioInput from "../../components/ui/input/BioInput";
import {
    validateBio,
    validateDate,
    validateGender,
    validateLocation,
    validatePhotos,
    validatePreferences,
    validateString,
    validateTags
} from "../../common/validation";
import Alert from "../../components/ui/alert/Alert";
import { fileToBase64 } from "../../common/utils";
import useFetch from "../../hooks/use-fetch";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import GenericPage from "../page/GenericPage";
import ProfileHeader from "../../components/ui/profile/ProfileHeader/ProfileHeader";
import AppDroddown from "../../components/ui/drawer-menu/AppDropdown";

function base64ToFile(base64String, filename) {

    
    // Extraire uniquement la partie binaire (en supprimant "data:image/...;base64,")
    const [metadata, base64Data] = base64String.split(',');
    
    // Vérification de la validité de metadata
    if (!metadata || !base64Data) {
        throw new Error("Invalid base64 string format");
    }

    const mimeMatch = metadata.match(/:(.*?);/);
    
    // Vérification de la validité du type MIME
    if (!mimeMatch) {
        throw new Error("Invalid metadata in base64 string");
    }
    
    const mimeType = mimeMatch[1];

    // Convertir la chaîne base64 en un tableau d'octets
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);

    // Créer un Blob
    const blob = new Blob([byteArray], { type: mimeType });

    // Créer un File à partir du Blob
    const file = new File([blob], filename, { type: mimeType });

    return file;
}


// function base64ToFile(base64String, filename) {
//     // Extraire uniquement la partie binaire (en supprimant "data:image/...;base64,")
//     const [metadata, base64Data] = base64String.split(',');
//     const mimeType = metadata.match(/:(.*?);/)[1]; // Obtenir le type MIME

//     // Convertir la chaîne base64 en un tableau d'octets
//     const byteCharacters = atob(base64Data);
//     const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
//     const byteArray = new Uint8Array(byteNumbers);

//     // Créer un Blob
//     const blob = new Blob([byteArray], { type: mimeType });

//     // Créer un File à partir du Blob
//     const file = new File([blob], filename, { type: mimeType });

//     return file;
// }

function createInitialState(value, fieldname) {
    return { valid: null, value, fieldname };
}

function createInputReducer(validateFn) {
    return (state, action) => {
        switch (action.type) {
            case "UPDATE":
                return { ...state, value: action.value };
            case "UPDATE_AND_VALIDATE":
                return { ...state, value: action.value, valid: validateFn(action.value) };
            case "VALIDATE":
                return { ...state, valid: validateFn(state.value) };
            default:
                throw new Error(`Unkown action '${action}'`);
        }
    }
}

function errorReducer(state, action) {
    switch (action.type) {
        case "PHOTOS":
            return "Votre profil doit contenir au moins 2 photos";
        case "FIRSTNAME":
            return "Votre prénom doit contenir au moins 1 caractère";
        case "LASTNAME":
            return "Votre nom doit contenir au moins 1 caractère";
        case "BIRTH_DATE":
            return "Vous devez avoir au moins 18 ans pour vous inscrire";
        case "LOCATION":
            return "Vous devez préciser une géolocalisation";
        case "GENRE":
            return "Vous devez renseigner votre genre";
        case "PREFERENCES":
            return "Vous devez au choisir moins une préférence";
        case "TAGS":
            return "Vous devez avoir au moins un tags";
        case "BIOGRAPHY":
            return "Votre biographie ne peut pas être vide, décrivez vous en 300 caractères :)";
        case "NETWORK":
            return action.value;
        case "CLEAR":
            return null;
        default:
            throw new Error(`Unknown action '${action}'`);
    }
}

const photosReducer = createInputReducer(validatePhotos);
const firstnameReducer = createInputReducer(validateString);
const lastnameReducer = createInputReducer(validateString);
const genreReducer = createInputReducer(validateGender);
const preferencesReducer = createInputReducer(validatePreferences);
const tagsReducer = createInputReducer(validateTags);
// TODO: Check if date is in valid range
const dateReducer = createInputReducer(validateDate);
// TODO: Make sure location is in France
const locationReducer = createInputReducer(validateLocation);
// TODO: Make sure bio is valid
const biographyReducer = createInputReducer(validateBio);

const genres = ["homme", "femme", "non binaire"];
// TODO: remove hard coded suggests
const dummySuggests = ["beer", "baseball", "football", "yoga", "healthy"];

const mapGenreToLabel = (genre) => {
    switch (genre) {
        case 1:
            return genres[0]; // "homme"
        case 2:
            return genres[1]; // "femme"
        case 4:
            return genres[2]; // "non binaire"
        default:
            console.error(`Genre non reconnu : ${genre}`);
            return ""; // Option par défaut
    }
};

const mapPrefToLabel = (pref) => {
    const listPref = {"homme":false,"femme":false,"non binaire":false}
    if (pref & 1){
        listPref["homme"] = true
    }
    if (pref & 2){
        listPref["femme"] = true
    } 
    if (pref & 4){
        listPref["non binaire"] = true
    }
    return listPref
};

function hasCreatedProfile(token) {
    const decoded = jwt_decode(token);
    console.log(decoded);
    return decoded.profile_created;
}

function EditProfile() {

    // const [infos, setInfos] = useState({});
    const ctx = useContext(AppContext);

    const navigate = useNavigate();

    // const [photos, dispatchPhotos] = useReducer(photosReducer, createInitialState([], "PHOTOS"));
    const [firstname, dispatchFirstname] = useReducer(firstnameReducer, createInitialState("", "FIRSTNAME"));
    // const [firstname, dispatchFirstname] = useReducer(firstnameReducer, createInitialState(tmpFirstname, "FIRSTNAME"));
    const [lastname, dispatchLastname] = useReducer(lastnameReducer, createInitialState("", "LASTNAME"));
    const [birthDate, dispatchBirthDate] = useReducer(dateReducer, createInitialState("", "BIRTH_DATE"));
    const [location, dispatchLocation] = useReducer(locationReducer, createInitialState("", "LOCATION"));
    const [genre, dispatchGenre] = useReducer(genreReducer, { valid: true, value: "homme", fieldname: "GENRE" });
    const [preferences, dispatchPreference] = useReducer(preferencesReducer, createInitialState("", "PREFERENCES"));
    const [tags, dispatchTags] = useReducer(tagsReducer, createInitialState([], "TAGS"));
    const [biography, dispatchBiography] = useReducer(biographyReducer, createInitialState("", "BIOGRAPHY"));
    const [error, dispatchError] = useReducer(errorReducer, null);
    const [allTags, setAllTags] = useState([])
    // const initialPhotos = [
    //     new File([""], "photo1.png", { type: "image/png" }),
    //     new File([""], "photo2.png", { type: "image/png" }),
    // ];
    const [photos, dispatchPhotos] = useReducer(photosReducer, createInitialState([], "PHOTOS"));

    const fields = [photos, firstname, lastname, birthDate, location, genre, preferences, tags, biography];
    const fetcher = useFetch();


    useEffect(() => {
        if (!hasCreatedProfile(ctx.token)) {
            navigate("/createProfile");
        }
    
        async function fetchData() {
            const config = {
                headers: {
                    Authorization: `Bearer ${ctx.token}`, // ajoute le jeton d'authentification dans l'en-tête
                },
            };
            try {
                const res = await axios.get('http://localhost:3000/api/user/profile/me', config);
                const birth = new Date(res.data.birth)
                console.log("Data fetched:", res.data); // Debug
                dispatchFirstname({
                    type: "UPDATE_AND_VALIDATE", 
                    value: res.data.first_name,  
                });
                dispatchLastname({
                    type: "UPDATE_AND_VALIDATE", 
                    value: res.data.last_name,  
                });
                dispatchBirthDate({
                    type: "UPDATE_AND_VALIDATE", 
                    value: `${birth.getFullYear().toString().padStart(4, '0')}-${(birth.getMonth()+1).toString().padStart(2, '0')}-${birth.getDate().toString().padStart(2, '0')}`,  
                });
                dispatchTags({
                    type: "UPDATE_AND_VALIDATE", 
                    value: res.data.tags ? res.data.tags.split(',') : [],  
                })
                dispatchBiography({
                    type: "UPDATE_AND_VALIDATE", 
                    value: res.data.biography,  
                })
                console.log(res.data.genre == 1 ? genres[0] : (res.data.genre == 2 ? genres[1] : genres[2]))
                dispatchGenre({
                    type: "UPDATE_AND_VALIDATE", 
                    value: mapGenreToLabel(res.data.genre),  
                })
                dispatchPreference({
                    type: "UPDATE_AND_VALIDATE", 
                    value: mapPrefToLabel(res.data.preference),  
                })
                // console.log("test : ",{lat : res.data.latitude, lng: res.data.longitude})
                dispatchLocation({
                    type: "UPDATE_AND_VALIDATE", 
                    value: {lat : res.data.latitude, lng: res.data.longitude},  
                })
                dispatchPhotos({
                    type: "UPDATE_AND_VALIDATE", 
                    value: [res.data.photo1!=null  ? base64ToFile("data:image/jpeg;base64,"+res.data.photo1, "photo1.png") : null,
                        res.data.photo2!=null ? base64ToFile("data:image/jpeg;base64,"+res.data.photo2, "photo2.png"): null,
                        res.data.photo3!=null ? base64ToFile("data:image/jpeg;base64,"+res.data.photo3, "photo3.png"): null,
                        res.data.photo4!=null ? base64ToFile("data:image/jpeg;base64,"+res.data.photo4, "photo4.png"): null,
                        res.data.photo5!=null ? base64ToFile("data:image/jpeg;base64,"+res.data.photo5, "photo5.png"): null,
                    ].filter(photo => photo !== null),  
                })
                const res2 = await axios.get('http://localhost:3000/api/user/profile/tags', config);
                // setAllTags(["test"])
                setAllTags(res2.data)
                // console.log("list des tags : ",res2.data)

            } catch (error) {
                console.error("Erreur lors de la récupération :", error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        // console.log("loc : ",photos.value)
    }, [photos.value]);

    /* Photos */
    const onPhotosChange = (value) => {
        // console.log("Photos : "+value)
        dispatchPhotos({ type: "UPDATE", value });
        dispatchError({ type: "CLEAR" });
    }

    const onPhotosValidate = (value) => {
        dispatchPhotos({ type: "VALIDATE" });
    }

    /* Firstname */
    const onFirstnameChange = (value) => {
        dispatchFirstname({ type: "UPDATE", value });
        dispatchError({ type: "CLEAR" });
    }

    const onFirstnameValidate = (value) => {
        dispatchFirstname({ type: "VALIDATE" });
    }

    /* Lastname */
    const onLastnameChange = (value) => {
        dispatchLastname({ type: "UPDATE", value });
        dispatchError({ type: "CLEAR" });
    }

    const onLastnameBlur = (value) => {
        dispatchLastname({ type: "VALIDATE" });
    }

    /* Birth Date */
    const onBirthDateChange = (value) => {
        // console.log("------------------------------------")
        // console.log(birthDate.value)
        dispatchBirthDate({ type: "UPDATE_AND_VALIDATE", value });
        dispatchError({ type: "CLEAR" });
    }

    const onBirthDateBlur = (value) => {
        dispatchBirthDate({ type: "UPDATE_AND_VALIDATE", value });

    }

    /* Location */
    const onLocationChange = (value) => {
        dispatchLocation({ type: "UPDATE_AND_VALIDATE", value });
        dispatchError({ type: "CLEAR" });
    }

    const onLocationBlur = (value) => {
        dispatchLocation({ type: "UPDATE_AND_VALIDATE", value });
    }

    /* Genre */
    const onGenreChange = (value) => {
        dispatchGenre({ type: "UPDATE", value });
        dispatchError({ type: "CLEAR" });
    }

    const onGenreValidate = (value) => {
        dispatchGenre({ type: "VALIDATE" });
    }

    /* Preferences */
    const onPreferencesChange = (value) => {
        console.log(value)
        dispatchPreference({ type: "UPDATE", value });
        dispatchError({ type: "CLEAR" });
    }

    const onPreferencesValidate = (value) => {
        dispatchPreference({ type: "VALIDATE" });
    }

    /* Tags */
    const onTagsChange = (value) => {
        dispatchTags({ type: "UPDATE", value });
        dispatchError({ type: "CLEAR" });
    }

    const onTagsValidate = (value) => {
        dispatchTags({ type: "VALIDATE" });
    }

    /* Bio */
    const onBiographyChange = (value) => {
        dispatchBiography({ type: "UPDATE", value });
        dispatchError({ type: "CLEAR" });
    }

    const onBiographyValidate = (value) => {
        dispatchBiography({ type: "VALIDATE" });
    }


    const onClickHandler = async () => {
        console.table({
            photos,
            firstname,
            lastname,
            birthDate,
            location,
            genre,
            preferences,
            tags,
            biography
        });

        const invalidField = fields.find(field => !field.valid);
        if (invalidField) {
            return dispatchError({ type: invalidField.fieldname });
        }
        try {
            const config = {
                headers: {
                  Authorization: `Bearer ${ctx.token}`, // ajoute le jeton d'authentification dans l'en-tête d'autorisation
                },
              };
            const response = await axios.put("http://localhost:3000/api/user/profile/me", {first_name: firstname.value,
                last_name: lastname.value,
                birth: birthDate.value,
                genre: genre.value,
                preference: preferences.value,
                biography: biography.value,
                tags: tags.value.join(','),
                latitude: location.value.lat,
                longitude: location.value.lng,
                photos: await Promise.all(photos.value.map(fileToBase64)),
                newTags: [],
            }, config);
            navigate("/feed");
        } catch (e) {
            dispatchError({ type: "NETWORK", value: e.message });
        }
    };

    return (
        <GenericPage className={styles.profile}>

        <ProfileHeader menuOnly={true}/>

            <section className={styles['create-profile__form']}>
                {/* Profile picture */}
                <div className={styles['create-profile__image-container']}>
                    <AddPhoto
                        onChange={onPhotosChange}
                        onBlur={onPhotosValidate}
                        init={photos.value}
                        
                        // init={[new File([""], "photo.png", { type: "image/png" }),]}
                    />
                </div>

                {/* Input group */}
                <div className={styles['create-profile__input-container']}>
                    {/* <Input
                        label="Prénom"
                        placeholder="John"
                        value={firstname.value || ""}
                        // defaultValue={firstname.value}
                        onChange={onFirstnameChange}
                        onBlur={onFirstnameValidate}
                    /> */}
                    <Input
                        label="Prénom"
                        placeholder="John"
                        value={firstname.value || ""} 
                        onChange={onFirstnameChange}
                        onBlur={onFirstnameValidate}
                    />
                    <Input
                        label="Nom"
                        placeholder="Doe"
                        value={lastname.value || ""}
                        onChange={onLastnameChange}
                        onBlur={onLastnameBlur}
                    />
                </div>

                {/* Input group */}
                <div className={styles['create-profile__input-container']}>
                    <DateInput
                        label="Date de naissance"
                        value={birthDate.value}
                        onChange={onBirthDateChange}
                        onBlur={onBirthDateBlur}
                    />
                    <LocationInput placeholder="Changer de localisation" onSubmit={onLocationChange} onBlur={onLocationBlur} />
                </div>

                {/* Input group */}
                <div className={styles['create-profile__input-container']}>
                    <div className={styles['create-profile__input-group']}>
                        <RadioButtonGroup
                            label="Genre"
                            initial={genre.value}
                            values={genres}
                            onChange={onGenreChange}
                            onBlur={onGenreValidate}
                        />
                    </div>
                    <div className={styles['create-profile__input-group']}>
                        <CheckboxGroup
                            label="Préférences"
                            initial={preferences.value}
                            values={genres}
                            onChange={onPreferencesChange}
                            onBlur={onPreferencesValidate}
                        />
                    </div>
                </div>

                {/* Tag group */}
                <div className={styles['create-profile__tags-container']}>
                    <InputTagList
                        initial={tags.value}
                        suggest={allTags}
                        // suggest={allTags}
                        onChange={onTagsChange}
                        onBlur={onTagsValidate}
                    />
                </div>

                {/* Bio */}
                <div className={styles['create-profile__bio-container']}>
                    <BioInput
                        value={biography.value}
                        onChange={onBiographyChange}
                        onBlur={onBiographyValidate}
                        limit={300}
                    />
                </div>

                {error &&
                    <div className={styles['create-profile__alert-container']}>
                        <Alert>{error}</Alert>
                    </div>
                }

                {/* Button */}
                <div className={styles['create-profile__button_container']}>
                    <Button 
                        variant="validation" 
                        onClick={onClickHandler}
                        className={styles['submit-button']}
                    >
                            valider
                    </Button>
                </div>
            </section>
        </GenericPage>
    );
}

export default EditProfile;