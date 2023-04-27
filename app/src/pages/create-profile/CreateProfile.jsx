import { useReducer } from "react";
import PageHeader from "../../components/ui/page/PageHeader";
import styles from "./CreateProfile.module.css";
import _ from "lodash";
import AddPhoto from "../../components/ui/photo/AddPhoto";
import Input from "../../components/ui/input/Input";
import DateInput from "../../components/ui/input/DateInput";
import CheckboxGroup from "../../components/ui/checkbox/CheckboxGroup";
import RadioButtonGroup from "../../components/ui/radio-button/RadioButtonGroup";
import InputTagList from "../../components/ui/tags/InputTagList";
import Button from "../../components/ui/button/Button";
import LocationInput from "../../components/ui/location/LocationInput";
import BioInput from "../../components/ui/input/BioInput";
import { validatePreferences } from "../../common/validation";

const initialInputState = { value: "", valid: null }

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

const photosReducer = createInputReducer(photos =>
    photos &&
    photos.length > 1 &&
    photos.length <= 5
);
const firstnameReducer = createInputReducer(firstname => !_.isEmpty(firstname));
const lastnameReducer = createInputReducer(lastname => !_.isEmpty(lastname));
const genreReducer = createInputReducer(genre => !_.isEmpty(genre));
const preferencesReducer = createInputReducer(validatePreferences);
const tagsReducer = createInputReducer(tags => !_.isEmpty(tags));
// TODO: Check if date is in valid range
const dateReducer = createInputReducer(date => _.isDate(date));
// TODO: Make sure location is in France
const locationReducer = createInputReducer(location => true);
// TODO: Make sure bio is valid
const biographyReducer = createInputReducer(bio => true);

const genres = ["homme", "femme", "non binaire"];
// TODO: remove hard coded suggests
const dummySuggests = ["beer", "baseball", "football", "yoga", "healthy"];

function CreateProfile() {
    const [photos, dispatchPhotos] = useReducer(photosReducer, { value: [], valid: null });
    const [firstname, dispatchFirstname] = useReducer(firstnameReducer, initialInputState);
    const [lastname, dispatchLastname] = useReducer(lastnameReducer, initialInputState);
    const [birthDate, dispatchBirthDate] = useReducer(dateReducer, initialInputState);
    const [location, dispatchLocation] = useReducer(locationReducer, initialInputState);
    const [genre, dispatchGenre] = useReducer(genreReducer, initialInputState);
    const [preferences, dispatchPreference] = useReducer(preferencesReducer, initialInputState);
    const [tags, dispatchTags] = useReducer(tagsReducer, { value: [], valid: null });
    const [biography, dispatchBiography] = useReducer(biographyReducer, initialInputState);

    console.clear();
    console.log("================================");
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

    /* Photos */
    const onPhotosChange = (value) => {
        dispatchPhotos({ type: "UPDATE", value });
    }

    const onPhotosValidate = (value) => {
        dispatchPhotos({ type: "VALIDATE" });
    }

    /* Firstname */
    const onFirstnameChange = (value) => {
        dispatchFirstname({ type: "UPDATE", value });
    }

    const onFirstnameValidate = (value) => {
        dispatchFirstname({ type: "VALIDATE" });
    }

    /* Lastname */
    const onLastnameChange = (value) => {
        dispatchLastname({ type: "UPDATE", value });
    }

    const onLastnameBlur = (value) => {
        dispatchLastname({ type: "VALIDATE" });
    }

    /* Birth Date */
    const onBirthDateChange = (value) => {
        dispatchBirthDate({ type: "UPDATE", value });
    }

    const onBirthDateBlur = (value) => {
        dispatchBirthDate({ type: "VALIDATE" });
    }

    /* Location */
    const onLocationChange = (value) => {
        dispatchLocation({ type: "UPDATE", value });
    }

    const onLocationBlur = (value) => {
        dispatchLocation({ type: "VALIDATE" });
    }

    /* Genre */
    const onGenreChange = (value) => {
        dispatchGenre({ type: "UPDATE", value });
    }

    const onGenreValidate = (value) => {
        dispatchGenre({ type: "VALIDATE" });
    }

    /* Preferences */
    const onPreferencesChange = (value) => {
        dispatchPreference({ type: "UPDATE", value });
    }

    const onPreferencesValidate = (value) => {
        dispatchPreference({ type: "VALIDATE" });
    }

    /* Tags */
    const onTagsChange = (value) => {
        dispatchTags({ type: "UPDATE", value });
    }

    const onTagsValidate = (value) => {
        dispatchTags({ type: "VALIDATE" });
    }

    /* Bio */
    const onBiographyChange = (value) => {
        dispatchBiography({ type: "UPDATE", value });
    }

    const onBiographyValidate = (value) => {
        dispatchBiography({ type: "VALIDATE" });
    }

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

                {/* Button */}
                <div className={styles['create-profile__button-container']}>
                    <Button variant="validation">valider</Button>
                </div>
            </section>
        </PageHeader>
    );
}

export default CreateProfile;