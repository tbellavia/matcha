import { useReducer } from "react";
import PageHeader from "../../components/ui/page/PageHeader";
import styles from "./CreateProfile.module.css";
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
import { useCallback } from "react";

function createInitialState(value, fieldname) {
    return { valid: null, value, fieldname };
}

function createInputReducer(validateFn) {
    return (state, action) => {
        switch (action.type) {
            case "UPDATE":
                return { ...state, value: action.value };
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

function CreateProfile() {
    const [photos, dispatchPhotos] = useReducer(photosReducer, createInitialState([], "PHOTOS"));
    const [firstname, dispatchFirstname] = useReducer(firstnameReducer, createInitialState("", "FIRSTNAME"));
    const [lastname, dispatchLastname] = useReducer(lastnameReducer, createInitialState("", "LASTNAME"));
    const [birthDate, dispatchBirthDate] = useReducer(dateReducer, createInitialState("", "BIRTH_DATE"));
    const [location, dispatchLocation] = useReducer(locationReducer, createInitialState("", "LOCATION"));
    const [genre, dispatchGenre] = useReducer(genreReducer, { valid: true, value: "homme", fieldname: "GENRE" });
    const [preferences, dispatchPreference] = useReducer(preferencesReducer, createInitialState("", "PREFERENCES"));
    const [tags, dispatchTags] = useReducer(tagsReducer, createInitialState([], "TAGS"));
    const [biography, dispatchBiography] = useReducer(biographyReducer, createInitialState("", "BIOGRAPHY"));
    const [error, dispatchError] = useReducer(errorReducer, null);
    const fields = [photos, firstname, lastname, birthDate, location, genre, preferences, tags, biography];


    /* Photos */
    const onPhotosChange = (value) => {
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
        dispatchBirthDate({ type: "UPDATE", value });
        dispatchError({ type: "CLEAR" });
    }

    const onBirthDateBlur = (value) => {
        dispatchBirthDate({ type: "VALIDATE" });
    }

    /* Location */
    const onLocationChange = (value) => {
        dispatchLocation({ type: "UPDATE", value });
        dispatchError({ type: "CLEAR" });
    }

    const onLocationBlur = (value) => {
        dispatchLocation({ type: "VALIDATE" });
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

    const fetcher = useFetch();

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

        const data = {
            first_name: firstname.value,
            last_name: lastname.value,
            birthdate: birthDate.value,
            genre: genre.value,
            preference: preferences.value,
            biography: biography.value,
            tags: tags.value,
            latitude: location.value.lat,
            longitutde: location.value.lng,
            photos: await Promise.all(photos.value.map(fileToBase64)),
        }
        fetcher("/api/user/profile/me", "POST", {data})
        console.log(data);
    };

    return (
        <PageHeader className={styles['create-profile']}>
            <section className={styles['create-profile__form']}>
                {/* Profile picture */}
                <div className={styles['create-profile__image-container']}>
                    <AddPhoto
                        onChange={onPhotosChange}
                        onBlur={onPhotosValidate}
                    />
                </div>

                {/* Input group */}
                <div className={styles['create-profile__input-container']}>
                    <Input
                        label="Prénom"
                        placeholder="John"
                        value={firstname.value}
                        onChange={onFirstnameChange}
                        onBlur={onFirstnameValidate}
                    />
                    <Input
                        label="Nom"
                        placeholder="Doe"
                        value={lastname.value}
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
                    <LocationInput onSubmit={onLocationChange} onBlur={onLocationBlur} />
                </div>

                {/* Input group */}
                <div className={styles['create-profile__input-container']}>
                    <div className={styles['create-profile__input-group']}>
                        <RadioButtonGroup
                            label="Genre"
                            initial="homme"
                            values={genres}
                            onChange={onGenreChange}
                            onBlur={onGenreValidate}
                        />
                    </div>
                    <div className={styles['create-profile__input-group']}>
                        <CheckboxGroup
                            label="Préférences"
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
                        suggest={dummySuggests}
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
                <div className={styles['create-profile__button-container']}>
                    <Button variant="validation" onClick={onClickHandler}>valider</Button>
                </div>
            </section>
        </PageHeader>
    );
}

export default CreateProfile;